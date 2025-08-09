const { PrismaClient } = require("@prisma/client");
const util = require("../lib/passwordUtils");

const prisma = new PrismaClient();

module.exports = prisma;
