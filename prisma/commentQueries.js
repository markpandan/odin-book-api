const prisma = require("./query");

exports.editComment = async (commentId, userId, content) => {
  return await prisma.comments.update({
    where: {
      id: commentId,
      userId,
    },
    data: {
      content,
    },
  });
};

exports.deleteComment = async (commentId, userId) => {
  return await prisma.comments.delete({
    where: {
      id: commentId,
      userId,
    },
  });
};
