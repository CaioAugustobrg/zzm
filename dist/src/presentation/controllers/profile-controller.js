"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const get_profile_ids_by_user_1 = require("../../application/usecases/get-profile-ids-by-user");
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../../utils/logger"));
const api_error_1 = __importDefault(require("../../utils/api-error"));
const open_browser_1 = require("../../application/usecases/open-browser");
const close_browser_1 = require("../../application/usecases/close-browser");
const browser_controller_1 = require("./browser-controller");
const puppeteer_1 = __importDefault(require("puppeteer"));
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class ProfileController {
    constructor(findProfileUseCase) {
        this.findProfileUseCase = findProfileUseCase;
        const openBrowserUseCase = new open_browser_1.OpenBrowserUseCase();
        const closeBrowserUseCase = new close_browser_1.CloseBrowserUseCase();
        this.browserController = new browser_controller_1.BrowserController(openBrowserUseCase, closeBrowserUseCase);
    }
    async findProfile(request, response) {
        const API_KEY = 'e30d320a165c400f1ef974619fe1ae26';
        try {
            const { group_id, user_id, serial_number, user_sort, page, page_size } = request.body;
            console.log('User ID:', user_id);
            const result = await this.findProfileUseCase.handle(request.body);
            if (typeof result === 'string') {
                const apiResponse = await axios_1.default.get(result, {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Accept': 'application/json'
                    }
                });
                logger_1.default.info('Received data:', { data: apiResponse.data });
                return response.status(200).json(apiResponse.data);
            }
            if (result instanceof api_error_1.default) {
                logger_1.default.error('Error in use case:', { error: result.message, code: result.code });
                return response.status(result.code).json({ message: result.message });
            }
            return response.status(200).json(result);
        }
        catch (error) {
            logger_1.default.error('Unexpected error:', { error: error.message });
            return response.status(500).json({ message: 'Internal server error' });
        }
    }
    async findAllProfiles(request, response) {
        try {
            const getProfilesIdsByUser = new get_profile_ids_by_user_1.GetProfilesIdsByUser();
            const userIds = await getProfilesIdsByUser.handle();
            const ids = userIds.userIds;
            for (const userId of ids) {
                console.log('User ID:', userId);
                try {
                    const data = await this.browserController.OpenBrowser(userId);
                    console.log('OpenBrowser response data:', data.data.ws.puppeteer);
                    const puppeteerUrl = data.data.ws.puppeteer;
                    const browser = await puppeteer_1.default.connect({
                        browserWSEndpoint: puppeteerUrl,
                    });
                    const pages = await browser.pages();
                    console.log('Number of pages:', pages.length);
                    let targetPage, targetPage2;
                    if (pages.length > 1) {
                        targetPage = pages[1];
                        targetPage2 = pages[0];
                    }
                    else if (pages.length > 0) {
                        targetPage = pages[0];
                    }
                    else {
                        console.log('No pages found.');
                        continue;
                    }
                    const handlePage = async (page) => {
                        const pageURL = page.url();
                        if (pageURL.startsWith('https://x')) {
                            console.log('URL found:', pageURL);
                            const screenSize = await page.evaluate(() => ({
                                width: window.screen.width,
                                height: window.screen.height,
                                availWidth: window.screen.availWidth,
                                availHeight: window.screen.availHeight
                            }));
                            console.log('Screen Size:', screenSize);
                            await page.setViewport({ width: screenSize.width, height: screenSize.height });
                            await page.bringToFront();
                            await console.log(page.url());
                            const selector = 'input.MuiSwitch-input.css-q7japm';
                            await page.waitForSelector(selector);
                            const isChecked = await page.evaluate((selector) => {
                                const element = document.querySelector(selector);
                                return element ? element.checked : false;
                            }, selector);
                            console.log('Checked:', isChecked);
                            if (isChecked === false) {
                                await page.click(selector);
                                await page.click('#\\:re\\:');
                            }
                        }
                    };
                    if (targetPage)
                        await handlePage(targetPage);
                    if (targetPage2)
                        await handlePage(targetPage2);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    // await this.browserController.CloseBrowser(userId);
                }
                catch (error) {
                    logger_1.default.error(`Error processing userId ${userId}:`, { error: error.message });
                }
            }
            return response.status(200).json({ message: 'Process completed successfully' });
        }
        catch (error) {
            logger_1.default.error('Unexpected error:', { error: error.message });
            return response.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.ProfileController = ProfileController;
