<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import UsersList from "../../components/UsersList.vue";
import { restler } from "../../services/rest.service";
import { socket } from "../../services/socket.service";
import { useChatStore } from "../../store/chat.store";
import { useUserStore } from "../../store/user.store";
import { Message } from "../../types/Message.type";
import { User } from "../../types/User.type";
import { scrollToBottom } from "../../utils/messages.utils";

const error = ref(false);
const route = useRoute();
const chatStore = useChatStore();
const userStore = useUserStore();
const getCurrentUser = async () => {
  chatStore.default();

  if (route.params.username) {
    const { success, user }: { success: boolean; user: User } =
      await restler.user(route.params.username as string);
    if (success && user) {
      chatStore.setCurrentUser(user);
      const { success, messages }: { success: boolean; messages: Message[] } =
        await restler.messages(user);
      if (success) {
        chatStore.setMessages(messages);
        setTimeout(() => {
          scrollToBottom(false);
        }, 100);
        scrollToBottom(false);
      }
    } else {
      error.value = true;
    }
  }
};

watch(() => route.params, getCurrentUser);

onBeforeMount(getCurrentUser);

onBeforeUnmount(() => {
  socket.emit("chat-disconnected", {
    username: userStore.me?.username,
  });
});
</script>

<template>
  <!-- my Only optimized for viewing on desktop -->
  <div class="bg-whatsapp fixed top-0 left-0 w-full h-full -z-10"></div>

  <div class="w-full h-screen flex">
    <UsersList :route="route" />

    <router-view></router-view>
  </div>
</template>
