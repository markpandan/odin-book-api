const request = require("supertest");
const express = require("express");
const { getRequest } = require("../lib/testUtils");

const app = express();

app.use(express.urlencoded({ extended: false }));

const postRoute = require("../routes/PostsRoute");
app.use("/posts", postRoute);

describe("Posts Route", () => {
  test("Get Posts Works", (done) => {
    getRequest(app, "/posts/", done);
  });

  //   test("Get Comments on Posts Works", (done) => {
  //     getRequest(app, `/posts/${testPostId}/comments`, done);
  //   });
});
