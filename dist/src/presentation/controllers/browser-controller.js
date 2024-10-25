"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserController = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../../utils/logger"));
const api_error_1 = __importDefault(require("../../utils/api-error"));
class BrowserController {
    constructor(openBrowserUseCase, closeBrowserUseCase) {
        this.openBrowserUseCase = openBrowserUseCase;
        this.closeBrowserUseCase = closeBrowserUseCase;
    }
    async OpenBrowser(user_id) {
        try {
            const API_KEY = 'c2c3cc9a89c16e91c3126d27ed882b81';
            const result = await this.openBrowserUseCase.handle(user_id);
            if (typeof result === 'string') {
                const apiResponse = await axios_1.default.get(result, {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Accept': 'application/json'
                    }
                });
                return apiResponse.data;
            }
            else if (result instanceof api_error_1.default) {
                logger_1.default.error('Error in use case:', { error: result.message, code: result.code });
                throw new Error(result.message);
            }
            else {
                throw new Error('Unexpected result from use case');
            }
        }
        catch (error) {
            logger_1.default.error('Unexpected error:', { error: error.message });
            throw error;
        }
    }
    async CloseBrowser(user_id) {
        try {
            //            console.log('User close ID:', user_id);
            const API_KEY = 'c2c3cc9a89c16e91c3126d27ed882b81';
            const result = await this.closeBrowserUseCase.handle(user_id);
            if (typeof result === 'string') {
                const apiResponse = await axios_1.default.get(result, {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Accept': 'application/json'
                    }
                });
                logger_1.default.info('Received data:', { data: apiResponse.data });
            }
            else if (result instanceof api_error_1.default) {
                logger_1.default.error('Error in use case:', { error: result.message, code: result.code });
                throw new Error(result.message);
            }
            else {
                throw new Error('Unexpected result from use case');
            }
        }
        catch (error) {
            logger_1.default.error('Unexpected error:', { error: error.message });
            throw error;
        }
    }
}
exports.BrowserController = BrowserController;
