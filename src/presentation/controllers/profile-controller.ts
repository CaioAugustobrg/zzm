import axios from "axios";
import { FindProfileUseCase } from "../../application/usecases/findProfile";
import logger from "../../utils/logger";
import ApiError from "../../utils/api-error";
import { ProfileParameters } from "../../domain/types/profile";
import { Request } from "express";

export class ProfileController {
    constructor (
        private readonly findProfileUseCase: FindProfileUseCase
    ) {}

    async findProfile(request: Request, response: Response) {
        try {
            const apiUrl = 'https://api.example.com/profiles'; 
            const API_KEY = 'YOUR_API_KEY'; 

            // Fazer a requisição com Axios
            const response = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Accept': 'application/json'
                }
            });

            // Log da resposta recebida
            logger.info('Received data:', { data: response.data });

            // Passar dados para o caso de uso
            const profileParameters: ProfileParameters = response.data.data;
            const result = await this.findProfileUseCase.handle(profileParameters);

            if (result instanceof ApiError) {
                // Log e retorno de erros
                logger.error('Error in use case:', { error: result.message, code: result.code });
                return {
                    statusCode: result.code,
                    body: {
                        message: result.message
                    }
                };
            }

            // Sucesso, retornar dados no formato esperado
            return {
                statusCode: 200,
                body: result
            };
        } catch (error: any) {
            // Log e retorno de erros inesperados
            logger.error('Unexpected error:', { error: error.message });
            return {
                statusCode: 500,
                body: {
                    message: 'Internal server error'
                }
            };
        }
    }
}
