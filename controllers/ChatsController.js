const db = require("../prisma/chatQueries");
const { io } = require("../config/socket");

exports.postChatNew = async (req, res) => {
  const { id: userId } = req.user;
  const { ids } = req.body;

  try {
    const newChat = await db.postNewChat([userId, ...ids]);
    res.json({ message: "Chat created", output: newChat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.postChatMessage = async (req, res) => {
  const { id: senderId } = req.user;
  const { chatId } = req.params;
  const { message } = req.body;

  try {
    const newMessage = await db.postNewMessage(chatId, senderId, message);
    io.to(newMessage.chatId).emit("chat message", newMessage.content);
    res.json({ message: "Message Submitted", output: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
