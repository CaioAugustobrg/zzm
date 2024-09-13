import { Page } from 'puppeteer';  // Importa apenas o tipo Page se o navegador já estiver gerenciado em outro lugar
import ApiError from "../../utils/api-error";

export class Login {
    private pageUrl: string;
    private cupidBotKey: string;
    private emailInputHTMLClass: string;
    private passwordInputHTMLClass: string;
    private loginButtonHTMLClass: string
    constructor(
        pageUrl: string,
        cupidBotKey: string,
        emailInputHTMLClass: string,
        passwordInputHTMLClass: string,
        loginButtonHTMLClass: string
    ) {
        this.pageUrl = pageUrl;
        this.cupidBotKey = cupidBotKey;
        this.emailInputHTMLClass = emailInputHTMLClass;
        this.loginButtonHTMLClass = loginButtonHTMLClass;
        this.passwordInputHTMLClass = passwordInputHTMLClass
    }
}
