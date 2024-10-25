import puppeteer from "puppeteer";
import { NotRunningProfile } from "../../domain/types/profile";
import { ProfilePageHandler } from "./handle-profiles";
import logger from "../../utils/logger";
import { OpenBrowserAndGetUrl } from "./open-browser-get-url";

export class VerifyProfiles {
constructor(
    private readonly profilePageHandler:  ProfilePageHandler,
    private readonly openBrowserAndGetUrl:  OpenBrowserAndGetUrl
) {}
    async handle(profileInfo: NotRunningProfile, ids: string[], socialMedia: string) {
        let notRunningProfilesAfterVerification: NotRunningProfile[] = [];
        
        try {
            const puppeteerUrl = await this.openBrowserAndGetUrl.handle(profileInfo.profileId);
            const browser = await puppeteer.connect({
                browserWSEndpoint: puppeteerUrl,
                defaultViewport: ({height: 1200, width: 1920})
            });
            
            await this.profilePageHandler.handle(browser, socialMedia, profileInfo.profileId, notRunningProfilesAfterVerification);
            return { message: 'Verificação de perfil concluída com sucesso', notRunningProfilesAfterVerification };
        } catch (error: any) {
            console.error(`Error verifying profiles for user ID ${profileInfo.profileId}: ${error.message}`);
            logger.error(`Error verifying profiles for user ID ${profileInfo.profileId}: ${error.stack}`);
            return { notRunningProfilesAfterVerification };
        }
    }
}