const puppeteer = require('puppeteer');
const path = require('path');

export class BrowserManager {
  [x: string]: any;
  constructor(extensionPath: any) {
    this.extensionPath = extensionPath;
    this.browser = null;
    this.page = null;
  }

  async launchBrowser() {
    this.browser = await puppeteer.launch({
      headless: false, 
      args: [
        `--disable-extensions-except=${this.extensionPath}`,
        `--load-extension=${this.extensionPath}`
      ]
    });
    this.page = await this.browser.newPage();
  }

  async navigate(url: any) {
    if (!this.page) {
      throw new Error('Browser not launched. Call launchBrowser() first.');
    }
    await this.page.goto(url);
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}








PORT=3000
ADS_POWER_KEY=e30d320a165c400f1ef974619fe1ae26
API_PORT=50325
PATH_TO_EXTENSION=C:\.ADSPOWER_GLOBAL\ext\1022642
CUPID_BOT_KEY=aa43656a2c237962353bbb0957cb8ce6

 & "C:\Program Files\AdsPower Global\AdsPower Global.exe" --headless=true --api-key=e30d320a165c400f1ef974619fe1ae26 --api-port=50555


  
  NEXT STEPS:
  IF THIS DOES NOT HAVE THE CUPID BOT KEY, PUT
  IF THE ACCOUNT IS NOT LOGGED IN, LOG IN
  SET A TIMER
  DECOUPLE MORE TO IMPROVE MAINTENANCE AND NEW FEATURES
  DOCKER TO RUN ON ALL SERVERS

DOC TO USERS:
VERIFY IF CUPID BOT IS RUNNING ON ADSPOWER


