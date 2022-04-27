<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{
  name: string;
}>();
</script>

<template>
  <div
    class="rounded-full bg-white bg-opacity-20 w-12 h-12 flex justify-center items-center font-bold text-white"
  >
    {{ name.toUpperCase()[0] }}
  </div>
</template>
