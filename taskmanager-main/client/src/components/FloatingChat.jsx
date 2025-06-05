import { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MessageCircle, X } from "lucide-react";
import { sendMessageToGemini } from "../utils/gemini";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessageToGemini(input);
      const botMessage = { sender: "bot", text: reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      </div>

      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-80 h-full bg-white shadow-2xl rounded-l-2xl flex flex-col overflow-hidden">
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
                  <h2 className="text-lg font-semibold">Chat Support</h2>
                  <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-2">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg max-w-[80%] ${
                        msg.sender === "user"
                          ? "ml-auto bg-blue-500 text-white"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {loading && <p className="text-gray-400 text-sm">Typing...</p>}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-3 bg-white flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Send
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
