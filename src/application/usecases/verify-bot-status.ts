import { Page } from "puppeteer";

export class PageHandler {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async handlePage(targetPage: string, userId: string) {
        const selector = 'input.MuiSwitch-input.css-q7japm';
        const switchSelector = 'input[type="checkbox"][role="switch"]';

        try {
            // Espera pelos seletores
            await this.page.waitForSelector(selector);
            await this.page.waitForSelector(switchSelector);

            // Verifica se o primeiro checkbox está marcado
            const isChecked = await this.page.evaluate((selector: string) => {
                const element = document.querySelector(selector) as HTMLInputElement;
                return element ? element.checked : false;
            }, selector);

            // Verifica se o segundo checkbox está marcado
            const isChatBtnChecked = await this.page.evaluate((switchSelector: string) => {
                const element = document.querySelector(switchSelector) as HTMLInputElement;
                return element ? element.checked : false;
            }, switchSelector);

            // Retorna o userId se algum dos checkboxes não estiver marcado
            if (!isChecked || !isChatBtnChecked) {
                console.log(`User ${userId} not running. Checkboxes status - isChecked: ${isChecked}, isChatBtnChecked: ${isChatBtnChecked}`);
                return userId;
            }
    //        await this.page.waitForSelector('.css-146c3p1[data-testid="tweetText"]'); // Seletor CSS

    // Clique no elemento
    //await this.page.click('.css-146c3p1[data-testid="tweetText"]');
        
            console.log(`User ${userId} is running.`);
            return 'running ok';

        } catch (error: any) {
            console.error(`Error handling page for user ${userId}: ${error.message}`);
            return userId; // Retorna userId em caso de erro
        }
    }
}
