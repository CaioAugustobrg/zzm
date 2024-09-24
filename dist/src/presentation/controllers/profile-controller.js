"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const csv_writer_1 = require("csv-writer");
const fs_1 = __importDefault(require("fs"));
const browser_controller_1 = require("./browser-controller");
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const verify_bot_status_1 = require("../../application/usecases/verify-bot-status");
const open_browser_1 = require("../../application/usecases/open-browser");
const promises_1 = require("node:timers/promises");
const close_browser_1 = require("../../application/usecases/close-browser");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
function ensureCsvFileExists(filePath) {
    if (!fs_1.default.existsSync(filePath)) {
        fs_1.default.writeFileSync(filePath, '', 'utf8');
        console.log(`Arquivo ${filePath} criado.`);
    }
}
function logWithColor(message, color, bold = false) {
    const colors = {
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        reset: '\x1b[0m'
    };
    const boldPrefix = bold ? '\x1b[1m' : '';
    console.log(`${boldPrefix}${colors[color]}${message}${colors.reset}`);
}
function clearCsvFile(filePath) {
    fs_1.default.writeFileSync(filePath, '', 'utf8');
    console.log(`Conteúdo do arquivo ${filePath} apagado.`);
}
function openCsvFile(filePath) {
    const absolutePath = path_1.default.resolve(filePath);
    (0, child_process_1.exec)(`start "" "${absolutePath}"`, (error) => {
        if (error) {
            console.error('Erro ao abrir o arquivo:', error);
        }
    });
}
class ProfileController {
    constructor() {
        this.browserController = new browser_controller_1.BrowserController(new open_browser_1.OpenBrowserUseCase(), new close_browser_1.CloseBrowserUseCase());
    }
    async findProfile(request, response) {
    }
    async findAllProfiles(userIds, socialMedia) {
        logWithColor('⚠️ **Make sure the Cupid Bot extension is running on ADS POWER.**\n' +
            'If it’s not, press CTRL + C to stop, enable the extension, then run `npm start` and press ENTER.', 'yellow');
        const targetPage = 'https://x.com/messages';
        const csvFilePath = 'not_running_profiles.csv';
        let notRunningProfiles = [];
        let runningProfiles = [];
        try {
            for (const userId of userIds) {
                try {
                    logWithColor(`Running: ${userId}`, 'blue');
                    const puppeteerUrl = await this.openBrowserAndGetUrl(userId);
                    const browser = await puppeteer_extra_1.default.connect({
                        browserWSEndpoint: puppeteerUrl,
                        defaultViewport: null
                    });
                    const initialResult = await this.verifyProfiles({ profileId: userId, url: puppeteerUrl }, userIds, socialMedia);
                    if (initialResult) {
                        notRunningProfiles.push(...initialResult.notRunningProfilesAfterVerification);
                        if (initialResult.notRunningProfilesAfterVerification.length === 0) {
                            runningProfiles.push({ profileId: userId, url: puppeteerUrl });
                            logWithColor(`Profile working: ${userId}`, 'green', true);
                        }
                        else {
                            logWithColor(`Profile not running: ${userId}`, 'red', true);
                        }
                    }
                    else {
                        console.warn(`No results returned for user ID ${userId}`);
                    }
                }
                catch (error) {
                    notRunningProfiles.push({ profileId: userId, url: '' });
                    console.error(`Error processing user ID ${userId}: ${error.message}`);
                    logger_1.default.error(`Error processing user ID ${userId}: ${error.stack}`);
                }
                await (0, promises_1.setTimeout)(3000);
            }
            return notRunningProfiles;
        }
        catch (error) {
            console.error('Error in findAllProfiles:', error.message);
            logger_1.default.error('Error in findAllProfiles:', error.stack);
            return;
        }
    }
    async openBrowserAndGetUrl(userId) {
        try {
            const data = await this.browserController.OpenBrowser(userId);
            //  console.log('OpenBrowser response data:', data);
            if (!data || !data.data || !data.data.ws || !data.data.ws.puppeteer) {
                throw new Error(`Invalid response structure for user ID ${userId}`);
            }
            return data.data.ws.puppeteer;
        }
        catch (error) {
            console.error(`Error opening browser for user ID ${userId}: ${error.message}`);
            logger_1.default.error(`Error opening browser for user ID ${userId}: ${error.stack}`);
            throw error;
        }
    }
    async handleProfilePages(browser, socialMedia, userId, notRunningProfiles) {
        const targetUrl = socialMedia === 'reddit' ? process.env.REDDIT_URL : process.env.TWITTER_URL;
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
            let verifyCupidBot = new verify_bot_status_1.PageHandler(pageURL);
            const response = await verifyCupidBot.handlePage(targetUrl, userId);
            if (response !== 'running ok') {
                notRunningProfiles.push({ profileId: response, url: browser.wsEndpoint() });
            }
        }
        catch (error) {
            notRunningProfiles.push({ profileId: userId, url: browser.wsEndpoint() });
            // if (error.name === )
            console.error(`Error handling profile pages for user ${userId}: ${error.message}`);
            logger_1.default.error(`Error handling profile pages for user ${userId}: ${error.stack}`);
        }
        await (0, promises_1.setTimeout)(3000);
    }
    async verifyProfiles(profileInfo, ids, socialMedia) {
        let notRunningProfilesAfterVerification = [];
        try {
            const puppeteerUrl = await this.openBrowserAndGetUrl(profileInfo.profileId);
            const browser = await puppeteer_extra_1.default.connect({
                browserWSEndpoint: puppeteerUrl,
                defaultViewport: ({ height: 1200, width: 1920 })
            });
            await this.handleProfilePages(browser, socialMedia, profileInfo.profileId, notRunningProfilesAfterVerification);
            return { message: 'Verificação de perfil concluída com sucesso', notRunningProfilesAfterVerification };
        }
        catch (error) {
            console.error(`Error verifying profiles for user ID ${profileInfo.profileId}: ${error.message}`);
            logger_1.default.error(`Error verifying profiles for user ID ${profileInfo.profileId}: ${error.stack}`);
            return { notRunningProfilesAfterVerification };
        }
    }
    async saveToCsv(notRunningProfiles, filePath) {
        const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: filePath,
            header: [
                { id: 'profileId', title: 'Profile ID' }
            ],
            append: true
        });
        const currentDateTime = new Date().toISOString().replace('T', ' ').split('.')[0];
        fs_1.default.appendFileSync(filePath, `${currentDateTime}\n`);
        const records = notRunningProfiles.map(profile => ({
            profileId: profile.profileId
        }));
        await csvWriter.writeRecords(records);
        openCsvFile('not_running_profiles.csv');
    }
}
exports.ProfileController = ProfileController;
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
