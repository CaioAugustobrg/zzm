import puppeteer from 'puppeteer';
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import winston from "winston";
import router from "../routes";
import bodyParser from 'body-parser'
import cors  from 'cors'
import { GetProfilesIdsByUser } from '../../application/usecases/get-profile-ids-by-user';
//import { callFindAllProfiles } from '../../presentation/controllers/profile-controller';
dotenv.config();

const app = express();
const API_KEY = process.env.API_KEY || "c2c3cc9a89c16e91c3126d27ed882b81";
const API_PORT = process.env.API_PORT || 50555;
const apiUrl = 'http://local.adspower.net:50325/api/v1/browser/start';
const userId = 'kkh2f1e';
app.use(bodyParser.json())
app.use(express.json())
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], 
  credentials: true, 
}));
app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello World");
});
app.use(router)
async function getData() {
  try {
    const url = `${apiUrl}?user_id=${userId}`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });

    logger.info('recieved data:', { data: response.data });
  } catch (error: any) {
    logger.error('GET requisition failed:', {
      message: error.message,
      stack: error.stack,
      response: error.response ? error.response.data : null
    });
  }
}

app.listen(3030, async () => {
 console.log(`Server running at PORT: ${3030}`);

  // Or import puppeteer from 'puppeteer-core';
  
  // Launch the browser and open a new blank page
  //await callFindAllProfiles()
//  getData(); 
//  getProfiles()
}).on("error", (error) => {
  console.error('Server startup error:', error.message);
});
