const path = require("node:path");

// Example: /tmp/Destination/Folder/ -> Destination/Folder/
function removeTmpInPath(filePath) {
  return filePath.split(path.sep).slice(2).join(path.sep);
}

module.exports = { removeTmpInPath };
