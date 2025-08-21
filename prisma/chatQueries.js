const prisma = require("./query");

exports.postNewChat = async (userIds) => {
  userIds = userIds.map((id) => ({ id }));

  return await prisma.chats.create({
    data: {
      users: { connect: userIds },
    },
  });
};

exports.postNewMessage = async (chatId, senderId, message) => {
  return await prisma.messages.create({
    data: {
      content: message,
      chatId,
      senderId,
    },
  });
};
