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
  const { id, username, firstname, lastname, email } = usersFields;

  return await prisma.users.update({
    where: {
      id,
    },
    data: {
      username,
      firstname,
      lastname,
      email,
    },
    select: {
      id: true,
      username: true,
      email: true,
      firstname: true,
      lastname: true,
    },
  });
};
