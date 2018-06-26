import RegisterPage from './RegisterPage';
import input from './helpers/input';
import button from './helpers/button';

const selectors = {
  buttons: {
    instagram: '[data-test-id="instagram-login-button"]',
    login: '[data-test-id="login-button"]',
    register: '[data-test-id="register-button"]',
  },
  inputs: {
    username: '[input[data-test-id="login-username"]',
    password: '[input[data-test-id="login-password"]',
  }
};

const urls = {
  login: host => `${host}/login`,
  loginInstagram: (host, accessToken) => `${host}/login/instagram#access_token=${accessToken}`,
};

export default class LoginPage {
  constructor(page, host) {
    this.page = page;
    this.host = host;

    this.buttons = {
      instagram: button(page, selectors.buttons.instagram),
      login: button(page, selectors.buttons.instagram),
      register: button(page, selectors.buttons.register),
    };

    this.inputs = {
      username: input(page, selectors.inputs.username),
      password: input(page, selectors.inputs.password),
    }
  }

  async go() {
    await this.page.goto(urls.login(this.host));
  }

  async loginInstagram(accessToken) {
    await this.buttons.instagram.click();
    await this.page.waitForNavigation();
    await this.page.goto(url.loginInstagram(this.host, accessToken));
  }

  async loginUsername(username, password) {
    await this.inputs.username.type(username);
    await this.inputs.password.type(password);

    await this.buttons.login.page.click();

    await this.page.waitForNavigation();
  }

  async navigateToRegister() {
    await this.buttons.register.click();
    await this.page.waitForNavigation();

    return new RegisterPage(this.page, this.host);
  }
}
