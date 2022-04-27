<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
const emit = defineEmits(["delete", "edit"]);
defineProps<{ idx: number }>();
</script>

<template>
  <div
    :class="
      idx === 0
        ? 'right-full top-1/2 -translate-y-1/2 mr-1'
        : 'bottom-full right-0 mb-1'
    "
    class="flex items-center p-2 rounded bg-white bg-opacity-80 absolute z-10"
  >
    <button @click="emit('edit')" class="edit-btn px-1 mx-2">🖊</button>
    <button @click="emit('delete')" class="delete-btn px-1 mx-2">🗑</button>
  </div>
</template>
