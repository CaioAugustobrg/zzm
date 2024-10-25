import { ProfileController } from '../../presentation/controllers/profile-controller';
import { ProfilePageHandler } from '../../application/usecases/handle-profiles';
import { BrowserController } from '../../presentation/controllers/browser-controller';
import { OpenBrowserUseCase } from '../../application/usecases/open-browser';
import { CloseBrowserUseCase } from '../../application/usecases/close-browser';
import { VerifyProfiles } from '../../application/usecases/verify-profiles'; 
import { OpenBrowserAndGetUrl } from '../../application/usecases/open-browser-get-url'; 

export class ProfileFactory {
    static createProfileController(): ProfileController {
        const profilePageHandler = new ProfilePageHandler();
        const browserController = new BrowserController(
            new OpenBrowserUseCase(),
            new CloseBrowserUseCase()
        );
        const verifyProfiles = new VerifyProfiles(profilePageHandler, new OpenBrowserAndGetUrl(browserController));

        return new ProfileController(verifyProfiles, profilePageHandler, new OpenBrowserAndGetUrl(browserController));
    }
}
