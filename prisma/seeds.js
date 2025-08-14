const prisma = require("./query");
const { faker } = require("@faker-js/faker");
const util = require("../lib/passwordUtils");

faker.seed(123);

const randomize = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const createNewUsers = async () => {
  const n = 10;

  const randomFirstName = faker.helpers.uniqueArray(faker.person.firstName, n);
  const randomLastName = faker.helpers.uniqueArray(faker.person.firstName, n);
  const randomPassword = await Promise.all(
    faker.helpers
      .uniqueArray(faker.internet.password, n)
      .map(async (password) => await util.encryptPassword(password))
  );

  let userEntries = new Array(n).fill().map((_, index) => ({
    username: faker.internet.username({
      firstName: randomFirstName[index],
      lastName: randomLastName[index],
    }),
    firstname: randomFirstName[index],
    lastname: randomLastName[index],
    email: faker.internet.email({
      firstName: randomFirstName[index],
      lastName: randomLastName[index],
    }),
    password: randomPassword[index],
  }));

  return await prisma.users.createMany({ data: userEntries });
};

const createNewPosts = async () => {
  const n = 5;

  const userIds = (await prisma.users.findMany({ select: { id: true } })).map(
    (value) => value.id
  );

  const postEntries = new Array(n).fill().map(() => ({
    description: faker.lorem.paragraphs({ min: 1, max: 2 }),
    userId: randomize(userIds),
  }));

  return await prisma.posts.createMany({ data: postEntries });
};

const createNewComments = async () => {
  const n = 20;
  const userIds = (await prisma.users.findMany({ select: { id: true } })).map(
    (value) => value.id
  );
  const postIds = (await prisma.posts.findMany({ select: { id: true } })).map(
    (value) => value.id
  );

  const commentEntries = new Array(n).fill().map(() => ({
    content: faker.lorem.sentence({ min: 1, max: 5 }),
    userId: randomize(userIds),
    postId: randomize(postIds),
  }));

  return await prisma.comments.createMany({ data: commentEntries });
};

const createNewLikes = async () => {
  const n = 40;

  const userIds = (await prisma.users.findMany({ select: { id: true } })).map(
    (value) => value.id
  );
  const postIds = (await prisma.posts.findMany({ select: { id: true } })).map(
    (value) => value.id
  );

  const likeEntries = new Array(n).fill().map(() => ({
    userId: randomize(userIds),
    postId: randomize(postIds),
  }));

  return await prisma.likes.createMany({ data: likeEntries });
};

const populateDb = async () => {
  try {
    await createNewUsers();
    await createNewPosts();
    await createNewComments();
    await createNewLikes();
  } catch (error) {
    if (
      error.name == "PrismaClientKnownRequestError" &&
      error.code == "P2002"
    ) {
      console.log("Database has already been populated");
    } else {
      console.error(error);
    }
  }
};

populateDb();
