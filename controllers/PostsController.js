const db = require("../prisma/postQueries");

exports.postGet = async (req, res, next) => {
  const { start = 0, length = 5 } = req.query;
  try {
    const posts = await db.getSomePosts(start, length);

    res.json({ output: posts });
  } catch (error) {
    next(error);
  }
};

exports.postGetComments = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const comments = await db.getPostComments(postId);

    res.json({ output: comments });
  } catch (error) {
    next(error);
  }
};

exports.postCreate = async (req, res, next) => {
  const { id: userId } = req.user;
  const { description } = req.body;

  try {
    const post = await db.createPost(userId, description);

    res.json({ message: "Post Created", output: post });
  } catch (error) {
    next(error);
  }
};

exports.postComment = async (req, res, next) => {
  const { id: userId } = req.user;
  const { postId } = req.params;
  const { content } = req.body;

  try {
    const comment = await db.createPostComment(content, userId, postId);

    res.json({ message: `Comment Created on Post ${postId}`, output: comment });
  } catch (error) {
    next(error);
  }
};

exports.postLike = async (req, res, next) => {
  const { id: userId } = req.user;
  const { postId } = req.params;

  try {
    const like = await db.createPostLike(userId, postId);

    res.json({ message: `Like Created on Post ${postId}`, output: like });
  } catch (error) {
    next(error);
  }
};

exports.postDelete = async (req, res, next) => {
  const { id: userId } = req.user;
  const { postId } = req.params;

  try {
    const deletedPost = await db.deletePost(userId, postId);

    res.json({
      message: `Post ${postId} deleted successfully`,
      output: deletedPost,
    });
  } catch (error) {
    next(error);
  }
};
