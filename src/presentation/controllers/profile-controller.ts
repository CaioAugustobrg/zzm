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
        // Your findProfile logic
    }
    
    async findAllProfiles(userIds: string[]) {
        
        logWithColor(
            '⚠️ **Make sure the Cupid Bot extension is running on ADS POWER.**\n' +
            'If it’s not, press CTRL + C to stop, enable the extension, then run `npm start` and press ENTER.',
            'yellow'
        );
    
        const targetPage = 'https://x.com/messages';
        const csvFilePath = 'not_running_profiles.csv';
    
        let notRunningProfiles: NotRunningProfile[] = [];
        let runningProfiles: NotRunningProfile[] = [];
    
        ensureCsvFileExists(csvFilePath);
        clearCsvFile(csvFilePath);
    
        while (true) {
              logWithColor(
            '⚠️ **Make sure the Cupid Bot extension is running on ADS POWER.**\n' +
            'If it’s not, press CTRL + C to stop, enable the extension, then run `npm start` and press ENTER.',
            'yellow'
        );
            try {
                for (const userId of userIds) {
                    try {
                        logWithColor(`Running: ${userId}`, 'blue');
    
                        const puppeteerUrl = await this.openBrowserAndGetUrl(userId);
                        const browser = await puppeteer.connect({
                            browserWSEndpoint: puppeteerUrl,
                            defaultViewport: null                        });
    
                        const initialResult = await this.verifyProfiles({ profileId: userId, url: puppeteerUrl }, userIds);
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
                        console.error(`Error processing user ID ${userId}: ${error.message}`);
                        logger.error(`Error processing user ID ${userId}: ${error.stack}`);
                    }
                }
    
                await this.saveToCsv(notRunningProfiles, csvFilePath);
                for (const profile of runningProfiles) {
                    logWithColor(`Opening working profile: ${profile.profileId}`, 'green');
                    await this.verifyProfiles(profile, userIds);
                }
                
                for (const profile of notRunningProfiles) {
                    logWithColor(`Opening not running profile: ${profile.profileId}`, 'red');
                    await this.verifyProfiles(profile, userIds);
                }
                logWithColor(`Those who don't have the Cupid Bot on have been added to: ${csvFilePath}`, 'yellow');
                logWithColor(`last: ${notRunningProfiles.length} browsers are not working`, 'red', true);
    
                notRunningProfiles = []; 
                runningProfiles = []; 
    
                console.log('Waiting 1 minute before the next profile check...');
                await setTimeout(60000); 
    
            } catch (error: any) {
                console.error('Error in findAllProfiles:', error.message);
                logger.error('Error in findAllProfiles:', error.stack);
                return; // Exit loop on error
            }
        }
    }
    private async openBrowserAndGetUrl(userId: string): Promise<string> {
        try {
            const data = await this.browserController.OpenBrowser(userId);
            console.log('OpenBrowser response data:', data); // Log the entire response
            if (!data || !data.data || !data.data.ws || !data.data.ws.puppeteer) {
                throw new Error(`Invalid response structure for user ID ${userId}`);
            }
            return data.data.ws.puppeteer;
        } catch (error: any) {
            console.error(`Error opening browser for user ID ${userId}: ${error.message}`);
            logger.error(`Error opening browser for user ID ${userId}: ${error.stack}`);
            throw error; // Re-throw the error for handling
        }
    }
    
    private async handleProfilePages(browser: Browser, targetPage: string, userId: string, notRunningProfiles: NotRunningProfile[]) {
        const twitterUrl = "https://x"
        const adsPowerUrl = "https://start"
        try {
            const pages = await browser.pages();
            for (let page of pages) {
                if (!page.url().startsWith(twitterUrl) || !page.url().startsWith(adsPowerUrl)) {
                    page.close()
                }
            }
            const pageURL = await browser.newPage();
            await pageURL.bringToFront();
            await pageURL.goto(targetPage, { waitUntil: 'networkidle2' });

            await pageURL.setRequestInterception(true);

            pageURL.on('request', request => {
                const url = request.url();
            
                // Aqui você pode filtrar as requisições do Cupidbot
                if (url.includes('cupidbot')) {
                    console.log(`Requisição do Cupidbot detectada: ${url}, ${userId}`);
                }
            
                // Continuar com a requisição normalmente
                request.continue();
            });
            
            // Monitorar respostas
            pageURL.on('response', async response => {
                const url = response.url();
                if (url.includes('cupidbot')) {
                    const status = response.status();
            
                    try {
                        // Tente obter a resposta como JSON
                        const data = await response.json(); // Se não for JSON, pode usar response.text()
                        console.log('Status Code:', status, userId);
                        console.log('Response:', data);
                    } catch (error: any) {
                        console.error(`Erro ao processar resposta para ${url}: ${error.message}`);
                    }
                }
            });
            let verifyCupidBot = new PageHandler(pageURL);
            const response = await verifyCupidBot.handlePage(targetPage, userId);
    
            if (response !== 'running ok') {
                notRunningProfiles.push({ profileId: response, url: browser.wsEndpoint() });
            }
        } catch (error: any) {
            notRunningProfiles.push({ profileId: userId, url: browser.wsEndpoint() });
            console.error(`Error handling profile pages for user ${userId}: ${error.message}`);
            logger.error(`Error handling profile pages for user ${userId}: ${error.stack}`);
        }
    }

    async verifyProfiles(profileInfo: NotRunningProfile, ids: string[]) {
        let notRunningProfilesAfterVerification: NotRunningProfile[] = [];

        try {
            const puppeteerUrl = await this.openBrowserAndGetUrl(profileInfo.profileId);
            const browser = await puppeteer.connect({
                browserWSEndpoint: puppeteerUrl,
                defaultViewport: null
            });
            
            await this.handleProfilePages(browser, 'https://x.com/messages', profileInfo.profileId, notRunningProfilesAfterVerification);
    
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

export async function callFindAllProfiles() {
    const getProfilesIdsByUser = new GetProfilesIdsByUser();
    const userProfile = new ProfileController();

    try {
        const userIds = await getProfilesIdsByUser.handle();
        await userProfile.findAllProfiles(userIds.userIds);
    } catch (error: any) {
        console.error('Error calling findAllProfiles:', error.message);
        logger.error('Error calling findAllProfiles:', error.stack);
    } finally {
        getProfilesIdsByUser.close();
    }
}

callFindAllProfiles();