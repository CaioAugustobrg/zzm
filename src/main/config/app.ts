import puppeteer from 'puppeteer';
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import winston from "winston";
import router from "../routes";
import bodyParser from 'body-parser'
import { GetProfilesIdsByUser } from '../../application/usecases/get-profile-ids-by-user';
dotenv.config();

const app = express();
const API_KEY = process.env.API_KEY || "e30d320a165c400f1ef974619fe1ae26";
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

app.listen(3000, async () => {
 // console.log(`Server running at PORT: ${3000}`);

  // Or import puppeteer from 'puppeteer-core';
  
  // Launch the browser and open a new blank page
 
//  getData(); 
//  getProfiles()
}).on("error", (error) => {
  console.error('Server startup error:', error.message);
});
