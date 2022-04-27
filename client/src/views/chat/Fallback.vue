<script lang="ts" setup>
import Info from "../../components/Info.vue";
</script>

<template>
  <main
    id="messageBody"
    class="w-full hidden sm:block relative overflow-y-auto contain-content"
  >
    <div class="bg-whatsapp fixed top-0 left-0 w-full h-full -z-10"></div>
    <div class="main-messages w-full h-full flex justify-center items-center">
      <Info message="Please select a chat to start messaging..." />
    </div>
  </main>
</template>
