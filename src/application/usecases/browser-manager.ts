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
