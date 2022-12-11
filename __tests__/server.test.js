'use strict';

const { db, users } = require('../src/models');
const supertest = require('supertest');
const { server } = require('../src/server');
const request = supertest(server);

let testUser;
let studentUser;

beforeAll( async () => {
  await db.sync();
  testUser = await users.create({
    username: 'testUser',
    password: 'pass',
    role: 'Instructor',
  });
  studentUser = await users.create({
    username: 'student',
    password: 'pass',
    role: 'Student',
  });

});

afterAll( async () => {
  await db.drop();
});

describe('API / Auth Server Integration', () => {

  it('handles invalid request', async () => {
    const response = await request.get('/sale');
    expect(response.status).toEqual(404);
  });

  it('allows assignments to be created', async () => {
    let response = await request.post('/api/assignments').set('Authorization', `Bearer ${testUser.token}`).send({
      name: 'lab 01',
      due_date: 'tomorrow',
      scope: 'lab',
    });
    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('lab 01');
  });

  it('allows read access', async () => {
    let response = await request.get('/api/assignments').set('Authorization', `Bearer ${testUser.token}`);
    expect(response.status).toBe(200);
    expect(response.body[0].name).toEqual('lab 01');
  });

  it('allows read one access', async () => {
    let response = await request.get('/api/assignments/1').set('Authorization', `Bearer ${testUser.token}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('lab 01');
  });

  it('restricts assignments update by Student', async () => {
    let response = await request.put('/api/assignments/1').send({
      name: 'Reading 15',
      due_date: 'tomorrow',
      scope: 'Class Reading',
    }).set('Authorization', `Bearer ${studentUser.token}`);

    let errorObj = JSON.parse(response.text);
    expect(response.status).toBe(500);
    expect(errorObj.message).toEqual('Access Denied');
  });

  it('allows assignments update by Instructor', async () => {
    let response = await request.put('/api/assignments/1').send({
      name: 'Reading 15',
      due_date: 'tomorrow',
      scope: 'Class Reading',
    }).set('Authorization', `Bearer ${testUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('Reading 15');
  });

  it('restricts assignment delete by Student', async () => {
    let response = await request.delete('/api/assignments/1').set('Authorization', `Bearer ${studentUser.token}`);
    let errorObject = JSON.parse(response.text);

    expect(response.status).toBe(500);
    expect(errorObject.message).toEqual('Access Denied');
  });

  it('allows assignments delete by Instructor', async () => {
    let response = await request.delete('/api/assignments/1').set('Authorization', `Bearer ${testUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(1);
  });


});
