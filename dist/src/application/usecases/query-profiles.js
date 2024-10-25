"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryProfilesUseCase = void 0;
const axios_1 = __importDefault(require("axios"));
const browser_1 = require("../../domain/entities/browser");
const api_error_1 = __importDefault(require("../../utils/api-error"));
class QueryProfilesUseCase {
    constructor() { }
    async handle(user_id) {
        var _a;
        let browser = new browser_1.Browser(user_id);
        const API_KEY = 'c2c3cc9a89c16e91c3126d27ed882b81';
        // Monta a URL
        const url = browser.toUrl(`http://local.adspower.net:50555/api/v1/user/list?user_id=${user_id}`);
        console.log(url);
        try {
            // Faz a requisição GET
            const response = await axios_1.default.get(url, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Accept': 'application/json'
                }
            });
            // Retorna os dados da resposta
            return response.data;
        }
        catch (error) {
            // Se houver um erro na requisição, retorna um ApiError
            return new api_error_1.default({
                code: ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500,
                message: error.message || "An unknown error occurred",
                log: true,
            });
        }
    }
}
exports.QueryProfilesUseCase = QueryProfilesUseCase;
