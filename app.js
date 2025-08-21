const express = require("express");
const { createServer } = require("node:http");
const cors = require("cors");
const { availableParallelism } = require("node:os");
const cluster = require("node:cluster");
const { setupPrimary } = require("@socket.io/cluster-adapter");
const { socketServer, socketConnections } = require("./config/socket");

require("dotenv").config();

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 5000 + i,
    });
  }

  return setupPrimary();
}

const app = express();
const server = createServer(app);
socketServer(server);

app.use(cors());

require("./config/passport");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const usersRoute = require("./routes/UsersRoute");
app.use("/users", usersRoute);

const postsRoute = require("./routes/PostsRoute");
app.use("/posts", postsRoute);

const commentsRoute = require("./routes/CommentsRoute");
app.use("/comments", commentsRoute);

const likesRoute = require("./routes/LikesRoute");
app.use("/likes", likesRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message });
});

socketConnections();

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
