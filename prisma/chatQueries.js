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

exports.getUserChatMessages = async (chatId, userId, start, length) => {
  const chat = await prisma.chats.findUnique({
    where: {
      id: chatId,
      users: { some: { id: userId } },
    },
    include: {
      messages: {
        skip: start,
        take: length,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return chat.messages;
};

exports.getUserChatList = async (userId, start, length) => {
  const query = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    select: {
      chats: {
        include: {
          users: {
            select: {
              id: true,
              username: true,
              firstname: true,
              lastname: true,
              email: true,
            },
            where: {
              NOT: {
                id: userId,
              },
            },
          },
          messages: false,
        },
      },
    },
  });

  return [...query.chats];
};

exports.getOutsideChatUsers = async (userId, start, length) => {
  return await prisma.users.findMany({
    skip: start,
    take: length,
    include: {
      password: false,
    },
    where: {
      NOT: {
        id: userId,
      },
      chats: {
        none: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    },
  });
};
