// context/RoomContext.js
import { createContext, useState, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(() => {
    try {
      const stored = localStorage.getItem("user-details");
      return stored && stored !== "undefined"
        ? JSON.parse(stored)
        : { roomId: "", name: "", email: "" };
    } catch (e) {
      console.error("Failed to parse user-details:", e);
      return { roomId: "", name: "", email: "" };
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("chat-messages");
      return saved && saved !== "undefined" ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse chat-messages:", e);
      return [];
    }
  });

  const [socket, setSocket] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Persist userDetails
  useEffect(() => {
    localStorage.setItem("user-details", JSON.stringify(userDetails));
  }, [userDetails]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  // Connect socket
  useEffect(() => {
    const socketInstance = io("http://localhost:5000", {
      transports: ["websocket"],
    });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Initialize media stream
  useEffect(() => {
    const initStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setMicOn(true);
        setCameraOn(true);
      } catch (err) {
        console.error("Media error:", err);
      }
    };
    initStream();
  }, []);

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;
    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => socket.off("receive-message");
  }, [socket]);

  const joinRoom = () => {
    if (userDetails.roomId && userDetails.name && socket) {
      socket.emit("join-room", userDetails);
    }
  };

  const sendMessage = (text) => {
    const message = {
      sender: userDetails.name,
      roomId: userDetails.roomId,
      text,
      time: new Date().toLocaleTimeString(),
    };
    socket.emit("send-message", message);
    setMessages((prev) => [...prev, message]);
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  };

  const toggleScreenSharing = () => {
    setIsScreenSharing((prev) => !prev);
  };

  return (
    <RoomContext.Provider
      value={{
        userDetails,
        setUserDetails,
        joinRoom,
        socket,
        sendMessage,
        messages,
        micOn,
        cameraOn,
        toggleMic,
        toggleCamera,
        isScreenSharing,
        toggleScreenSharing,
        localStream,
        localVideoRef,
        remoteVideoRef,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => useContext(RoomContext);
