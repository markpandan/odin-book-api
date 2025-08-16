const cloudinary = require("cloudinary").v2;
const path = require("node:path");
const { removeTmpInPath } = require("../lib/pathUtils");

exports.uploadToCloud = async (filePath, destination) => {
  destination = removeTmpInPath(destination);
  const filename = path.parse(filePath).name;

  const databaseFolder = process.env.CLOUDINARY_DATABASE_FOLDER;
  return await cloudinary.uploader.upload(filePath, {
    public_id: filename,
    asset_folder: databaseFolder + "/" + destination,
  });
};

exports.destroyFileInCloud = async (public_id, resource_type) => {
  return await cloudinary.uploader.destroy(public_id, {
    resource_type,
    invalidate: true,
  });
};
