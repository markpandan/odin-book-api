const prisma = require("./query");

exports.getSomePosts = async (start, length) => {
  return await prisma.posts.findMany({
    skip: start,
    take: length,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        include: {
          password: false,
          email: false,
          createdAt: false,
          updatedAt: false,
        },
      },
      _count: {
        select: { Comments: true, Likes: true },
      },
    },
  });
};

exports.getPostComments = async (postId) => {
  const query = await prisma.posts.findMany({
    where: {
      id: postId,
    },
    select: {
      Comments: {
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

  return query[0].Comments;
};

exports.createPost = async (userId, description) => {
  return prisma.posts.create({
    data: { description, userId },
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

exports.deletePost = async (userId, postId) => {
  return await prisma.posts.delete({
    where: {
      id: postId,
      userId,
    },
  });
};
