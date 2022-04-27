<script lang="ts" setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { restler } from "../../services/rest.service";
import { LoginBody } from "../../types/Login.interface";

const form = reactive<LoginBody>({
  username: "",
  password: "",
});

const router = useRouter();

const handleSubmit = async () => {
  const { success } = await restler.login(form);
  if (success) {
    router.push("/chat");
  }
};
</script>

<template>
  <div
    class="flex items-center min-h-screen p-4 bg-brand-grey-1 lg:justify-center"
  >
    <div
      class="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md"
    >
      <div
        class="p-4 py-6 text-white bg-brand-blue-green md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly"
      >
        <div class="my-3 text-4xl font-bold tracking-wider text-center">
          <a href="#">Whaduup</a>
        </div>
        <p class="mt-6 font-normal text-center text-gray-300 md:mt-0">
          Chat and have fun with your friends. It's free and always will be.
          Built using WebSockets.
        </p>
        <p class="flex flex-col items-center justify-center mt-10 text-center">
          <span>Don't have an account?</span>
          <router-link :to="{ name: 'auth-register' }" class="underline"
            >Get Started!</router-link
          >
        </p>
        <p class="mt-6 text-sm text-center text-gray-300">
          Read our <a href="#" class="underline">terms</a> and
          <a href="#" class="underline">conditions</a> <br />
          (there are no 🤣)
        </p>
      </div>
      <div class="p-5 bg-brand-grey-2 md:flex-1">
        <h3 class="my-4 text-2xl font-semibold text-white">Account Login</h3>
        <form @submit.prevent="handleSubmit" class="flex flex-col space-y-5">
          <div class="flex flex-col space-y-1">
            <label for="email" class="text-sm font-semibold text-gray-100"
              >Username</label
            >
            <input
              v-model="form.username"
              id="email"
              autofocus
              class="px-4 py-2 bg-brand-grey-2 text-white transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-brand-blue-green-light focus:ring-2"
            />
          </div>
          <div class="flex flex-col space-y-1">
            <div class="flex items-center justify-between">
              <label for="password" class="text-sm font-semibold text-gray-100"
                >Password</label
              >
            </div>
            <input
              v-model="form.password"
              type="password"
              id="password"
              class="px-4 py-2 bg-brand-grey-2 text-white transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-brand-blue-green-light focus:ring-2"
            />
          </div>

          <div>
            <button
              type="submit"
              class="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-brand-blue-green rounded-md shadow hover:bg-brand-blue-green-light focus:outline-none"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
