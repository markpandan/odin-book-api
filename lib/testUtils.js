const request = require("supertest");

const getRequest = (app, route, done) => {
  return request(app)
    .get(route)
    .expect("Content-Type", /json/)
    .expect(200, done);
};

module.exports = { getRequest };
