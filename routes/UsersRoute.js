const express = require("express");
const router = express.Router();
const { isAuth } = require("../lib/authUtils");

const controller = require("../controllers/UsersController");

router.post("/login", controller.userLogin);

router.post("/signup", controller.userSignup);

router.put("/update", isAuth, controller.userUpdate);

router.get("/:username/posts", controller.userGetPosts);

// router.get("/posts", isAuth, controller.userGetPosts);

module.exports = router;
