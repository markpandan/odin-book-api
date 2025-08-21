const { createAdapter } = require("@socket.io/cluster-adapter");
const { Server } = require("socket.io");

exports.io;

exports.socketServer = (server) => {
  io = new Server(server, {
    connectionStateRecovery: {},
    adapter: createAdapter(),
    cors: {
      origin: process.env.ALLOWED_URL,
    },
  });
};

exports.socketConnections = () =>
  io.on("connection", (socket) => {
    console.log("A User Connected");

    socket.on("join chat", async (chatId) => {
      await socket.join(chatId);
    });

    socket.on("leave chat", async (chatId) => {
      await socket.leave(chatId);
    });

    socket.on("disconnect", () => console.log("A User Disconnected"));
  });
