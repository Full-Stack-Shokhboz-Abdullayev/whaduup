<script setup lang="ts">
import { onBeforeMount } from "vue";
import { restler } from "./services/rest.service";
import { socket } from "./services/socket.service";

onBeforeMount(async () => {
  socket.connect();
  await restler.refresh();
});
</script>
<template>
  <div class="overflow-x-hidden">
    <router-view />
  </div>
</template>
