const express = require("express");
const router = express.Router();
const { isAuth } = require("../lib/authUtils");

const controller = require("../controllers/UsersController");

router.get("/leaderboards", controller.userLeaderboards);

router.post("/login", controller.userLogin);

router.post("/signup", controller.userSignup);

router.put("/update", isAuth, controller.userUpdate);

router.post("/:userId/follow", isAuth, controller.userFollow);

router.delete("/:userId/follow/remove", isAuth, controller.userRemoveFollow);

router.get("/:username/posts", controller.userGetPosts);

module.exports = router;
