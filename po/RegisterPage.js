import input from './helpers/input';
import button from './helpers/button';

const urls = {
  register: host => `${host}/register`,
};

const selectors = {
  buttons: {
    createAccount: '[data-test-id="register-button"]',
  },
  inputs: {
    email: 'input[data-test-id="register-email"]',
    password: 'input[data-test-id="register-password"]',
  }
};

export default class RegisterPage {
  constructor(page, host) {
    this.page = page;
    this.host = host;

    // Inputs
    this.inputs = {
      email: input(page, selectors.inputs.email),
      password: input(page, selectors.inputs.password),
    };

    // Buttons
    this.buttons = {
      createAccount: button(page, selectors.buttons.createAccount)
    };
  }

  async go() {
    await this.page.goto(urls.register(this.host));
  }

  async isRegisterPage() {
    const url = page.url();
    return url === `${this.host}/register`;
  }

  async createAccount(email, password) {
    await this.inputs.email.type(email);
    await this.inputs.password.type(password);

    await this.buttons.createAccount.click();

    await this.page.waitForNavigation();
  }
}
