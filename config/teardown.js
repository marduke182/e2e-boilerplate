
const os = require('os');
const path = require('path');
const rimraf = require('rimraf');
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
  if (!process.env.DEBUG) {
    await global.__BROWSER__.close();
  }
  rimraf.sync(DIR);
};
