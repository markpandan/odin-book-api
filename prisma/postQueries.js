const prisma = require("./query");

exports.getSomePosts = async (start, length, userId) => {
  const posts = await prisma.posts.findMany({
    skip: start,
    take: length,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      userId: false,
      user: {
        include: {
          password: false,
          email: false,
          createdAt: false,
          updatedAt: false,
        },
      },
      likes: {
        where: { userId },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });

  return posts.map((entry) => {
    const isLiked = entry["likes"].length != 0;
    delete entry["likes"];
    entry["liked"] = isLiked;

    return entry;
  });
};

exports.getPostComments = async (postId) => {
  const query = await prisma.posts.findMany({
    where: {
      id: postId,
    },
    select: {
      comments: {
        include: {
          user: {
            include: {
              password: false,
              email: false,
              createdAt: false,
              updatedAt: false,
            },
          },
        },
      },
    },
  });

  return query[0].comments;
};

exports.createPost = async (userId, content) => {
  return prisma.posts.create({
    data: { content, userId },
  });
};

exports.createPostComment = async (content, userId, postId) => {
  return await prisma.comments.create({
    data: {
      content,
      userId,
      postId,
    },
  });
};

exports.createPostLike = async (userId, postId) => {
  return await prisma.likes.create({
    data: {
      userId,
      postId,
    },
  });
};

exports.deletePostLike = async (userId, postId) => {
  return await prisma.likes.deleteMany({
    where: {
      userId,
      postId,
    },
  });
};

exports.deletePost = async (userId, postId) => {
  return await prisma.posts.delete({
    where: {
      id: postId,
      userId,
    },
  });
};
