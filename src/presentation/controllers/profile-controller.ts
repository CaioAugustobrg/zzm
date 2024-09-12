import { GetProfilesIdsByUser } from "../../application/usecases/get-profile-ids-by-user";
import axios from "axios";
import { FindProfileUseCase } from "../../application/usecases/find-profile";
import logger from "../../utils/logger";
import ApiError from "../../utils/api-error";
import { ProfileParameters } from "../../domain/types/profile";
import { Request, Response } from "express";
import { browserController } from "../../main/factory/browser-factory";
import { OpenBrowserParameters } from "../../domain/types/browser";
import { BrowserManager } from "../../application/usecases/browser-manager";
import { OpenBrowserUseCase } from "../../application/usecases/open-browser";
import { CloseBrowserUseCase } from "../../application/usecases/close-browser";
import { BrowserController } from "./browser-controller";
import puppeteer from 'puppeteer'
import path from 'path'
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export class ProfileController {
    browserController: BrowserController;
    constructor(
        private readonly findProfileUseCase: FindProfileUseCase,

        // private browserManager: BrowserManager

    ) {
        const openBrowserUseCase = new OpenBrowserUseCase();
        const closeBrowserUseCase = new CloseBrowserUseCase();
        this.browserController = new BrowserController(openBrowserUseCase, closeBrowserUseCase);
    }

    async findProfile(request: Request, response: Response) {
        const API_KEY = 'e30d320a165c400f1ef974619fe1ae26';
        try {
            const {
                group_id,
                user_id,
                serial_number,
                user_sort,
                page,
                page_size
            } = request.body;
            console.log('User ID:', user_id);


            const result = await this.findProfileUseCase.handle(request.body);

            if (typeof result === 'string') {

                const apiResponse = await axios.get(result, {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Accept': 'application/json'
                    }
                });
                logger.info('Received data:', { data: apiResponse.data });

                return response.status(200).json(apiResponse.data);
            }

            if (result instanceof ApiError) {
                logger.error('Error in use case:', { error: result.message, code: result.code });
                return response.status(result.code).json({ message: result.message });
            }
            return response.status(200).json(result);
        } catch (error: any) {
            logger.error('Unexpected error:', { error: error.message });
            return response.status(500).json({ message: 'Internal server error' });
        }
    }



    async findAllProfiles(request: Request, response: Response) {
        try {
            const getProfilesIdsByUser = new GetProfilesIdsByUser();
            const userIds = await getProfilesIdsByUser.handle();

            const ids = userIds.userIds;

            for (const userId of ids) {
                try {
                    const data = await this.browserController.OpenBrowser(userId);
                    console.log('OpenBrowser response data:', data.data.ws.puppeteer);




                    (async () => {
                        try {
                            const puppeteerUrl = data.data.ws.puppeteer
                            const browser = await puppeteer.connect({
                                browserWSEndpoint: puppeteerUrl,
                            });
                            const extensionPath = path.resolve('C:/ADSPOWER GLOBAL/ext/1022642');

                          //  await puppeteer.launch({
                          //      headless: false,
                          //      args: [
                          //          `--disable-extensions-except=${extensionPath}`,
                          //          `--load-extension=${extensionPath}`
                          //      ]
                          //  })
                            const pages = await browser.pages();
                            console.log(pages.length)
                          const targetPage = pages[0];
                            await targetPage.bringToFront();
                           //   if (pages.length > 1) {
                           //     if (pages.length > 1) {
                           //       await pages[0].close();
                           //       console.log('Aba na posição 2 fechada');
                           //     }
                            //  }
                             delay(1000)
                              await targetPage.locator('.r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi').click();

                            //  if (pages.length > 0) {
                            //     await pages[0].close();
                            //    console.log('Aba na posição 1 fechada');
                            // }
                            // }
                        } catch (error) {
                            console.error('Failed to connect to browser:', error);
                        }
                    })().catch((error) => {
                        console.log(error)
                    });

                    //  await new Promise(resolve => setTimeout(resolve, 1500));

                    // Feche o navegador
                    // await this.browserController.CloseBrowser(userId);
                } catch (error: any) {
                    logger.error(`Error processing userId ${userId}:`, { error: error.message });
                }
            }

            return response.status(200).json({ message: 'Process completed successfully' });
        } catch (error: any) {
            logger.error('Unexpected error:', { error: error.message });
            return response.status(500).json({ message: 'Internal server error' });
        }
    }
}