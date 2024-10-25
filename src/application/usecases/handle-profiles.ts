import { Browser } from "puppeteer";
import { NotRunningProfile } from "../../domain/types/profile";
import { PageHandler } from "./verify-bot-status";
import logger from "../../utils/logger";
import { setTimeout } from "timers/promises";

export class ProfilePageHandler {
    constructor() {}

    async handle(browser: Browser, socialMedia: string, userId: string, notRunningProfiles: NotRunningProfile[]) {
        const targetUrl = socialMedia === 'reddit' ? process.env.REDDIT_URL! : process.env.TWITTER_URL!;
        console.log(targetUrl)
        try {
            const pages = await browser.pages();
            for (let page of pages) {
                if (!page.url().startsWith(targetUrl)) {
                    await page.close();
                }
            }

            const pageURL = await browser.newPage();
            await pageURL.bringToFront();
            await pageURL.goto(targetUrl, { waitUntil: 'load' });

            const verifyCupidBot = new PageHandler(pageURL);
            const response = await verifyCupidBot.handlePage(targetUrl, userId);

            if (response !== 'running ok') {
                notRunningProfiles.push({ profileId: response, url: browser.wsEndpoint() });
            }
        } catch (error: any) {
            notRunningProfiles.push({ profileId: userId, url: browser.wsEndpoint() });
            console.error(`Error handling profile pages for user ${userId}: ${error.message}`);
            logger.error(`Error handling profile pages for user ${userId}: ${error.stack}`);
        }
        await setTimeout(3000);
    }
}
