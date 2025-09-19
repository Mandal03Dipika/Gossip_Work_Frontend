
import React from "react";
import useChatStore from "../contexts/ChatContext";

interface ChatHeaderProps {
  onCloseChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onCloseChat }) => {
  const { selectedUser, selectedGroup } = useChatStore();

  if (!selectedUser && !selectedGroup) return null;

  const profilePic =
    selectedUser?.profilePic || selectedGroup?.profilePic || "/1.jpg";
  const displayName = selectedUser ? selectedUser.username : selectedGroup?.name;

  return (
    <div className="flex items-center p-2 border-b border-gray-300 bg-white">
      <img
        src={profilePic}
        alt={displayName}
        className="w-10 h-10 rounded-full object-cover"
      />
      <span className="ml-3 font-semibold">{displayName}</span>
      <button
        className="ml-auto text-gray-600 hover:text-red-500"
        onClick={onCloseChat}
      >
        ✖
      </button>
    </div>
  );
};

export default ChatHeader;
