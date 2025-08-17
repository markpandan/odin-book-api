const db = require("../prisma/postQueries");
const { singleFileUpload } = require("../config/mutler");
const sharp = require("sharp");
const fs = require("node:fs");
const { uploadToCloud } = require("../config/cloudinary");

exports.postGet = async (req, res, next) => {
  const { start = 0, length = 5, userId, relationTo } = req.query;

  try {
    const posts = await db.getSomePosts(
      userId,
      Number(start),
      Number(length),
      relationTo
    );

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

exports.postCreate = [
  singleFileUpload("image"),
  async (req, res, next) => {
    const { id: userId } = req.user;
    const { content } = req.body;

    try {
      let post;
      if (!req.file) {
        post = await db.createPost(userId, content);
      } else {
        const { path, destination, filename, size } = req.file;
        const { imageWidthPx = 800, imageHeightPx = 400 } = req.query;

        const resizedImage = await sharp(path)
          .resize(imageWidthPx, imageHeightPx, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .toBuffer();

        fs.writeFileSync(path, resizedImage);
        const uploadedFile = await uploadToCloud(path, destination);

        post = await db.createPost(userId, content, {
          imageName: filename,
          size,
          resource_type: uploadedFile.resource_type,
          format: uploadedFile.format,
          public_id: uploadedFile.public_id,
          url: uploadedFile.url,
        });
      }

      res.json({ message: "Post Created", output: post });
    } catch (error) {
      next(error);
    }
  },
];

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

exports.postRemoveLike = async (req, res, next) => {
  const { id: userId } = req.user;
  const { postId } = req.params;

  try {
    const removedLike = await db.deletePostLike(userId, postId);

    res.json({
      message: `Like Deleted on Post ${postId} from ${userId}`,
      output: removedLike,
    });
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
