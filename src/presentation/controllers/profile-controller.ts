import { GetProfilesIdsByUser } from "../../application/usecases/get-profile-ids-by-user";
import logger from "../../utils/logger";
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';

import ApiError from "../../utils/api-error";
import { NotRunningProfile } from "../../domain/types/profile";
import { Request, Response } from "express";
import { BrowserController } from "./browser-controller";
import puppeteer, { Browser } from 'puppeteer';
import { PageHandler } from "../../application/usecases/verify-bot-status";
import { OpenBrowserUseCase } from "../../application/usecases/open-browser";
import {setTimeout} from 'node:timers/promises'
import { CloseBrowserUseCase } from "../../application/usecases/close-browser";
import csvParser from "csv-parser";
import { exec } from "child_process";
import path from "path";
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
    // Ajuste o caminho do arquivo conforme necessário
    const absolutePath = path.resolve(filePath);
    
    // Comando para abrir o arquivo
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
        let runningProfiles: NotRunningProfile[] = []; // Array para perfis que funcionaram
    
        ensureCsvFileExists(csvFilePath);
        clearCsvFile(csvFilePath);
    
        while (true) {
            try {
                for (const userId of userIds) {
                    try {
                        logWithColor(`Running: ${userId}`, 'blue');
    
                        const puppeteerUrl = await this.openBrowserAndGetUrl(userId);
                        const browser = await puppeteer.connect({
                            browserWSEndpoint: puppeteerUrl,
                            defaultViewport: null
                        });
    
                        // Verificação de perfis
                        const initialResult = await this.verifyProfiles({ profileId: userId, url: puppeteerUrl }, userIds);
                        if (initialResult) {
                            notRunningProfiles.push(...initialResult.notRunningProfilesAfterVerification);
    
                            // Se não tiver perfis não rodando, adiciona ao array de perfis que funcionaram
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
                    }
                }
    
                // Salva todos os perfis não rodando no CSV
                await this.saveToCsv(notRunningProfiles, csvFilePath);
                logWithColor(`Those who don't have the Cupid Bot on have been added to: ${csvFilePath}`, 'yellow');
                logWithColor(`last: ${notRunningProfiles.length} browsers are not working`, 'red', true);
                // Abrindo perfis que funcionaram
                for (const profile of runningProfiles) {
                    logWithColor(`Opening working profile: ${profile.profileId}`, 'green');
                    await this.verifyProfiles(profile, userIds); // Reutiliza verifyProfiles
                }
    
                // Abrindo perfis que não funcionaram
                for (const profile of notRunningProfiles) {
                    logWithColor(`Opening not running profile: ${profile.profileId}`, 'red');
                    await this.verifyProfiles(profile, userIds); // Reutiliza verifyProfiles
                }
    
                notRunningProfiles = []; 
                runningProfiles = []; // Reseta o array de perfis que funcionaram
    
                console.log('Waiting 1 minute before the next profile check...');
                await setTimeout(60000); 
    
            } catch (error: any) {
                return;
            }
        }
    }
    
    



    private async openBrowserAndGetUrl(userId: string): Promise<string> {
        const data = await this.browserController.OpenBrowser(userId);
  //      console.log('OpenBrowser response data:', data.data.ws.puppeteer);
        return data.data.ws.puppeteer;
    }

    private async handleProfilePages(browser: Browser, targetPage: string, userId: string, notRunningProfiles: NotRunningProfile[]) {
        try {
            const pages = await browser.pages();
            const pageURL = await browser.newPage();
            await pageURL.bringToFront();
            await pageURL.goto(targetPage, { waitUntil: 'networkidle2' });
            
            let verifyCupidBot = new PageHandler(pageURL);
            const response = await verifyCupidBot.handlePage(targetPage, userId);
    
      //      console.log('Verification response:', response);
            if (response !== 'running ok') {
                notRunningProfiles.push({ profileId: response, url: browser.wsEndpoint() });
            }
    
         //   console.log('Page URL, we are home', pageURL.url());
            // await pageURL.close();
        } catch (error) {
            // Adiciona o perfil ao array mesmo em caso de erro
            notRunningProfiles.push({ profileId: userId, url: browser.wsEndpoint() }); 
         //   console.error(`Error handling profile pages for user ${userId}:`, error);
        }
    }
    async verifyProfiles(profileInfo: NotRunningProfile, ids: string[]) {
      //  logWithColor(`User ID: ${ids}`, 'blue');
        let notRunningProfilesAfterVerification: NotRunningProfile[] = [];
    
        // Verifica apenas o perfil informado em profileInfo
        const puppeteerUrl = await this.openBrowserAndGetUrl(profileInfo.profileId);
        const browser = await puppeteer.connect({
            browserWSEndpoint: puppeteerUrl,
            defaultViewport: null
        });
        
        await this.handleProfilePages(browser, 'https://x.com/messages', profileInfo.profileId, notRunningProfilesAfterVerification);
    
        return { message: 'Verificação de perfil concluída com sucesso', notRunningProfilesAfterVerification };
    }
    
    private async saveToCsv(notRunningProfiles: NotRunningProfile[], filePath: string) {
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'profileId', title: 'Profile ID' }
            ],
            append: true // Adiciona os dados ao arquivo existente
        });
    
        // Formata a data e a hora atual
        const currentDateTime = new Date().toISOString().replace('T', ' ').split('.')[0]; // Formato YYYY-MM-DD HH:MM:SS
    
        // Grava a data e a hora como uma linha separada
        fs.appendFileSync(filePath, `${currentDateTime}\n`);
    
        // Prepara os registros para incluir apenas o profileId
        const records = notRunningProfiles.map(profile => ({
            profileId: profile.profileId
        }));
    
        await csvWriter.writeRecords(records);
        openCsvFile('not_running_profiles.csv');
        
      //  console.log('Data saved to CSV file:', filePath);
      
    }
    
}     

async function callFindAllProfiles() {
    const getProfilesIdsByUser = new GetProfilesIdsByUser();
    const userProfile = new ProfileController();

    try {
        const userIds = await getProfilesIdsByUser.handle();
        await userProfile.findAllProfiles(userIds.userIds);
      
    } catch (error) {
       // console.error('Error calling findAllProfiles:', error);
    } finally {
        getProfilesIdsByUser.close();
    }
}

callFindAllProfiles();
