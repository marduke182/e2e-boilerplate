const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
  // If is debug get up headed model
  const puppeteerConfig = {
    headless: true,
  };
  if (process.env.DEBUG) {
    puppeteerConfig.headless = false;
    puppeteerConfig.slowMo = 100;
  }

  const browser = await puppeteer.launch(puppeteerConfig);
  global.__BROWSER__ = browser;
  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
