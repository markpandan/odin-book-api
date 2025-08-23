const { createAdapter } = require("@socket.io/cluster-adapter");
const { Server } = require("socket.io");

let io;

exports.socketServer = (server) => {
  io = new Server(server, {
    connectionStateRecovery: {},
    adapter: createAdapter(),
    cors: {
      origin: process.env.ALLOWED_URL,
    },
  });

  return io;
};

exports.socketConnections = () =>
  io.on("connection", (socket) => {
    console.log("A User Connected: ", String(new Date(Date.now())));

    socket.on("switch room", async (fromChatId, toChatId, callback) => {
      if (fromChatId) await socket.leave(fromChatId);
      await socket.join(toChatId);
      callback();
    });

    socket.on("disconnect", () => {
      console.log("A User Disconnected: ", String(new Date(Date.now())));
    });
  });
