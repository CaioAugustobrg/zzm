"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const winston_1 = __importDefault(require("winston"));
const routes_1 = __importDefault(require("../routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const profile_controller_1 = require("../../presentation/controllers/profile-controller");
dotenv_1.default.config();
const app = (0, express_1.default)();
const API_KEY = process.env.API_KEY || "e30d320a165c400f1ef974619fe1ae26";
const API_PORT = process.env.API_PORT || 50555;
const apiUrl = 'http://local.adspower.net:50325/api/v1/browser/start';
const userId = 'kkh2f1e';
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'combined.log' })
    ]
});
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
}));
app.get("/", (request, response) => {
    response.status(200).send("Hello World");
});
app.use(routes_1.default);
async function getData() {
    try {
        const url = `${apiUrl}?user_id=${userId}`;
        const response = await axios_1.default.get(url, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });
        logger.info('recieved data:', { data: response.data });
    }
    catch (error) {
        logger.error('GET requisition failed:', {
            message: error.message,
            stack: error.stack,
            response: error.response ? error.response.data : null
        });
    }
}
app.listen(3000, async () => {
    console.log(`Server running at PORT: ${3000}`);
    // Or import puppeteer from 'puppeteer-core';
    // Launch the browser and open a new blank page
    await (0, profile_controller_1.callFindAllProfiles)();
    //  getData(); 
    //  getProfiles()
}).on("error", (error) => {
    console.error('Server startup error:', error.message);
});
