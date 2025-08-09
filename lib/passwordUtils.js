const bcrypt = require("bcryptjs");

async function encryptPassword(rawPassword) {
  return await bcrypt.hash(rawPassword, 10);
}

async function isPasswordCorrect(rawPassword, hashedPassword) {
  return await bcrypt.compare(rawPassword, hashedPassword);
}

module.exports = {
  encryptPassword,
  isPasswordCorrect,
};
