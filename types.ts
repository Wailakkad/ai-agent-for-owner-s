
export enum Sender {
  User,
  AI,
  System,
}

export interface Message {
  id: string;
  sender: Sender;
  text?: string;
  imageUrl?: string;
  isTyping?: boolean;
}

export interface ImageFile {
  file: File;
  base64: string;
}
