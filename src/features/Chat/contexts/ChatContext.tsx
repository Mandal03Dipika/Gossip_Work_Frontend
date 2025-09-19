
import { create } from "zustand";
import { Socket } from "socket.io-client";

export interface User {
  _id: string;
  username: string;
  profilePic?: string;
}

export interface Group {
  _id: string;
  name: string;
  profilePic?: string;
}

export interface Message {
  _id: string;
  sender: string;
  receiver?: string;
  groupId?: string;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
}

interface ChatState {
  selectedUser: User | null;
  selectedGroup: Group | null;
  messages: Message[];
  groups: Group[];
  users: User[];
  requests: User[];
  setSelectedUser: (user: User | null) => void;
  setSelectedGroup: (group: Group | null) => void;
  setMessages: (messages: Message[]) => void;
  subscribeToMessages: (socket: Socket) => void;
  subscribeToGroupMessages: (socket: Socket) => void;
}

const useChatStore = create<ChatState>((set, get) => ({
  selectedUser: null,
  selectedGroup: null,
  messages: [],
  groups: [],
  users: [],
  requests: [],

  setSelectedUser: (user) => set({ selectedUser: user }),
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  setMessages: (messages) => set({ messages }),

  subscribeToMessages: (socket) => {
    socket.off("newMessage");
    socket.on("newMessage", (newMessage: Message) => {
      set((state) => {
        if (
          state.selectedUser &&
          (newMessage.sender === state.selectedUser._id ||
            newMessage.receiver === state.selectedUser._id)
        ) {
          return { messages: [...state.messages, newMessage] };
        }
        return state;
      });
    });
  },

  subscribeToGroupMessages: (socket) => {
    socket.off("newGroupMessage");
    socket.on("newGroupMessage", (newMessage: Message) => {
      set((state) => {
        if (
          state.selectedGroup &&
          newMessage.groupId === state.selectedGroup._id
        ) {
          return { messages: [...state.messages, newMessage] };
        }
        return state;
      });
    });
  },
}));

export default useChatStore;