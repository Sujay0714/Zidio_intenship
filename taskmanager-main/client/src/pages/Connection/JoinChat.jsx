import React, { useState, useEffect, useRef } from "react";
import { useRoomContext } from "../../context/RoomContext";
import { Send } from 'lucide-react';

const JoinChat = () => {
  const { userDetails, sendMessage, messages } = useRoomContext();
  const [messageText, setMessageText] = useState("");
  const bottomRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText);
      setMessageText("");
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!userDetails?.roomId || !userDetails?.name) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <p>Please join a room first.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-white/5 backdrop-blur">

  <div className="bg-gradient-to-r from-cyan-400 to-green-600 text-white p-4 text-center text-lg font-semibold shadow-md">
    Chat Room: <span className="text-sm font-medium">{userDetails.roomId}</span>
  </div>

  <div className="flex-1 overflow-y-auto bg-white/10 p-4 space-y-3 custom-scrollbar">
    {messages.map((msg, idx) => (
      <div
        key={idx}
        className={`p-3 rounded-lg max-w-[30%] break-words ${
          msg.sender === userDetails.name
            ? "bg-cyan-600 text-white ml-auto"
            : "bg-white text-gray-800 shadow"
        }`}
      >
        <div className="text-xs font-semibold mb-1">{msg.sender}</div>
        <div className="text-sm">{msg.text}</div>
        <div className="text-[10px] text-right text-gray-300 mt-1">{msg.time}</div>
      </div>
    ))}
    <div ref={bottomRef} />
  </div>

  <form
    onSubmit={handleSend}
    className="p-4 bg-white flex items-center gap-2 border-t border-gray-200"
  >
    <input
      type="text"
      value={messageText}
      onChange={(e) => setMessageText(e.target.value)}
      placeholder="Type a message..."
      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="submit"
      className="bg-gradient-to-br from-cyan-800 to-green-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      <Send strokeWidth={1} />
    </button>
  </form>
</div>

  );
};

export default JoinChat;
