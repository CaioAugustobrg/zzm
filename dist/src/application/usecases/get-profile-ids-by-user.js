"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfilesIdsByUser = void 0;
const user_1 = require("../../domain/entities/user");
const readline_1 = __importDefault(require("readline"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
class GetProfilesIdsByUser {
    constructor() { }
    askQuestion(query) {
        return new Promise((resolve) => {
            rl.question(query, (answer) => {
                resolve(answer);
            });
        });
    }
    async handle() {
        try {
            const idsInput = await this.askQuestion('Por favor, insira os IDs separados por espaço: ');
            const ids = idsInput.trim().split(/\s+/).filter(id => id.length > 0);
            const userIds = new user_1.User(ids);
            console.log('User IDs:', userIds);
            return userIds;
        }
        catch (error) {
            console.error('Erro ao fazer a pergunta:', error);
            throw error;
        }
        finally {
            rl.close();
        }
    }
}
exports.GetProfilesIdsByUser = GetProfilesIdsByUser;
