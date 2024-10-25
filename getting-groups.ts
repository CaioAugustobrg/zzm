import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import winston from "winston";

dotenv.config();

const app = express();
const API_KEY = process.env.API_KEY || "c2c3cc9a89c16e91c3126d27ed882b81";
const API_PORT = process.env.API_PORT || 50556;
const apiUrl = 'http://local.adspower.net:50333/api/v1/group/list';


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

export async function getGroups() {
  try {

    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });

    logger.info('Recieved GROUP data:', { data: response.data });
  } catch (error: any) {
    logger.error('GET requisition failed:', {
      message: error.message,
      stack: error.stack,
      response: error.response ? error.response.data : null
    });
  }
}