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
            if (isChecked === false || isChatBtnChecked === false) {
                return userId
            }
            return 'running ok';

          //   await  await this.page.setRequestInterception(true);

         //    await this.page.on('request', request => {
         //       const url = request.url();
            
                // Aqui você pode filtrar as requisições do Cupidbot
          //      if (url.includes('https://cupidbot-382905.uc.r.appspot.com/api/scrapedAppAccount')) {
         ///      }
            
                // Continuar com a requisição normalmente
          //      request.continue();
         //   });
            
            // Monitorar respostas
         //   await this.page.on('response', async response => {
         //       const url = response.url();
         //       if (url.includes('cupidbot')) {
         //           const status = response.status();
            
            //        try {
            //            const data = await response.json(); 
            //            console.log('Status Code:', status, userId);
            //            if (!isChecked || !isChatBtnChecked) {
            //                console.log(`User ${userId} not running. Checkboxes status - isChecked: ${isChecked}, isChatBtnChecked: ${isChatBtnChecked}`);
             //               return userId;
            //            }
            //            console.log('Response v sdfsdfsdf:', data);
            //        } catch (error: any) {
            //            console.error(`Erro ao processar resposta para ${url}: ${error.message}`);
            //        }
            //    }
        //    });

            // Retorna o userId se algum dos checkboxes não estiver marcado
          
    //        await this.page.waitForSelector('.css-146c3p1[data-testid="tweetText"]'); // Seletor CSS

    // Clique no elemento
    //await this.page.click('.css-146c3p1[data-testid="tweetText"]');
        
            //console.log(`User ${userId} is running.`);

        } catch (error: any) {
            console.error(`Error handling page for user ${userId}: ${error.message}`);
            return userId; // Retorna userId em caso de erro
        }
    }
}
