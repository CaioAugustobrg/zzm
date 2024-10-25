import axios from "axios";
import { Browser } from "../../domain/entities/browser";
import ApiError from "../../utils/api-error";

export class QueryProfilesUseCase {
    constructor() {}

    async handle(user_id: string): Promise<any> {
        let browser = new Browser(user_id);
        const API_KEY = 'c2c3cc9a89c16e91c3126d27ed882b81';

        // Monta a URL
        const url = browser.toUrl(`http://local.adspower.net:50555/api/v1/user/list?user_id=${user_id}`);
        console.log(url);
        
        try {
            // Faz a requisição GET
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
                }
            });

            // Retorna os dados da resposta
            return response.data;
        } catch (error: any) {
            // Se houver um erro na requisição, retorna um ApiError
            return new ApiError({
                code: error.response?.status || 500,
                message: error.message || "An unknown error occurred",
                log: true,
            });
        }
    }
}
