<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, defineProps } from "vue";
import { RouteLocationNormalized } from "vue-router";
import { restler } from "../services/rest.service";
import { useUserStore } from "../store/user.store";
import { User } from "../types/User.type";
import eventsUtil from "../utils/events.util";
import Avatar from "./Avatar.vue";
import UsersListHeader from "./UsersListHeader.vue";

const users = ref<User[]>([]);
const userStore = useUserStore();
const sidebarOpen = ref(false);

defineProps<{
  route: RouteLocationNormalized;
}>();

const eventsInit = () => {
  eventsUtil.on("sidebar-toggle", (val: boolean) => {
    sidebarOpen.value = val;
  });
};

onMounted(() => {
  eventsInit();
});
onBeforeMount(async () => {
  const { users: us } = await restler.users();
  users.value = us;
});
</script>
<template>
  <aside
    v-if="userStore.me"
    :class="{ '!-translate-x-full': !sidebarOpen && route.params.username }"
    class="users-list sm:!translate-x-0"
  >
    <UsersListHeader :user="userStore.me" />
    <div class="aside-messages">
      <router-link
        v-for="user in users"
        :key="user.id"
        :to="{
          name: 'chat-room',
          params: {
            username: user.username,
          },
        }"
        @click="() => eventsUtil.trigger('sidebar-toggle', false)"
        exact-active-class="message-active"
        class="message block text-gray-300 px-4 py-3 border-b border-gray-700 cursor-pointer"
      >
        <div class="flex items-center relative">
          <div class="w-auto mr-3">
            <Avatar :name="user.name" />
          </div>
          <div class="w-full">
            <div class="text-lg text-white">{{ user.name }}</div>
          </div>
        </div>
      </router-link>
    </div>
  </aside>
</template>
