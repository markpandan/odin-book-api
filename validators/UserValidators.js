const { body } = require("express-validator");
const db = require("../prisma/userQueries");

exports.validateCredentials = [
  body("username")
    .trim()
    .custom(async (value) => {
      const existingUser = await db.getUserByUsername(value);
      if (existingUser) {
        throw new Error("Username already exists");
      }
    }),
  body("email")
    .trim()
    .custom(async (value) => {
      const existingEmail = await db.getUserByEmail(value);
      if (existingEmail) {
        throw new Error("Email already exists");
      }
    }),
];

exports.validateUpdatedCredentials = [
  body("username")
    .trim()
    .custom(async (value, { req }) => {
      if (value == req.user.username) return;

      const existingUser = await db.getUserByUsername(value);
      if (existingUser) {
        throw new Error("Username already exists");
      }
    }),
  body("email")
    .trim()
    .custom(async (value, { req }) => {
      if (value == req.user.email) return;

      const existingEmail = await db.getUserByEmail(value);
      if (existingEmail) {
        throw new Error("Email already exists");
      }
    }),
];
