import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useTaskStore } from '../../store/taskStore';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import Svg, { Path } from 'react-native-svg';

export default function TasksScreen() {
  const { tasks, isLoading, fetchTasks, addTask, updateTask, deleteTask, runAIPrioritizer, prioritizationSuggestions } = useTaskStore();
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newCategory, setNewCategory] = useState('Personal');
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('todo');

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTitle.trim()) return;
    await addTask({
      title: newTitle.trim(),
      priority: newPriority,
      category: newCategory,
      status: 'todo',
      recurrence: 'none'
    });
    setNewTitle('');
  };

  const handleToggleComplete = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
    await updateTask(taskId, { status: nextStatus });
  };

  const handleRunAI = async () => {
    await runAIPrioritizer();
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'todo') return t.status !== 'done';
    if (filter === 'done') return t.status === 'done';
    return true;
  });

  return (
    <ScrollView className="flex-grow bg-background px-6 pt-16 pb-12">
      
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-mutedText text-sm uppercase tracking-wider font-semibold">Tasks</Text>
          <Text className="text-white text-2xl font-bold mt-0.5">Workspace</Text>
        </View>
        
        <TouchableOpacity
          onPress={handleRunAI}
          disabled={isLoading}
          className="bg-primary border border-primary rounded-xl flex-row items-center py-2 px-4 active:opacity-80"
        >
          {isLoading ? (
            <ActivityIndicator color="#0A0A0A" size="small" />
          ) : (
            <>
              <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" className="mr-1.5">
                <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </Svg>
              <Text className="text-background font-bold text-xs">AI Prioritize</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Task Creation Input Card */}
      <GlassCard className="p-4 mb-6">
        <Text className="text-white text-base font-semibold mb-3">Add Smart Task</Text>
        <View className="bg-background rounded-xl border border-glassBorder px-4 py-3 mb-3">
          <TextInput
            className="text-white text-base"
            placeholder="what needs to be accomplished?..."
            placeholderTextColor="#A0A0A0"
            value={newTitle}
            onChangeText={setNewTitle}
          />
        </View>
        
        {/* Priority Toggles */}
        <View className="flex-row justify-between mb-4">
          {(['low', 'medium', 'high'] as const).map(p => (
            <TouchableOpacity
              key={p}
              onPress={() => setNewPriority(p)}
              className={`flex-1 mx-1.5 py-2.5 rounded-lg border items-center justify-center ${
                newPriority === p ? 'bg-primary/10 border-primary' : 'bg-transparent border-glassBorder'
              }`}
            >
              <Text className={`text-xs uppercase font-bold ${newPriority === p ? 'text-primary' : 'text-white'}`}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Inputs Row */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-mutedText text-xs font-semibold uppercase">Category</Text>
          <View className="flex-row">
            {['Work', 'Health', 'Personal'].map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setNewCategory(cat)}
                className={`ml-2 px-3 py-1.5 rounded-md border ${
                  newCategory === cat ? 'bg-white/10 border-white/30' : 'bg-transparent border-glassBorder'
                }`}
              >
                <Text className="text-white text-xs font-medium">{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <GlassButton title="Create Task" onPress={handleAddTask} variant="outline" />
      </GlassCard>

      {/* Filters Toggle Row */}
      <View className="flex-row mb-6">
        {(['todo', 'done', 'all'] as const).map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`flex-1 py-2 border-b-2 items-center justify-center ${
              filter === f ? 'border-primary' : 'border-transparent'
            }`}
          >
            <Text className={`text-sm font-semibold capitalize ${filter === f ? 'text-primary' : 'text-mutedText'}`}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Suggestion Insight Banner */}
      {prioritizationSuggestions && prioritizationSuggestions.insights && (
        <GlassCard className="border-l-4 border-l-primary p-3 mb-4">
          <Text className="text-white text-xs font-semibold">AI Insight: {prioritizationSuggestions.insights[0]}</Text>
        </GlassCard>
      )}

      {/* Task List */}
      <View className="mb-12">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <GlassCard key={task._id} className="mb-3 p-4 flex-row justify-between items-center">
              
              {/* Left Side Toggles Checkbox */}
              <TouchableOpacity
                onPress={() => handleToggleComplete(task._id, task.status)}
                className="flex-row items-center flex-1 pr-4"
              >
                <View className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${
                  task.status === 'done' ? 'bg-primary border-primary' : 'border-glassBorder'
                }`}>
                  {task.status === 'done' && (
                    <Text className="text-background text-xs font-black">✓</Text>
                  )}
                </View>
                
                <View className="flex-1">
                  <Text className={`text-white text-sm font-medium ${
                    task.status === 'done' ? 'line-through text-mutedText' : ''
                  }`}>
                    {task.title}
                  </Text>
                  <View className="flex-row items-center mt-1.5">
                    <Text className="text-mutedText text-xs font-medium mr-2">{task.category}</Text>
                    {task.aiPrioritized && (
                      <View className="bg-primary/20 rounded-md px-1.5 py-0.5 border border-primary/20">
                        <Text className="text-primary text-[8px] font-black uppercase">AI Prioritized</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>

              {/* Right Side Options / Priority Tag & Delete */}
              <View className="flex-row items-center">
                <View className={`rounded-full px-2 py-0.5 mr-2 ${
                  task.priority === 'high' ? 'bg-red-500/10' : task.priority === 'medium' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                }`}>
                  <Text className={`text-[9px] uppercase font-bold ${
                    task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                  }`}>{task.priority}</Text>
                </View>
                
                <TouchableOpacity onPress={() => deleteTask(task._id)} className="p-1 active:opacity-60">
                  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2">
                    <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </Svg>
                </TouchableOpacity>
              </View>

            </GlassCard>
          ))
        ) : (
          <Text className="text-mutedText text-center py-12">No tasks found. Try creating one!</Text>
        )}
      </View>

    </ScrollView>
  );
}
