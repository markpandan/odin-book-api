const request = require("supertest");
const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: false }));

const userRoute = require("../routes/UsersRoute");
app.use("/users", userRoute);

describe("Users Route", () => {
  test("Signup should check if username or email already exists", (done) => {
    request(app)
      .post("/users/signup")
      .type("form")
      .expect("Content-Type", /json/)
      .send({ username: "mark", email: "mark@email.com", password: "123456" })
      .expect(400, { message: "Username or email already exists" }, done);
  });

  test("Login should check if username does not exist", (done) => {
    request(app)
      .post("/users/login")
      .type("form")
      .expect("Content-Type", /json/)
      .send({ username: "mark1", password: "123456" })
      .expect(401, { message: "Invalid User" }, done);
  });

  test("Login should check if password is not correct", (done) => {
    request(app)
      .post("/users/login")
      .type("form")
      .expect("Content-Type", /json/)
      .send({ username: "mark", password: "1234567" })
      .expect(401, { message: "Incorrect Password" }, done);
  });
});
