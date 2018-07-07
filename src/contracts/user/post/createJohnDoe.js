export default {
  request: {
    path: '/user',
    method: 'POST',
  },
  response: {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      id: '1',
      username: 'john@doe.com'
    }
  }
}