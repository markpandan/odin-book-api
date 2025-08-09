const issueToken = require("../lib/jwtUtils");
const db = require("../prisma/userQueries");
const verifyLogin = require("../lib/verifyLogin");
const { validateCredentials } = require("../validators/UserValidators");
const { validationResult } = require("express-validator");

exports.userLogin = async (req, res) => {
  const { username, password } = req.body;
  const verify = await verifyLogin(username, password);

  if (verify.success) {
    const token = issueToken(verify.output);
    res.json({ output: { token } });
  } else {
    res.status(401).json({ message: verify.message });
  }
};

exports.userSignup = [
  validateCredentials,
  async (req, res) => {
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
