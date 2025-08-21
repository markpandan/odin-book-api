const express = require("express");
const router = express.Router();
const { isAuth } = require("../lib/authUtils");

const controller = require("../controllers/ChatsController");

router.post("/add", isAuth, controller.postChatNew);

router.post("/:chatId", isAuth, controller.postChatMessage);

module.exports = router;
