const Server = require('../server/Server').default;
const Url = require('url');
const querystring = require('querystring');
const serverToBeCalledWith = require('../server/matchers/serverToBeCalledWith');
const toExist = require('../po/matchers/toExist');
const toHaveAttr = require('../po/matchers/toHaveAttr');

jest.setTimeout(10000); // 10 second

// setting host
global.host = process.env.HOST || 'http://localhost:3030';


// Server
beforeAll(async () => {
  global.server = new Server({baseUrl: global.host });
});

expect.extend({
  serverToBeCalledWith,
});

// Puppeteer
beforeAll(async () => {
  global.page = await browser.newPage();
  await global.page.setRequestInterception(true);
  global.page.on('request', function (request) {
    const url = new Url.URL(request.url());
    const method = request.method();
    const body = request.postData();


    const response = global.server.handle({
      host: url.origin,
      path: url.pathname,
      query: querystring.parse(url.query),
      method,
      body,
    });

    if (response === global.server.continue) {
      return request.continue();
    }

    if (response === global.server.abort) {
      return request.abort()
    }
    if (typeof response.body === 'object') {
      response.body = JSON.stringify(body);
    }
    return request.respond(response);
  });
});

afterAll(async () => {
  if (!process.env.DEBUG) {
    await global.page.close();
  }
});


expect.extend({
  toExist,
  toHaveAttr,
});
