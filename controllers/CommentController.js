const db = require("../prisma/commentQueries");

exports.commentEdit = (req, res, next) => {
  const { id: userId } = req.user;
  const { commentId } = req.params;

  try {
  } catch (error) {
    next(error);
  }
};

exports.commentDelete = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
