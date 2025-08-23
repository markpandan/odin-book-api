const db = require("../prisma/chatQueries");
const { io } = require("../config/socket");

exports.postChatNew = async (req, res, next) => {
  const { id: userId } = req.user;
  const { ids } = req.body;

  try {
    const newChat = await db.postNewChat([userId, ...ids]);
    res.json({ message: "Chat created", output: newChat });
  } catch (error) {
    next(error);
  }
};

exports.getChatList = async (req, res, next) => {
  const { start = 0, length = 5 } = req.query;
  const { id: userId } = req.user;

  try {
    const chats = await db.getUserChatList(
      userId,
      Number(start),
      Number(length)
    );
    res.json({ output: chats });
  } catch (error) {
    next(error);
  }
};

exports.getChatOutside = async (req, res, next) => {
  const { start = 0, length = 5 } = req.query;
  const { id: userId } = req.user;

  try {
    const users = await db.getOutsideChatUsers(
      userId,
      Number(start),
      Number(length)
    );
    res.json({ output: users });
  } catch (error) {
    next(error);
  }
};

exports.getChatMessages = async (req, res, next) => {
  const { start = 0, length = 5 } = req.query;
  const { id: userId } = req.user;
  const { chatId } = req.params;

  try {
    const messages = await db.getUserChatMessages(
      chatId,
      userId,
      Number(start),
      Number(length)
    );
    res.json({ output: messages });
  } catch (error) {
    next(error);
  }
};

exports.postChatMessage = async (req, res, next) => {
  const { id: senderId } = req.user;
  const { chatId } = req.params;
  const { message } = req.body;
  const { io } = req;

  try {
    const newMessage = await db.postNewMessage(chatId, senderId, message);

    io.timeout(5000)
      .to(newMessage.chatId)
      .emit("chat message", newMessage.content, senderId, (err) => {
        if (err) console.error(`Client on chat ID ${chatId} is unresponsive`);
      });
    res.json({ message: "Message Submitted", output: newMessage });
  } catch (error) {
    next(error);
  }
};
