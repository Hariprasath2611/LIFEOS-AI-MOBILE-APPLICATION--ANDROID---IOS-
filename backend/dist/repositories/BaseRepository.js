"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(item) {
        return this.model.create(item);
    }
    async find(filter = {}, options = {}) {
        return this.model.find(filter, null, options).exec();
    }
    async findOne(filter) {
        return this.model.findOne(filter).exec();
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async update(filter, update, options = { new: true }) {
        return this.model.findOneAndUpdate(filter, update, options).exec();
    }
    async updateById(id, update, options = { new: true }) {
        return this.model.findByIdAndUpdate(id, update, options).exec();
    }
    async delete(filter) {
        return this.model.deleteOne(filter).exec();
    }
    async deleteById(id) {
        return this.model.findByIdAndDelete(id).exec();
    }
    async count(filter) {
        return this.model.countDocuments(filter).exec();
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map