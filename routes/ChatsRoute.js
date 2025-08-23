const express = require("express");
const router = express.Router();
const { isAuth } = require("../lib/authUtils");

const controller = require("../controllers/ChatsController");

router.get("/list", isAuth, controller.getChatList);

router.get("/outside", isAuth, controller.getChatOutside);

router.get("/:chatId", isAuth, controller.getChatMessages);

router.post("/add", isAuth, controller.postChatNew);

router.post("/:chatId", isAuth, controller.postChatMessage);

module.exports = router;
