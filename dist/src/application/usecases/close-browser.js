"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseBrowserUseCase = void 0;
const browser_1 = require("../../domain/entities/browser");
class CloseBrowserUseCase {
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
        const url = browser.toUrl("http://local.adspower.net:50555/api/v1/browser/stop");
        console.log('Generated URL CLOSE BROWSER:', url);
        return url;
    }
}
exports.CloseBrowserUseCase = CloseBrowserUseCase;
