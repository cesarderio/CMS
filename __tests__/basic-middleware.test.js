'use strict';

const basicAuth = require('../src/auth/middleware/basic');
const { db, users } = require('../src/models');


beforeAll(async () => {
  await db.sync();
  await users.create({
    username: 'testUser',
    password: 'pass',
  });
});

afterAll(async () => {
  await db.drop();
});

describe('Basic auth middleware', () => {
  it('fails on signin as expected', async () => {
    let req = {
      headers: {
        authorization: 'Basic Password',
      },
    };
    let res = {};
    let next = jest.fn();
    await basicAuth(req, res, next);
    expect(next).toHaveBeenCalledWith('Invalid Login');

  });
  it('passes appropriately', async () => {
    let req = {
      headers: {
        authorization: 'Basic dGVzdGVyOnBhc3M=',
      },
    };
    let res = {};
    let next = jest.fn();

    await basicAuth(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
});
