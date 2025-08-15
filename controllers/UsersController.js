const issueToken = require("../lib/jwtUtils");
const db = require("../prisma/userQueries");
const { verifyLogin } = require("../lib/authUtils");
const {
  validateCredentials,
  validateUpdatedCredentials,
} = require("../validators/UserValidators");
const { validationResult } = require("express-validator");

exports.userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  const verify = await verifyLogin(username, password);

  try {
    if (verify.success) {
      const token = issueToken(verify.output);
      res.json({ output: { token } });
    } else {
      res.status(401).json({ message: verify.message });
    }
  } catch (error) {
    next(error);
  }
};

exports.userSignup = [
  validateCredentials,
  async (req, res, next) => {
    const errorResult = validationResult(req);
    if (!errorResult.isEmpty()) {
      return res.status(400).json({ message: errorResult.errors[0].msg });
    }

    const { username, password, firstname, lastname, email } = req.body;

    try {
      await db.createNewUser({
        username,
        password,
        firstname,
        lastname,
        email,
      });
      res.json({ message: "User account created" });
    } catch (error) {
      next(error);
    }
  },
];

exports.userUpdate = [
  validateUpdatedCredentials,
  async (req, res) => {
    const errorResult = validationResult(req);
    if (!errorResult.isEmpty()) {
      return res.status(400).json({ message: errorResult.errors[0].msg });
    }

    const { id: userId } = req.user;
    const { username, firstname, lastname, email } = req.body;

    try {
      const updatedUser = await db.updateCurrentUser({
        id: userId,
        username,
        firstname,
        lastname,
        email,
      });
      const token = issueToken(updatedUser);
      res.json({ message: "User account updated", output: { token } });
    } catch (error) {
      next(error);
    }
  },
];

exports.userGetPosts = async (req, res, next) => {
  const { id: userId } = req.user;

  try {
    const userPosts = await db.userGetPosts(userId);

    res.json({ output: userPosts });
  } catch (error) {
    next(error);
  }
};
