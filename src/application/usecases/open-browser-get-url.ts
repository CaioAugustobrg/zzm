import { BrowserController } from "../../presentation/controllers/browser-controller";
import logger from "../../utils/logger";

export class OpenBrowserAndGetUrl {
    constructor(
        private readonly browserController: BrowserController
    ) { }
    async handle(
        userId: string
    )
        : Promise<string> {
        try {
            const data = await this.browserController.OpenBrowser(userId);
            //  console.log('OpenBrowser response data:', data);
            if (!data || !data.data || !data.data.ws || !data.data.ws.puppeteer) {
                throw new Error(`Invalid response structure for user ID ${userId}`);
            }
            return data.data.ws.puppeteer;
        } catch (error: any) {
            console.error(`Error opening browser for user ID ${userId}: ${error.message}`);
            logger.error(`Error opening browser for user ID ${userId}: ${error.stack}`);
            throw error;
        }
    }
}