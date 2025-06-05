import {Server} from 'socket.io';

export function setupSocket(server){
  const io = new Server(server, {
    cors:{
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    // For Joining a meeting Room

    socket.on("join-room", ({roomId, name, email}) => {
      socket.join(roomId)
      socket.to(roomId).emit("user-joined", {id: socket.id, name, email})
      console.log(`User joined, ${roomId}, ${email}, ${name}, ${socket.id}`);
    })

    socket.on("sending-signal", ({userToSignal, signal, callerId}) => {
      io.to(userToSignal).emit("user-joined-back", {signal, callerId})
    })

    socket.on("returning-signal", ({signal, to}) => {
      io.to(to).emit("receiving-returned-signal", {signal, id: socket.id})
    })

    // Screen Sharing Toggle
    socket.on("toggle-screen-share", ({ roomId, isSharing }) => {
      socket.to(roomId).emit("screen-share-toggled", { id: socket.id, isSharing });
    });

    // Mic Toggle
    socket.on("toggle-mic", ({ roomId, isMicOn }) => {
      socket.to(roomId).emit("mic-toggled", { id: socket.id, isMicOn });
    });

    // Camera Toggle
    socket.on("toggle-camera", ({ roomId, isCameraOn }) => {
      socket.to(roomId).emit("camera-toggled", { id: socket.id, isCameraOn });
      console.log(`User ${socket.id} toggled camera: ${isCameraOn}`);
      
    });

    // Send MEssage
    socket.on('send-message', (data) => {
      console.log('📨 New chat message:', data);
      socket.to(data.roomId).emit("receive_message", data);
        // Broadcast to everyone in room
    });

    // Leave Meeting
    socket.on("leave-room", ({ roomId }) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user-left", { id: socket.id });
      console.log(`🚪 User ${socket.id} left room ${roomId}`);
    });

    // Disconnect

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      socket.rooms.forEach((roomId) => {
        socket.to(roomId).emit("user-disconnected", { id: socket.id });
      })
    })

  })
  
}