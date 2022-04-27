import type { User } from "./User.type";
export type Message = {
  id: number;
  text: string;
  from: User;
  to: User;
  createdAt: string;
  updated: boolean;
  file: string;
};
