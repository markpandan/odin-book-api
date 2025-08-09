const express = require("express");
const router = express.Router();
const { isAuth } = require("../lib/authUtils");

const controller = require("../controllers/PostsController");

router.get("/", controller.postGet);

router.get("/:postId/comments", controller.postGetComments);

router.post("/create", isAuth, controller.postCreate);

router.post("/:postId/comment", isAuth, controller.postComment);

router.post("/:postId/like", isAuth, controller.postLike);

router.delete("/:postId/delete", isAuth, controller.postDelete);

module.exports = router;
