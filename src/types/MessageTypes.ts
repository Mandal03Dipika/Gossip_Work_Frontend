export interface IMessage {
  senderId: string
  groupId?: string
  receiverId?: string
  text?: string
  file?: string
  fileType?: string
}
