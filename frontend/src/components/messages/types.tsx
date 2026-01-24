export type UserMessage = {
  content: string;
  sender: boolean;
  sendDate: Date;
};
export type Conversation = {
  participants: User[];
  lastMessage: UserMessage;
};
