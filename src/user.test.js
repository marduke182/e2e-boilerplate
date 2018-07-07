import user from 'contracts/user';
import createRegisterPage from 'po/createRegisterPage';

// Initialize page object and go to expected url
let registerPage;
beforeEach(async () => {
  registerPage = createRegisterPage(global.page, global.host);
  await registerPage.go();
});

// Verify if the inputs in register page exist
test('should have username and password inputs', async () => {
  await expect(registerPage.inputs.email).toExist();
  await expect(registerPage.inputs.password).toExist();
});


test('should create an account', async () => {
  // Prepare server with a create contract
  global.server.with(
    user.post.createJohnDoe,
  );
  const username = 'john@doe.com';
  const password = '123456';

  // Try to create an account
  await registerPage.createAccount(username, password);

  // Expect server to receive a request with right data
  const request = { path: '/user', method: 'POST', body: { username, password }};
  expect(global.server).serverToBeCalledWith(request);
});
