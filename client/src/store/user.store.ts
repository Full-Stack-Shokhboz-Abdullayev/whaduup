import { defineStore } from "pinia";
import { User } from "../types/User.type";

interface State {
  me: User | null;
}
export const useUserStore = defineStore("user", {
  state(): State {
    return {
      me: null,
    };
  },
  actions: {
    default() {
      this.me = null;
    },
    setMe(payload: User) {
      this.me = payload;
    },
  },
});
