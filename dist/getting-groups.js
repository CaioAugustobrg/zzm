"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroups = getGroups;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const winston_1 = __importDefault(require("winston"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const API_KEY = process.env.API_KEY || "c2c3cc9a89c16e91c3126d27ed882b81";
const API_PORT = process.env.API_PORT || 50556;
const apiUrl = 'http://local.adspower.net:50333/api/v1/group/list';
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
async function getGroups() {
    try {
        const response = await axios_1.default.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });
        logger.info('Recieved GROUP data:', { data: response.data });
    }
    catch (error) {
        logger.error('GET requisition failed:', {
            message: error.message,
            stack: error.stack,
            response: error.response ? error.response.data : null
        });
    }
}
