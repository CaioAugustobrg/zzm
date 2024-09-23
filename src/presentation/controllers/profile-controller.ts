import { GetProfilesIdsByUser } from "../../application/usecases/get-profile-ids-by-user";
import logger from "../../utils/logger";
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';

import ApiError from "../../utils/api-error";
import { NotRunningProfile } from "../../domain/types/profile";
import { Request, Response } from "express";
import { BrowserController } from "./browser-controller";
import puppeteer from 'puppeteer-extra';
import { Browser, executablePath } from "puppeteer";
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { PageHandler } from "../../application/usecases/verify-bot-status";
import { OpenBrowserUseCase } from "../../application/usecases/open-browser";
import { setTimeout } from 'node:timers/promises';
import { CloseBrowserUseCase } from "../../application/usecases/close-browser";
import csvParser from "csv-parser";
import { exec } from "child_process";
import path from "path";


puppeteer.use(StealthPlugin())


function ensureCsvFileExists(filePath: string) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '', 'utf8');
        console.log(`Arquivo ${filePath} criado.`);
    }
}

function logWithColor(message: string, color: string, bold: boolean = false) {
    const colors: { [key: string]: string } = {
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        reset: '\x1b[0m'
    };

    const boldPrefix = bold ? '\x1b[1m' : '';
    console.log(`${boldPrefix}${colors[color]}${message}${colors.reset}`);
}

function clearCsvFile(filePath: string) {
    fs.writeFileSync(filePath, '', 'utf8');
    console.log(`Conteúdo do arquivo ${filePath} apagado.`);
}

function openCsvFile(filePath: string) {
    const absolutePath = path.resolve(filePath);
    
    exec(`start "" "${absolutePath}"`, (error) => {
        if (error) {
            console.error('Erro ao abrir o arquivo:', error);
        }
    });
}

export class ProfileController {
    browserController: BrowserController;

    constructor() {
        this.browserController = new BrowserController(
            new OpenBrowserUseCase(),
            new CloseBrowserUseCase()
        );
    }
    
    async findProfile(request: Request, response: Response) {
    }
    
    async findAllProfiles(userIds: string[], socialMedia: string) {
        logWithColor(
            '⚠️ **Make sure the Cupid Bot extension is running on ADS POWER.**\n' +
            'If it’s not, press CTRL + C to stop, enable the extension, then run `npm start` and press ENTER.',
            'yellow'
        );
    
        const targetPage = 'https://x.com/messages';
        const csvFilePath = 'not_running_profiles.csv';
    
        let notRunningProfiles: NotRunningProfile[] = [];
        let runningProfiles: NotRunningProfile[] = [];
    
        try {
            for (const userId of userIds) {
                try {
                    logWithColor(`Running: ${userId}`, 'blue');
    
                    const puppeteerUrl = await this.openBrowserAndGetUrl(userId);
                    const browser = await puppeteer.connect({
                        browserWSEndpoint: puppeteerUrl,
                        defaultViewport: null
                    });
    
                    const initialResult = await this.verifyProfiles({ profileId: userId, url: puppeteerUrl }, userIds, socialMedia);
                    if (initialResult) {
                        notRunningProfiles.push(...initialResult.notRunningProfilesAfterVerification);
                        if (initialResult.notRunningProfilesAfterVerification.length === 0) {
                            runningProfiles.push({ profileId: userId, url: puppeteerUrl });
                            logWithColor(`Profile working: ${userId}`, 'green', true);
                        } else {
                            logWithColor(`Profile not running: ${userId}`, 'red', true);
                        }
                    } else {
                        console.warn(`No results returned for user ID ${userId}`);
                    }
    
                } catch (error: any) {
                    notRunningProfiles.push({ profileId: userId, url: '' });
                    console.error(`Error processing user ID ${userId}: ${error.message}`);
                    logger.error(`Error processing user ID ${userId}: ${error.stack}`);
                }
            }
    
            return notRunningProfiles;
        } catch (error: any) {
            console.error('Error in findAllProfiles:', error.message);
            logger.error('Error in findAllProfiles:', error.stack);
            return;
        }
    }
    
    
    private async openBrowserAndGetUrl(userId: string): Promise<string> {
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
    
    private async handleProfilePages(browser: Browser, socialMedia: string, userId: string, notRunningProfiles: NotRunningProfile[]) {
        const targetUrl = socialMedia === 'reddit' ? process.env.REDDIT_URL! : process.env.TWITTER_URL!;
        try {
            const pages = await browser.pages();
            for (let page of pages) {
                if (!page.url().startsWith(targetUrl)) {
                    await page.close();
                }
            }
            const pageURL = await browser.newPage();
            await pageURL.bringToFront();
            await pageURL.goto(targetUrl, { waitUntil: 'networkidle2' });
    
            let verifyCupidBot = new PageHandler(pageURL);
            const response = await verifyCupidBot.handlePage(targetUrl, userId);
    
            if (response !== 'running ok') {
                notRunningProfiles.push({ profileId: response, url: browser.wsEndpoint() });
            }
        } catch (error: any) {
            notRunningProfiles.push({ profileId: userId, url: browser.wsEndpoint() });
            console.error(`Error handling profile pages for user ${userId}: ${error.message}`);
            logger.error(`Error handling profile pages for user ${userId}: ${error.stack}`);
        }
    }
    

    async verifyProfiles(profileInfo: NotRunningProfile, ids: string[], socialMedia: string) {
        let notRunningProfilesAfterVerification: NotRunningProfile[] = [];
    
        try {
            const puppeteerUrl = await this.openBrowserAndGetUrl(profileInfo.profileId);
            const browser = await puppeteer.connect({
                browserWSEndpoint: puppeteerUrl,
                defaultViewport: ({height: 1200, width: 1920})
            });
    
            await this.handleProfilePages(browser, socialMedia, profileInfo.profileId, notRunningProfilesAfterVerification);
            return { message: 'Verificação de perfil concluída com sucesso', notRunningProfilesAfterVerification };
        } catch (error: any) {
            console.error(`Error verifying profiles for user ID ${profileInfo.profileId}: ${error.message}`);
            logger.error(`Error verifying profiles for user ID ${profileInfo.profileId}: ${error.stack}`);
            return { notRunningProfilesAfterVerification };
        }
    }
    
    
    private async saveToCsv(notRunningProfiles: NotRunningProfile[], filePath: string) {
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'profileId', title: 'Profile ID' }
            ],
            append: true
        });
    
        const currentDateTime = new Date().toISOString().replace('T', ' ').split('.')[0];
        fs.appendFileSync(filePath, `${currentDateTime}\n`);
    
        const records = notRunningProfiles.map(profile => ({
            profileId: profile.profileId
        }));
    
        await csvWriter.writeRecords(records);
        openCsvFile('not_running_profiles.csv');
    }
}     

//export async function callFindAllProfiles() {
  //  const getProfilesIdsByUser = new GetProfilesIdsByUser();
   // const userProfile = new ProfileController();

    //try {
     //   const userIds = await getProfilesIdsByUser.handle();
      //  await userProfile.findAllProfiles(userIds.userIds);
    //} catch (error: any) {
     //   console.error('Error calling findAllProfiles:', error.message);
      //  logger.error('Error calling findAllProfiles:', error.stack);
    //} finally {
     //   getProfilesIdsByUser.close();
   // }
//}

//callFindAllProfiles();