const issueToken = require("../lib/jwtUtils");
const db = require("../prisma/userQueries");
const { verifyLogin } = require("../lib/authUtils");
const {
  validateCredentials,
  validateUpdatedCredentials,
} = require("../validators/UserValidators");
const { validationResult } = require("express-validator");
const { singleFileUpload } = require("../config/mutler");
const path = require("node:path");
const { uploadToCloud, destroyFileInCloud } = require("../config/cloudinary");
const sharp = require("sharp");
const fs = require("node:fs");

exports.userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  const verify = await verifyLogin(username, password);

  try {
    if (verify.success) {
      const token = issueToken(verify.output);
      res.json({ output: { token } });
    } else {
      res.status(401).json({ message: verify.message });
    }
  } catch (error) {
    next(error);
  }
};

exports.userSignup = [
  validateCredentials,
  async (req, res, next) => {
    const errorResult = validationResult(req);
    if (!errorResult.isEmpty()) {
      return res.status(400).json({ message: errorResult.errors[0].msg });
    }

    const { username, password, firstname, lastname, email } = req.body;

    try {
      await db.createNewUser({
        username,
        password,
        firstname,
        lastname,
        email,
      });
      res.json({ message: "User account created" });
    } catch (error) {
      next(error);
    }
  },
];

exports.userUpdate = [
  validateUpdatedCredentials,
  singleFileUpload("profile"),
  async (req, res, next) => {
    const errorResult = validationResult(req);
    if (!errorResult.isEmpty()) {
      return res.status(400).json({ message: errorResult.errors[0].msg });
    }

    const { id: userId, profile_url: old_profile_url } = req.user;
    const { username, firstname, lastname, email } = req.body;
    const { profileWidthPx = 150, profileHeightPx = 150 } = req.query;

    try {
      let new_profile_url;
      if (req.file) {
        const { path: filePath, destination } = req.file;
        const resizedImage = await sharp(filePath)
          .resize(profileWidthPx, profileHeightPx, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .toBuffer();

        fs.writeFileSync(filePath, resizedImage);
        const uploadedFile = await uploadToCloud(filePath, destination);

        if (old_profile_url) {
          const public_id = path.parse(old_profile_url.split("/").pop()).name;
          destroyFileInCloud(public_id, "image");
        }

        new_profile_url = uploadedFile.url;
      }

      const updatedUser = await db.updateCurrentUser({
        id: userId,
        username,
        firstname,
        lastname,
        email,
        profile_url: new_profile_url,
      });
      const token = issueToken(updatedUser);
      res.json({ message: "User account updated", output: { token } });
    } catch (error) {
      next(error);
    }
  },
];

exports.userFollow = async (req, res, next) => {
  const { id: currentUserId } = req.user;
  const { userId: followedUserId } = req.params;

  try {
    const follow = await db.createUserFollow(followedUserId, currentUserId);

    res.json({ message: "User followed successfully", output: follow });
  } catch (error) {
    next(error);
  }
};

exports.userRemoveFollow = async (req, res, next) => {
  const { id: currentUserId } = req.user;
  const { userId: followedUserId } = req.params;

  try {
    const follow = await db.deleteUserFollow(followedUserId, currentUserId);

    res.json({ message: "User follow removed", output: follow });
  } catch (error) {
    next(error);
  }
};

exports.userGetPosts = async (req, res, next) => {
  const { start = 0, length = 5, relationTo = "" } = req.query;
  const { username } = req.params;

  try {
    const userPosts = await db.getUserPosts(
      username,
      start,
      length,
      relationTo
    );

    res.json({ output: userPosts });
  } catch (error) {
    next(error);
  }
};

exports.userLeaderboards = async (req, res, next) => {
  try {
    const leaderboards = await db.getTopUsers();

    res.json({ output: leaderboards });
  } catch (error) {
    next(error);
  }
};
