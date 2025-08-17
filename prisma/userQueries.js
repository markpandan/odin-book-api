const prisma = require("./query");
const util = require("../lib/passwordUtils");

exports.createNewUser = async (usersFields) => {
  const { username, firstname, lastname, email, password } = usersFields;
  const hashedPassword = await util.encryptPassword(password);

  return await prisma.users.create({
    data: {
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
    },
  });
};

exports.getUserByUsername = async (username) => {
  const user = await prisma.users.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      email: true,
      firstname: true,
      lastname: true,
      profile_url: true,
      password: true,
    },
  });

  return user;
};

exports.getUserByEmail = async (email) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  return user;
};

exports.updateCurrentUser = async (usersFields) => {
  const { id, username, firstname, lastname, email, profile_url } = usersFields;

  return await prisma.users.update({
    where: {
      id,
    },
    data: {
      username,
      firstname,
      lastname,
      email,
      profile_url,
    },
    select: {
      id: true,
      username: true,
      email: true,
      firstname: true,
      lastname: true,
      profile_url: true,
    },
  });
};

exports.getUserPosts = async (username, start, length, currentUserId) => {
  let userPosts = await prisma.users.findUnique({
    where: {
      username,
    },
    include: {
      followers: {
        where: {
          followedById: currentUserId,
        },
      },
      _count: {
        select: { followers: true, following: true },
      },
      posts: {
        skip: start,
        take: length,
        include: {
          images: { select: { url: true } },
          likes: {
            where: { userId: currentUserId },
          },
          _count: {
            select: { comments: true, likes: true },
          },
        },
      },
      password: false,
      email: false,
      createdAt: false,
      updatedAt: false,
    },
  });

  userPosts["posts"] = userPosts["posts"].map((entry) => {
    const isLiked = entry["likes"].length != 0;
    delete entry["likes"];
    entry["liked"] = isLiked;

    return entry;
  });

  userPosts["followed"] = userPosts["followers"].length != 0;
  delete userPosts["followers"];

  return userPosts;
};

exports.createUserFollow = async (followedId, currentUserId) => {
  return await prisma.follows.create({
    data: {
      followingId: followedId,
      followedById: currentUserId,
    },
  });
};

exports.deleteUserFollow = async (followedId, currentUserId) => {
  return await prisma.follows.delete({
    where: {
      followingId_followedById: {
        followingId: followedId,
        followedById: currentUserId,
      },
    },
  });
};

exports.getTopUsers = async () => {
  return await prisma.users.findMany({
    take: 3,
    orderBy: {
      followers: {
        _count: "desc",
      },
    },
    include: {
      email: false,
      password: false,
      createdAt: false,
      updatedAt: false,
      _count: {
        select: { followers: true },
      },
    },
  });
};
