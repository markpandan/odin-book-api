const prisma = require("./query");

exports.deleteLike = async (likeId, userId) => {
  return await prisma.likes.delete({
    where: {
      id: likeId,
      userId,
    },
  });
};
