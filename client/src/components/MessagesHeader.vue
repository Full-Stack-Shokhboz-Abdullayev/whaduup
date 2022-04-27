<script setup lang="ts">
import { User } from "../types/User.type";
import Avatar from "./Avatar.vue";
import { defineProps } from "vue";
import eventsUtil from "../utils/events.util";

defineProps<{
  user: User;
}>();

function sideBarToggle() {
  eventsUtil.trigger("sidebar-toggle", true);
}
</script>

<template>
  <div class="main-header z-40 sticky top-0 right-0 left-0 text-gray-400">
    <div class="flex items-center px-4 py-3">
      <button
        @click="sideBarToggle"
        class="sm:hidden font-bold text-white text-4xl mr-4 flex w-10 h-10 justify-center items-center rounded-full bg-white bg-opacity-10 border-white border"
      >
        <img
          class="w-5 h-5"
          src="../assets/left-arrow-svgrepo-com.svg"
          alt="arrow"
        />
      </button>
      <div class="flex-1">
        <div class="flex">
          <div class="mr-4">
            <Avatar :name="user.name" />
          </div>
          <div class="flex items-center">
            <p class="text-md font-bold text-white">
              {{ user.name }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex-1 text-right">
        <svg
          class="inline w-6 h-6 cursor-pointer mr-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          class="inline w-6 h-6 cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
