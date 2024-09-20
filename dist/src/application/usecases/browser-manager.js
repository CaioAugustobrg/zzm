"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserManager = void 0;
const puppeteer = require('puppeteer');
const path = require('path');
class BrowserManager {
    constructor(extensionPath) {
        this.extensionPath = extensionPath;
        this.browser = null;
        this.page = null;
    }
    async launchBrowser() {
        this.browser = await puppeteer.launch({
            headless: false,
            args: [
                `--disable-extensions-except=${this.extensionPath}`,
                `--load-extension=${this.extensionPath}`,
            ]
        });
        this.page = await this.browser.newPage();
    }
    async navigate(url) {
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
exports.BrowserManager = BrowserManager;
