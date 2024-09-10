"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfiles = getProfiles;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const winston_1 = __importDefault(require("winston"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const API_KEY = process.env.API_KEY || "e30d320a165c400f1ef974619fe1ae26";
const API_PORT = process.env.API_PORT || 50555;
const apiUrl = 'http://local.adspower.net:50333/api/v1/user/list';
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'combined.log' })
    ]
});
app.get("/", (request, response) => {
    response.status(200).send("Hello World");
});
function getProfiles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Accept': 'application/json'
                }
            });
            logger.info('\n Recieved PROFILE data:', { data: response.data });
        }
        catch (error) {
            logger.error('GET requisition failed:', {
                message: error.message,
                stack: error.stack,
                response: error.response ? error.response.data : null
            });
        }
    });
}
