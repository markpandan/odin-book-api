const express = require("express");
const router = express.Router();
const { isAuth } = require("../lib/authUtils");

const controller = require("../controllers/LikeController");

router.delete("/:likeId/remove", isAuth, controller.likeRemove);

module.exports = router;
