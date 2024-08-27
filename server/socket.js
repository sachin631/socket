const { Server } = require("socket.io");
const message_model = require("./models/user.messages.model");

const setup_socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  const userSocketMap = new Map();

  io.on('connection', (socket) => {
    const user_id = socket.handshake.query.user_id;
    if (user_id) {
      userSocketMap.set(user_id, socket.id);
      console.log(`User ${user_id} connected with socket ID ${socket.id}`);
    } else {
      console.log('User ID not provided during connection');
    }

    socket.on('send_message', async (message) => {
      try {
        console.log(`Message received from user ${message.sender_id}: ${message.message}`);
        const createdMessage = await message_model.create(message);

        // Populate sender and receiver details
        const messageData = await message_model.findById(createdMessage._id)
          .populate('sender_id')
          .populate('receiver_id');

        const receiverSocketId = userSocketMap.get(message.receiver_id);
        const senderSocketId = userSocketMap.get(message.sender_id);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', messageData);
        }
        if (senderSocketId) {
          io.to(senderSocketId).emit('receive_message', messageData);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      for (const [user_id, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(user_id);
          break;
        }
      }
    });
  });
};

module.exports = setup_socket;
