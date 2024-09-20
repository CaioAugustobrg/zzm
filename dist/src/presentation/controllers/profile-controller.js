"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
exports.callFindAllProfiles = callFindAllProfiles;
const get_profile_ids_by_user_1 = require("../../application/usecases/get-profile-ids-by-user");
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
        // Your findProfile logic
    }
    async findAllProfiles(userIds) {
        logWithColor('⚠️ **Make sure the Cupid Bot extension is running on ADS POWER.**\n' +
            'If it’s not, press CTRL + C to stop, enable the extension, then run `npm start` and press ENTER.', 'yellow');
        const targetPage = 'https://x.com/messages';
        const csvFilePath = 'not_running_profiles.csv';
        let notRunningProfiles = [];
        let runningProfiles = [];
        ensureCsvFileExists(csvFilePath);
        clearCsvFile(csvFilePath);
        while (true) {
            logWithColor('⚠️ **Make sure the Cupid Bot extension is running on ADS POWER.**\n' +
                'If it’s not, press CTRL + C to stop, enable the extension, then run `npm start` and press ENTER.', 'yellow');
            try {
                for (const userId of userIds) {
                    try {
                        logWithColor(`Running: ${userId}`, 'blue');
                        const puppeteerUrl = await this.openBrowserAndGetUrl(userId);
                        const browser = await puppeteer_extra_1.default.connect({
                            browserWSEndpoint: puppeteerUrl,
                            defaultViewport: null
                        });
                        const initialResult = await this.verifyProfiles({ profileId: userId, url: puppeteerUrl }, userIds);
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
                        console.error(`Error processing user ID ${userId}: ${error.message}`);
                        logger_1.default.error(`Error processing user ID ${userId}: ${error.stack}`);
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
                await (0, promises_1.setTimeout)(60000);
            }
            catch (error) {
                console.error('Error in findAllProfiles:', error.message);
                logger_1.default.error('Error in findAllProfiles:', error.stack);
                return; // Exit loop on error
            }
        }
    }
    async openBrowserAndGetUrl(userId) {
        try {
            const data = await this.browserController.OpenBrowser(userId);
            console.log('OpenBrowser response data:', data); // Log the entire response
            if (!data || !data.data || !data.data.ws || !data.data.ws.puppeteer) {
                throw new Error(`Invalid response structure for user ID ${userId}`);
            }
            return data.data.ws.puppeteer;
        }
        catch (error) {
            console.error(`Error opening browser for user ID ${userId}: ${error.message}`);
            logger_1.default.error(`Error opening browser for user ID ${userId}: ${error.stack}`);
            throw error; // Re-throw the error for handling
        }
    }
    async handleProfilePages(browser, targetPage, userId, notRunningProfiles) {
        const twitterUrl = "https://x";
        const adsPowerUrl = "https://start";
        try {
            const pages = await browser.pages();
            for (let page of pages) {
                if (!page.url().startsWith(twitterUrl) || !page.url().startsWith(adsPowerUrl)) {
                    page.close();
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
            pageURL.on('response', async (response) => {
                const url = response.url();
                if (url.includes('cupidbot')) {
                    const status = response.status();
                    try {
                        // Tente obter a resposta como JSON
                        const data = await response.json(); // Se não for JSON, pode usar response.text()
                        console.log('Status Code:', status, userId);
                        console.log('Response:', data);
                    }
                    catch (error) {
                        console.error(`Erro ao processar resposta para ${url}: ${error.message}`);
                    }
                }
            });
            let verifyCupidBot = new verify_bot_status_1.PageHandler(pageURL);
            const response = await verifyCupidBot.handlePage(targetPage, userId);
            if (response !== 'running ok') {
                notRunningProfiles.push({ profileId: response, url: browser.wsEndpoint() });
            }
        }
        catch (error) {
            notRunningProfiles.push({ profileId: userId, url: browser.wsEndpoint() });
            console.error(`Error handling profile pages for user ${userId}: ${error.message}`);
            logger_1.default.error(`Error handling profile pages for user ${userId}: ${error.stack}`);
        }
    }
    async verifyProfiles(profileInfo, ids) {
        let notRunningProfilesAfterVerification = [];
        try {
            const puppeteerUrl = await this.openBrowserAndGetUrl(profileInfo.profileId);
            const browser = await puppeteer_extra_1.default.connect({
                browserWSEndpoint: puppeteerUrl,
                defaultViewport: null
            });
            await this.handleProfilePages(browser, 'https://x.com/messages', profileInfo.profileId, notRunningProfilesAfterVerification);
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
async function callFindAllProfiles() {
    const getProfilesIdsByUser = new get_profile_ids_by_user_1.GetProfilesIdsByUser();
    const userProfile = new ProfileController();
    try {
        const userIds = await getProfilesIdsByUser.handle();
        await userProfile.findAllProfiles(userIds.userIds);
    }
    catch (error) {
        console.error('Error calling findAllProfiles:', error.message);
        logger_1.default.error('Error calling findAllProfiles:', error.stack);
    }
    finally {
        getProfilesIdsByUser.close();
    }
}
callFindAllProfiles();
