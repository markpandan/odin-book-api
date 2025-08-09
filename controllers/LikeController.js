const db = require("../prisma/likeQueries");

exports.likeRemove = async (req, res, next) => {
  const { id: userId } = req.user;
  const { likeId } = req.params;

  try {
    const deletedPost = await db.deleteLike(likeId, userId);

    res.json({ message: "Like Removed", output: deletedPost });
  } catch (error) {
    next(error);
  }
};
