const express = require("express");
const router = express.Router();
const { isAuth } = require("../lib/authUtils");

const controller = require("../controllers/CommentController");

router.put("/:commentId/edit", isAuth, controller.commentEdit);

router.delete("/:commentId/delete", isAuth, controller.commentDelete);

module.exports = router;
