import axios from "axios";
import { OpenBrowserUseCase } from "../../application/usecases/open-browser";
import { CloseBrowserUseCase } from "../../application/usecases/close-browser";
import logger from "../../utils/logger";
import ApiError from "../../utils/api-error";

export class BrowserController {
    constructor(
        private readonly openBrowserUseCase: OpenBrowserUseCase,
        private readonly closeBrowserUseCase: CloseBrowserUseCase
    ) {}

    async OpenBrowser(user_id: string): Promise<any> {
        try {
            console.log('User ID:', user_id);

            const API_KEY = 'e30d320a165c400f1ef974619fe1ae26';
            const result = await this.openBrowserUseCase.handle(user_id);

            if (typeof result === 'string') {
                const apiResponse = await axios.get(result, {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Accept': 'application/json'
                    }
                });

                return apiResponse.data;
            } else if (result instanceof ApiError) {
                logger.error('Error in use case:', { error: result.message, code: result.code });
                throw new Error(result.message);
            } else {
                throw new Error('Unexpected result from use case');
            }
        } catch (error: any) {
            logger.error('Unexpected error:', { error: error.message });
            throw error;
        }
    }

    async CloseBrowser(user_id: string): Promise<void> {
        try {
            console.log('User close ID:', user_id);

            const API_KEY = 'e30d320a165c400f1ef974619fe1ae26';
            const result = await this.closeBrowserUseCase.handle(user_id);

            if (typeof result === 'string') {
                const apiResponse = await axios.get(result, {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Accept': 'application/json'
                    }
                });

                logger.info('Received data:', { data: apiResponse.data });
            } else if (result instanceof ApiError) {
                logger.error('Error in use case:', { error: result.message, code: result.code });
                throw new Error(result.message);
            } else {
                throw new Error('Unexpected result from use case');
            }
        } catch (error: any) {
            logger.error('Unexpected error:', { error: error.message });
            throw error;
        }
    }
}
