import { defineStore } from "pinia";
import { User } from "../types/User.type";
import { Message } from "../types/Message.type";

interface State {
  messages: Message[];
  currentUser: User | null;
}
export const useChatStore = defineStore("chat", {
  state(): State {
    return {
      currentUser: null,
      messages: [],
    };
  },
  actions: {
    default() {
      this.currentUser = null;
      this.messages = [];
    },
    setCurrentUser(payload: User) {
      this.currentUser = payload;
    },
    setMessages(payload: Message[]) {
      this.messages = payload;
    },
    addMessage(payload: Message) {
      this.messages.push(payload);
    },
    deleteMessage(id: number) {
      this.messages = this.messages.filter((message) => message.id !== id);
    },
    updateMessage(payload: Message) {
      const index = this.messages.findIndex(
        (message) => message.id === payload.id
      );
      console.log(index);

      this.messages[index] = payload;
    },
  },
});
