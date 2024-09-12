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
            // Pergunta ao usuário por IDs separados por espaço
            const idsInput = await this.askQuestion('Por favor, insira os IDs separados por espaço: ');
            // Divide os IDs por espaço e remove espaços em branco adicionais
            const ids = idsInput.split(/\s+/).map(id => id.trim()).filter(id => id.length > 0);
            // Cria uma instância de User com os IDs
            const userIds = new user_1.User(ids);
            console.log('User IDs:', userIds);
            return userIds;
        }
        catch (error) {
            console.error('Erro ao fazer a pergunta:', error);
            throw error;
        }
        finally {
            // Fecha a interface readline
            rl.close();
        }
    }
}
exports.GetProfilesIdsByUser = GetProfilesIdsByUser;
