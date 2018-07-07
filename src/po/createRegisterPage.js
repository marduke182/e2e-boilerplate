import { page as createPage } from 'baird-page-objects';

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
  },
};

export default (page, host) => {
  const { inputs, buttons } = createPage(page, { selectors });
  return {
    inputs,
    buttons,
    async go() {
      await page.goto(urls.register(host));
    },
    async isRegisterPage() {
      const url = page.url();
      return url === `${this.host}/register`;
    },
    async createAccount(email, password) {
      await inputs.email.type(email);
      await inputs.password.type(password);

      await buttons.createAccount.click();

      await page.waitForNavigation();
    },
  };
};
