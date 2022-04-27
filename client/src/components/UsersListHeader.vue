<script setup lang="ts">
import Avatar from "./Avatar.vue";
import { defineProps } from "vue";
import { User } from "../types/User.type";
import { restler } from "../services/rest.service";

defineProps<{
  user: User;
}>();

const logout = () => restler.logout();
</script>

<template>
  <div class="aside-header sticky top-0 right-0 left-0 z-40 text-gray-400">
    <div class="flex items-center px-4 py-3">
      <div class="">
        <Avatar :name="user.name" />
      </div>
      <div class="flex-1 px-3 font-bold text-lg">
        {{ user.name }}
      </div>
      <div class="text-right">
        <button
          @click="logout"
          class="p-3 rounded-full hover:bg-white hover:bg-opacity-10"
        >
          Logout
        </button>
      </div>
    </div>
    <div class="search-bar px-4 py-2 w-full">
      <form method="GET">
        <div class="relative text-gray-600 focus-within:text-gray-200">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <button
              type="submit"
              class="p-1 focus:outline-none focus:shadow-outline"
            >
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                class="w-4 h-4 text-gray-300"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </span>
          <input
            type="search"
            name="q"
            class="w-full py-2 text-sm text-white bg-gray-600 rounded-full pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
            placeholder="Search or start new chat"
            autocomplete="off"
          />
        </div>
      </form>
    </div>
  </div>
</template>
