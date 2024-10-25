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
import { ProfilePageHandler } from "../../application/usecases/handle-profiles";
import { VerifyProfiles } from "../../application/usecases/verify-profiles";
import { OpenBrowserAndGetUrl } from "../../application/usecases/open-browser-get-url";


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


    constructor(
        private readonly verifyProfiles:  VerifyProfiles,
        private readonly profilePageHandler:  ProfilePageHandler,
        private readonly openBrowserAndGetUrl:  OpenBrowserAndGetUrl,
    ) {
        
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
    
                    const puppeteerUrl = await this.openBrowserAndGetUrl.handle(userId);
                    const browser = await puppeteer.connect({
                        browserWSEndpoint: puppeteerUrl,
                        defaultViewport: null
                    });
    
                    const initialResult = await this.verifyProfiles.handle({ profileId: userId, url: puppeteerUrl }, userIds, socialMedia);
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
                await setTimeout(3000)
            }
    
            return notRunningProfiles;
        } catch (error: any) {
            console.error('Error in findAllProfiles:', error.message);
            logger.error('Error in findAllProfiles:', error.stack);
            return;
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