import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../Store/AuthStore";
import { Loader2, SendHorizonal } from "lucide-react";

const ChatBoxUser = () => {
  const {
    SelectedUser,
    isSendindMessages,
    sendMessage,
    receiveMessages,
    receivedMessages,
    isLoadingMessages,
    ClearChats,
    listeningMessages,
    onlineUsers,
  } = useAuthStore();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (SelectedUser?._id) {
      receiveMessages(SelectedUser._id);
    }
    listeningMessages();
  }, [SelectedUser]);

  useEffect(() => {
    if (messagesEndRef.current && receivedMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [receivedMessages]);

  const handleSend = async () => {
    if (message.trim()) {
      await sendMessage(SelectedUser._id, message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-base-100">
      <div className="flex items-center justify-between p-4 border-b bg-base-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <img
            src={SelectedUser.profilePic}
            className="w-10 h-10 rounded-full"
            alt={SelectedUser.fullName}
          />
          <div>
            <h2 className="text-lg font-semibold">{SelectedUser.fullName}</h2>
            <p className="text-sm text-gray-500">
              {onlineUsers.includes(SelectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : (
          receivedMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === SelectedUser._id
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-md text-sm break-words max-w-[75%] ${
                  msg.sender === SelectedUser._id
                    ? "bg-base-300 "
                    : "bg-base-200 "
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-4 border-t bg-base-200 flex items-center gap-2">
        <input
          type="text"
          className="input input-bordered flex-1"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="btn btn-accent btn-square"
          disabled={isSendindMessages}
          onClick={handleSend}
        >
          {isSendindMessages ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SendHorizonal size={20} />
          )}
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => {
            ClearChats(SelectedUser._id);
          }}
        >
          Delete Chat
        </button>
      </div>
    </div>
  );
};

export default ChatBoxUser;
