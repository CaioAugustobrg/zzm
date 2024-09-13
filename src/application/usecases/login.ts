import { Page } from 'puppeteer';
import ApiError from "../../utils/api-error";

export class Login {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async handle(
        emailInputHTMLClass: string,
        passwordInputHTMLClass: string,
        loginButtonHTMLClass: string
    ): Promise<string | ApiError> {
        try {
            await this.page.type(`.${emailInputHTMLClass}`, 'your-password');
            await this.page.type(`.${passwordInputHTMLClass}`, 'your-password');
            await this.page.click(`.${loginButtonHTMLClass}`);
            await this.page.waitForNavigation(); 
            
            return 'Login realizado com sucesso';
        } catch (error: any) {
            return new ApiError({
                code: 500,
                message: `Erro ao processar o login: ${error.message}`,
                log: true,
            });
        }
    }
}
