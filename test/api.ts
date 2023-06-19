import request from 'supertest';

import app from '../src/app';

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get("/api/v1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        {
          message: "Welcome To Complex Blog",
        },
        done
      );
  });
});

describe('GET /api/v1/invalid-route', () => {
  it('responds with 404 ', (done) => {
    request(app)
      .get('/api/v1/invalid-route')
    .expect(404, done)
  })
})