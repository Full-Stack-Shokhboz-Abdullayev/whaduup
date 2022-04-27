<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../store/user.store";
const userStore = useUserStore();
const router = useRouter();
onMounted(() => {
  if (userStore.me) {
    router.push("/chat");
  }
});
</script>
<template><router-view></router-view></template>
