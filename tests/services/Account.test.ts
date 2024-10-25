const assert = require('assert')
const http = require('http')
const { describe, it } = require('node:test')

describe('API - Registro de Usuário', function () {
  it('deve registrar um novo usuário e retornar status 201', function (done) {
    const data = JSON.stringify({
      name: 'UserTest',
      email: 'user@test.com',
      password: 'password123'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/users/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      assert.strictEqual(res.statusCode, 201);
      done();
    });

    req.on('error', (error) => {
      done(error);
    });

    req.write(data);
    req.end();
  });
});
