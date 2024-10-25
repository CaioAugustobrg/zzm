"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileFactory = void 0;
const profile_controller_1 = require("../../presentation/controllers/profile-controller");
const handle_profiles_1 = require("../../application/usecases/handle-profiles");
const browser_controller_1 = require("../../presentation/controllers/browser-controller");
const open_browser_1 = require("../../application/usecases/open-browser");
const close_browser_1 = require("../../application/usecases/close-browser");
const verify_profiles_1 = require("../../application/usecases/verify-profiles");
const open_browser_get_url_1 = require("../../application/usecases/open-browser-get-url");
class ProfileFactory {
    static createProfileController() {
        const profilePageHandler = new handle_profiles_1.ProfilePageHandler();
        const browserController = new browser_controller_1.BrowserController(new open_browser_1.OpenBrowserUseCase(), new close_browser_1.CloseBrowserUseCase());
        const verifyProfiles = new verify_profiles_1.VerifyProfiles(profilePageHandler, new open_browser_get_url_1.OpenBrowserAndGetUrl(browserController));
        return new profile_controller_1.ProfileController(verifyProfiles, profilePageHandler, new open_browser_get_url_1.OpenBrowserAndGetUrl(browserController));
    }
}
exports.ProfileFactory = ProfileFactory;
