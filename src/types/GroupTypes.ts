export interface IGroup {
  _id: string
  name: string
  description?: string
  members: Array<string>
  admins: Array<string>
  profilePic?: string
}

export interface IGroupContext {
  selectedGroup: IGroup | null
  groups: Array<IGroup>
  groupEdit: boolean
  groupCreation: boolean
  isGroupsLoading: boolean
  isMessagesLoading: boolean
  getGroups: () => Promise<void>
  getGroupMessages: (groupId: string) => void
  sendGroupMessages: (messageData: any) => Promise<void>
  subscribeToGroupMessages: () => void
  unSubscribeFromGroupMessages: () => void
  newGroup: (groupData: any) => Promise<IGroup>
  editGroup: (groupData: any, groupId: string) => Promise<IGroup>
  leaveGroup: (groupId: string, userId: string) => Promise<any>
}