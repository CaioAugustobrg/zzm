"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenBrowserUseCase = void 0;
const browser_1 = require("../../domain/entities/browser");
class OpenBrowserUseCase {
    constructor() { }
    async handle(user_id) {
        let browser = new browser_1.Browser(user_id);
        //if (!profile) {
        //   return new ApiError({
        //      code: 404,
        //     message: "Profile not found",
        //    log: true,
        //});
        // }
        const url = browser.toUrl("http://local.adspower.net:50555/api/v1/browser/start");
        console.log('Generated URL OPEN BROWSER:', url);
        return url;
    }
}
exports.OpenBrowserUseCase = OpenBrowserUseCase;
