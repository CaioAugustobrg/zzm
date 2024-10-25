"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfilesIdsByUser = void 0;
const user_1 = require("../../domain/entities/user");
class GetProfilesIdsByUser {
    constructor() { }
    async handle(profilesId) {
        try {
            const userIds = new user_1.User(profilesId);
            return userIds;
        }
        catch (error) {
            console.error('Erro ao processar os IDs:', error);
            throw error;
        }
    }
}
exports.GetProfilesIdsByUser = GetProfilesIdsByUser;
