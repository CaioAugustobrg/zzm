"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const api_error_1 = __importDefault(require("../../utils/api-error"));
class Login {
    constructor(page) {
        this.page = page;
    }
    async handle(emailInputHTMLClass, passwordInputHTMLClass, loginButtonHTMLClass) {
        try {
            await this.page.type(`.${emailInputHTMLClass}`, 'your-password');
            await this.page.type(`.${passwordInputHTMLClass}`, 'your-password');
            await this.page.click(`.${loginButtonHTMLClass}`);
            await this.page.waitForNavigation();
            return 'Login realizado com sucesso';
        }
        catch (error) {
            return new api_error_1.default({
                code: 500,
                message: `Erro ao processar o login: ${error.message}`,
                log: true,
            });
        }
    }
}
exports.Login = Login;
