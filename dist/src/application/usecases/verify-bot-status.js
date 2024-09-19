"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageHandler = void 0;
class PageHandler {
    constructor(page) {
        this.page = page;
    }
    async handlePage(targetPage, userId) {
        const selector = 'input.MuiSwitch-input.css-q7japm';
        const switchSelector = 'input[type="checkbox"][role="switch"]';
        try {
            // Espera pelos seletores
            await this.page.waitForSelector(selector);
            await this.page.waitForSelector(switchSelector);
            // Verifica se o primeiro checkbox está marcado
            const isChecked = await this.page.evaluate((selector) => {
                const element = document.querySelector(selector);
                return element ? element.checked : false;
            }, selector);
            // Verifica se o segundo checkbox está marcado
            const isChatBtnChecked = await this.page.evaluate((switchSelector) => {
                const element = document.querySelector(switchSelector);
                return element ? element.checked : false;
            }, switchSelector);
            // Retorna o userId se algum dos checkboxes não estiver marcado
            if (!isChecked || !isChatBtnChecked) {
                console.log(`User ${userId} not running. Checkboxes status - isChecked: ${isChecked}, isChatBtnChecked: ${isChatBtnChecked}`);
                return userId;
            }
            console.log(`User ${userId} is running.`);
            return 'running ok';
        }
        catch (error) {
            console.error(`Error handling page for user ${userId}: ${error.message}`);
            return userId; // Retorna userId em caso de erro
        }
    }
}
exports.PageHandler = PageHandler;
