"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = void 0;
const firebase_1 = require("../config/firebase");
const UserService_1 = require("../services/UserService");
const MemoryService_1 = require("../services/MemoryService");
const gemini_1 = require("../config/gemini");
const repositories_1 = require("../repositories");
const setupSocketIO = (io) => {
    // Authentication handshake middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.query.token;
            if (!token) {
                return next(new Error('Authentication token required'));
            }
            const decodedToken = await (0, firebase_1.verifyFirebaseToken)(token);
            if (!decodedToken || !decodedToken.uid) {
                return next(new Error('Invalid token'));
            }
            const user = await UserService_1.userService.getOrCreateUser(decodedToken.uid, decodedToken.email || '');
            // Attach verified user to socket data context
            socket.data.user = user;
            next();
        }
        catch (error) {
            console.error('Socket handshake authentication failed:', error);
            next(new Error('Socket authentication error'));
        }
    });
    io.on('connection', (socket) => {
        const user = socket.data.user;
        console.log(`Socket client connected: ${socket.id} (User: ${user.uid})`);
        // Join user's personal room for notification broadcasts
        socket.join(user.uid);
        socket.on('joinConversation', (conversationId) => {
            socket.join(conversationId);
            console.log(`User ${user.uid} joined conversation room: ${conversationId}`);
        });
        socket.on('leaveConversation', (conversationId) => {
            socket.leave(conversationId);
            console.log(`User ${user.uid} left conversation room: ${conversationId}`);
        });
        socket.on('typing', (data) => {
            socket.to(data.conversationId).emit('typingStatus', { userId: user.uid, isTyping: true });
        });
        socket.on('stopTyping', (data) => {
            socket.to(data.conversationId).emit('typingStatus', { userId: user.uid, isTyping: false });
        });
        socket.on('sendMessage', async (data) => {
            const { conversationId, content } = data;
            if (!conversationId || !content)
                return;
            try {
                // 1. Save user query to history database
                const userMsg = await MemoryService_1.memoryService.saveMemory(user.uid, conversationId, 'user', content);
                // Echo user message back to user's client confirmation
                socket.emit('messageSaved', userMsg);
                // 2. Broadcast typing status of AI assistant
                io.to(conversationId).emit('typingStatus', { userId: 'ai', isTyping: true });
                // 3. Fetch context history to feed Gemini
                const context = await MemoryService_1.memoryService.retrieveContext(user.uid, content);
                const model = (0, gemini_1.getGeminiModel)('gemini-1.5-flash');
                let fullAiText = '';
                if (model) {
                    // Streaming via official Gemini SDK
                    const prompt = `You are a helpful LifeOS assistant.\nContext:\n${context}\n\nUser Input: ${content}`;
                    const result = await model.generateContentStream(prompt);
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        fullAiText += chunkText;
                        // Emit chunks to the specific conversation room
                        io.to(conversationId).emit('chatResponseChunk', {
                            conversationId,
                            chunk: chunkText,
                            fullResponse: fullAiText
                        });
                    }
                }
                else {
                    // Fallback demo streaming generator simulation (yields words one by one)
                    const mockReply = `I am here as your LifeOS AI Assistant. (Streaming in local mock mode)

You said: "${content}". Let's schedule this task, build habits, or check your calendars.`;
                    const words = mockReply.split(' ');
                    for (let i = 0; i < words.length; i++) {
                        await new Promise(r => setTimeout(r, 60)); // typing simulation delay
                        const wordWithSpace = words[i] + (i === words.length - 1 ? '' : ' ');
                        fullAiText += wordWithSpace;
                        io.to(conversationId).emit('chatResponseChunk', {
                            conversationId,
                            chunk: wordWithSpace,
                            fullResponse: fullAiText
                        });
                    }
                }
                // 4. Save final complete AI message in memory DB
                const savedAiMsg = await MemoryService_1.memoryService.saveMemory(user.uid, conversationId, 'ai', fullAiText);
                // 5. Broadcast complete message metadata and stop typing status
                io.to(conversationId).emit('typingStatus', { userId: 'ai', isTyping: false });
                io.to(conversationId).emit('messageComplete', savedAiMsg);
                // Sync conversation latest preview
                await repositories_1.conversationRepo.updateById(conversationId, { summary: content.substring(0, 40) + '...' });
            }
            catch (error) {
                console.error('Socket message streaming failed:', error);
                io.to(conversationId).emit('typingStatus', { userId: 'ai', isTyping: false });
                socket.emit('socketError', { message: 'AI failed to process message' });
            }
        });
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
exports.setupSocketIO = setupSocketIO;
//# sourceMappingURL=index.js.map