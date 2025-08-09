const express = require("express");
const router = express.Router();

const controller = require("../controllers/UsersController");

router.post("/login", controller.userLogin);

router.post("/signup", controller.userSignup);

module.exports = router;
