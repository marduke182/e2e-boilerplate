const BairdServer = require('baird-server');
require('baird-server/matchers');
require('baird-page-objects/matchers');


jest.setTimeout(10000); // 10 second

beforeAll(async () => {
  global.page = await global.browser.newPage();
  global.server = new BairdServer({ baseUrl: global.host });

  await BairdServer.intercept(global.page, global.server);
});

afterAll(async () => {
  if (!global.debug) {
    await page.close();
  }
});
