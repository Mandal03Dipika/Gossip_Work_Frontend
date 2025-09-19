import React, { useEffect, useRef, useState } from "react";
import useChatStore from "../contexts/ChatContext";
import type { Message } from "../contexts/ChatContext";
import ChatHeader from "./ChatHeader";
import { useAuthContext } from "@/features/Auth/contexts/AuthContext";

const ChatContainer: React.FC = () => {
  const { messages, selectedUser, selectedGroup, subscribeToMessages, subscribeToGroupMessages } =
    useChatStore();
  const authContext = useAuthContext();

  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authContext?.socket) {
      subscribeToMessages(authContext.socket);
      subscribeToGroupMessages(authContext.socket);
    }
  }, [subscribeToMessages, subscribeToGroupMessages, authContext?.socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const closeChat = () => {
    useChatStore.setState({ selectedUser: null, selectedGroup: null });
  };

  if (!selectedUser && !selectedGroup) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="text-gray-400">Select a chat to start messaging</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full">
      <ChatHeader onCloseChat={closeChat} />

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {messages.map((msg: Message) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender === selectedUser?._id ? "justify-end" : "justify-start"
            }`}
          >
            <div className="bg-white p-2 rounded-lg shadow-md max-w-xs">
              {msg.text && <p>{msg.text}</p>}
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="attachment"
                  className="mt-2 rounded cursor-pointer max-h-40"
                  onClick={() => setEnlargedImage(msg.imageUrl!)}
                />
              )}
              {msg.videoUrl && (
                <video controls className="mt-2 rounded max-h-40">
                  <source src={msg.videoUrl} type="video/mp4" />
                </video>
              )}
              <small className="block text-xs text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setEnlargedImage(null)}
        >
          <img
            src={enlargedImage}
            alt="enlarged"
            className="max-h-[90%] max-w-[90%] object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;