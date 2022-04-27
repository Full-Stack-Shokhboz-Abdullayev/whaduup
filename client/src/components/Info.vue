<script lang="ts" setup>
import { defineProps } from "vue";

defineProps<{ message: string }>();
</script>

<template>
  <div class="rounded-full px-4 py-2 text-white bg-white bg-opacity-10">
    {{ message }}
  </div>
</template>
