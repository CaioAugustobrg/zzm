import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import winston from "winston";

// Configura variáveis de ambiente
dotenv.config();

const app = express();
const API_KEY = process.env.API_KEY || "e30d320a165c400f1ef974619fe1ae26";
const API_PORT = process.env.API_PORT || 50555; // Substitua se necessário
const apiUrl = 'http://local.adspower.net:50333/api/v1/user/list';
// const userId = 'kj4eo7w';

// Configura o logger
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

export async function getProfiles() {
  try {

    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });

    logger.info('Recieved data:', { data: response.data });
  } catch (error: any) {
    logger.error('GET requisition failed:', {
      message: error.message,
      stack: error.stack,
      response: error.response ? error.response.data : null
    });
  }
}