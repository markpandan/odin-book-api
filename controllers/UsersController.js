const issueToken = require("../lib/jwtUtils");
const db = require("../prisma/userQueries");
const { verifyLogin } = require("../lib/authUtils");
const { validateCredentials } = require("../validators/UserValidators");
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
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

exports.userGetPosts = async (req, res, next) => {
  const { id: userId } = req.user;

  try {
    const userPosts = await db.userGetPosts(userId);

    res.json({ output: userPosts });
  } catch (error) {
    next(error);
  }
};
