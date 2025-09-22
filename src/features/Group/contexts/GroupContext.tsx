import { createContext, useContext, useState } from 'react'

import type { IUser } from '@/types/AuthTypes'
import type { Socket } from 'socket.io-client'

import type { IGroup, IGroupContext } from '@/types/GroupTypes'
import type { IMessage } from '@/types/MessageTypes'

import { useAuthContext } from '@/features/Auth/contexts/AuthContext'

const GroupContext = createContext<IGroupContext | null>(null)

export const GroupContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);
  const [groups, setGroups] = useState<Array<IGroup>>([]);
  const [groupEdit, setGroupEdit] = useState(false);
  const [groupCreation, setGroupCreation] = useState(false);
  const [isGroupsLoading, setIsGroupsLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messages, setMessages] = useState<Array<IMessage>>([]);

  const getGroups = async () => {
    const { authUser, socket } = useAuthContext()! as {
      authUser: IUser | null
      socket: Socket | null
    }

    if (!authUser || !socket) {
      console.error('Socket or user not found')
      return
    }

    socket.emit(
      'getGroupsForSidebar',
      { userId: authUser._id },
      (response: { success: any; groups: any; error: any }) => {
        if (response.success && response.groups) {
          setGroups(response.groups)
        } else {
          console.error(response.error || 'Failed to fetch groups')
        }
      },
    )
  }

  const getGroupMessages = async (groupId: string) => {
    setIsMessagesLoading(true);

    const socket = useAuthContext()?.socket;
    socket?.emit("getGroupMessages", { groupId }, (response: { success: boolean; decryptedMessages?: Array<IMessage>; error?: string }) => {
      if (response.success) {
        setMessages( response.decryptedMessages ?? [] );
      } else {
        console.error(response.error || "Failed to get group messages");
      }
      setIsMessagesLoading(true);
    });
  }

  const sendGroupMessages = async (messageData: any) => {
    const socket = useAuthContext()?.socket;
    const authUser = useAuthContext()?.authUser;

    if (!socket || !authUser || !selectedGroup) {
      console.error("Missing required information to send message");
      return;
    }

    const payload = {
      ...messageData,
      groupId: selectedGroup._id,
      senderId: authUser._id,
    };

    socket.emit("sendGroupMessage", payload, (response: { success: any; message: any; error: any }) => {
      if (response.success) {
        setMessages([...messages, response.message]);
      } else {
        console.error(response.error || "Failed to send group message");
      }
    });
  }

  const subscribeToGroupMessages = () => {
    const socket = useAuthContext()?.socket;
    socket?.off("newGroupMessage");

     socket?.on("newGroupMessage", (newMessage) => {
      if (selectedGroup && newMessage.groupId === selectedGroup._id) {
        setMessages([...messages, newMessage]);
      }
      setGroups((prevGroups) =>
      prevGroups.map((g) =>
        g._id === newMessage.groupId
          ? { ...g, lastMessage: newMessage }
          : g
      )
    );
    });
  }

  const unSubscribeFromGroupMessages = () => {
    const socket = useAuthContext()?.socket;
    socket?.off("newGroupMessage");
  }

  const newGroup = async (groupData: any) => {
    const socket = useAuthContext()?.socket;
    const getGroups = useGroupContext()?.getGroups;
    return new Promise<IGroup>((resolve, reject) => {
      socket?.emit("createGroup", groupData, (response: { success: any; group: IGroup; error: any }) => {
        if (response.success) {
          getGroups?.();
          setSelectedGroup(null);
          resolve(response.group);
        } else {
          console.error(response.error || "Failed to create group");
          reject(response);
        }
      });
    });
  }

  const editGroup = async (groupData: any, groupId: string) => {
    const socket = useAuthContext()?.socket;
    const getGroups = useGroupContext()?.getGroups;

      return new Promise<IGroup>((resolve, reject) => {
      socket?.emit("updateGroup", { ...groupData, groupId }, (response: { success: any; group: IGroup | PromiseLike<IGroup>; error: any }) => {
        if (response.success) {
          setGroupEdit(false);
          setSelectedGroup(null);
          getGroups?.();
          resolve(response.group);
        } else {
          console.error(response.error || "Failed to update group");
          reject(response);
        }
      });
    });
  }

  const leaveGroup = async (groupId: string, userId: string) => {
    const socket = useAuthContext()?.socket;
    const getGroups = useGroupContext()?.getGroups;

    return new Promise((resolve, reject) => {
      socket?.emit("leaveGroup", { groupId, userId }, (response: { success: any; data: any; error: any }) => {
        if (response.success) {
          getGroups?.();
          setSelectedGroup(null);
          resolve(response.data);
        } else {
          console.error(response.error || "Failed to leave group");
          reject(response);
        }
      });
    });
  }

  return (
    <GroupContext.Provider
      value={{
        selectedGroup,
        groups,
        groupEdit,
        groupCreation,
        isGroupsLoading,
        isMessagesLoading,

        getGroups,
        getGroupMessages,
        sendGroupMessages,
        subscribeToGroupMessages,
        unSubscribeFromGroupMessages,
        newGroup,
        editGroup,
        leaveGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  )
}

export const useGroupContext = () => useContext(GroupContext);