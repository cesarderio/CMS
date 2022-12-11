'use strict';

const { server } = require('../src/server');
const { db } = require('../src/models');
const supertest = require('supertest');
const request = supertest(server);


beforeAll( async () => {
  await db.sync();
});

afterAll( async () => {
  await db.drop();
});

describe('Auth Tests', () => {
  it('allows user to signup with a POST to the /signup route', async () => {
    let response = await request.post('/signup').send(
      {
        username: 'testUser',
        password: 'pass',
        role: 'Instructor',
      });
    expect(response.status).toBe(201);
    expect(response.body.user.username).toEqual('testUser');
    expect(response.body.user.password).toBeTruthy();
    // expect(response.body.user.password).toEqual('pass123');
    expect(response.body.user.password).not.toEqual('pass');
  });

  it('allows user to signin with a POST to the /signin route', async () => {
    let response = await request.post('/signin').set('Authorization', 'Basic dGVzdGVyOnBhc3M=');
    expect(response.status).toBe(200);
    expect(response.body.user.username).toEqual('testUser');
    expect(response.body.user.password).toBeTruthy();
    expect(response.body.user.password).not.toEqual('pass');
  });

});
