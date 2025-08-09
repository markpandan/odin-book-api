const express = require("express");
const cors = require("cors");
// require("dotenv").config();

const app = express();

app.use(cors());

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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
  console.log(`Link is http://localhost:${PORT}/`);
});
