import React, { useEffect, useState } from "react";
import { useRoomContext } from "../../context/RoomContext";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { userDetails, setUserDetails, joinRoom } = useRoomContext();
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails.name && userDetails.roomId) {
      navigate(`/chat/${userDetails.roomId}`);
    }
  }, [userDetails, navigate]);

  const handleJoin = (e) => {
    e.preventDefault();
    setUserDetails((prev) => ({ ...prev, name, roomId }));
    joinRoom();

    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600">
      <form
        onSubmit={handleJoin}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        <h1 className="text-xl text-center text-blue-900 dark:text-blue-300">
          The Room Id is:{" "}
          <span className="underline font-semibold text-blue-700 dark:text-blue-400">
            KL300GH
          </span>
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-900 dark:text-blue-100">
          Join Chat Room
        </h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 rounded-lg hover:from-blue-700 hover:to-blue-500 transition duration-200 font-semibold"
        >
          Join
        </button>
      </form>
    </div>
  );
};

export default Chat;
