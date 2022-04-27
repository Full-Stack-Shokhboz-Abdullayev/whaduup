<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import Info from "../../components/Info.vue";
import MessagesHeader from "../../components/MessagesHeader.vue";
import {
  destroyUploader,
  socket,
  uploader,
} from "../../services/socket.service";
import { useChatStore } from "../../store/chat.store";
import { useUserStore } from "../../store/user.store";
import { Message } from "../../types/Message.type";
import {
  scrollToBottom,
  getFormattedTime,
  getFileName,
  isImage,
} from "../../utils/messages.utils";
import ContextMenu from "../../components/ContextMenu.vue";
import eventsUtil from "../../utils/events.util";

const chatStore = useChatStore();
const userStore = useUserStore();
const input = ref("");
const fileInput = ref<File | null>(null);
const contextMenu = ref<number | null>(null);
const editingMessage = ref<Message | null>(null);
const sidebarOpen = ref(false);

const addMessage = (message: Message) => {
  chatStore.addMessage(message);
  setTimeout(() => {
    scrollToBottom();
  }, 100);
};

const updateMessage = (message: Message) => {
  chatStore.updateMessage(message);
};

const deleteMessage = (id: number) => {
  chatStore.deleteMessage(id);
};

const initUploader = () => {
  // 3mb in multiplied form
  uploader.maxFileSize = 1024 * 1024 * 3;
  uploader.addEventListener("start", (e: any) => {
    e.file.meta.message = {
      from: userStore.me,
      to: chatStore.currentUser,
      ...(editingMessage.value
        ? {
            ...editingMessage.value,
          }
        : {}),
      text: input.value,
    };
    if (editingMessage.value) {
      editingMessage.value = null;
    }
    input.value = "";
  });
  uploader.addEventListener("error", function (data: any) {
    if (data.code === 1) {
      const fileUploadInput =
        document.querySelector<HTMLInputElement>("#file-upload");
      alert("Don't upload such a big file");
      fileInput.value = null;
      if (fileUploadInput) {
        fileUploadInput.value = "";
      }
    }
    console.log(data);
  });
};

function onUpload(e: Event) {
  if (e.target) {
    const target = e.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (file) {
      fileInput.value = file;
    }
  }
}

function onContextMenu(message: Message) {
  contextMenu.value = message.id;
}

function offContextMenu() {
  contextMenu.value = null;
}

function sendMessage() {
  if (fileInput.value) {
    try {
      uploader.submitFiles([fileInput.value as File]);
      fileInput.value = null;
      return;
    } catch {
      return;
    }
  }
  if (!input.value) {
    if (editingMessage.value) {
      input.value = editingMessage.value.text;
    }
    return;
  }
  if (editingMessage.value) {
    socket.emit("update-message", {
      ...editingMessage.value,
      text: input.value,
    });
    editingMessage.value = null;
  } else {
    socket.emit("send-message", {
      text: input.value,
      from: userStore.me,
      to: chatStore.currentUser,
    });
  }
  input.value = "";
}

function onDelete(message: Message) {
  socket.emit("delete-message", {
    id: message.id,
    to: chatStore.currentUser,
    file: message.file,
  });
  deleteMessage(message.id);
}

function onEdit(message: Message) {
  editingMessage.value = message;
  input.value = message.text;
}

function cancelEditing() {
  editingMessage.value = null;
  input.value = "";
}

const eventsInit = () => {
  eventsUtil.on("sidebar-toggle", (val: boolean) => {
    sidebarOpen.value = val;
  });
};

onMounted(() => {
  socket.on("message-sent", addMessage);
  socket.on("message-deleted", deleteMessage);
  socket.on("message-updated", updateMessage);
  scrollToBottom(false);
  initUploader();
  eventsInit();
});
onUnmounted(() => {
  socket.off("message-sent", addMessage);
  socket.off("message-deleted", deleteMessage);
  socket.off("message-updated", updateMessage);
  destroyUploader();
});
</script>

<template>
  <main
    id="messageBody"
    @click="offContextMenu"
    @contextmenu="offContextMenu"
    :class="sidebarOpen ? '!translate-x-full absolute' : 'fixed'"
    class="w-full relative overflow-y-auto contain-content sm:!translate-x-0 transition-transform duration-500"
  >
    <div
      class="flex bg-brand-blue-grey-transparent w-full h-full items-center justify-center"
      v-if="!chatStore.currentUser || !chatStore.messages.length"
    >
      <Info :message="'Loading...'" />
    </div>

    <template v-else-if="chatStore.currentUser && chatStore.messages.length">
      <MessagesHeader :user="chatStore.currentUser" />
      <div
        v-if="!chatStore.messages.length"
        class="main-messages w-full flex justify-center items-center"
      >
        <div class="rounded-full px-4 py-2 text-white bg-white bg-opacity-10">
          No messages yet...
        </div>
      </div>
      <div v-else class="main-messages block px-4 py-3">
        <div
          v-for="(message, idx) in chatStore.messages"
          :key="'message' + message.id"
          class="flex"
          :class="{
            'justify-end': message.from.id === userStore.me?.id,
          }"
        >
          <span v-if="message.from.id !== userStore.me?.id"
            ><svg
              :class="'incoming-svg'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 8 13"
              width="8"
              height="13"
            >
              <path
                opacity=".13"
                d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"
              ></path>
              <path
                fill="currentColor"
                d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"
              ></path></svg
          ></span>
          <div
            @contextmenu.prevent.stop="onContextMenu(message)"
            class="single-message relative text-gray-200 rounded-bl-lg rounded-br-lg mb-4 px-4 py-2"
            :class="
              message.from.id === userStore.me?.id
                ? 'user rounded-tl-lg'
                : 'rounded-tr-lg'
            "
          >
            <ContextMenu
              @delete="onDelete(message)"
              @edit="onEdit(message)"
              :idx="idx"
              v-if="
                message.from.id === userStore.me?.id &&
                message.id === contextMenu
              "
            />
            <template v-if="message.file">
              <img
                v-if="isImage(message.file)"
                :src="message.file"
                class="max-w-lg max-h-40 object-cover"
                :alt="'image ' + message.id"
              />
              <a
                v-else
                :href="message.file"
                class="block px-4 py-2 text-white bg-white bg-opacity-20 rounded-sm text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  class="inline w-6 h-6 -mt-1 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                {{ getFileName(message.file) }}
              </a>
            </template>
            {{ message.text }}
            <span class="text-xs inline-block">
              {{ message.updated ? "edited" : "" }}
              {{ getFormattedTime(message.createdAt) }}
            </span>
          </div>
          <span v-if="message.from.id === userStore.me?.id"
            ><svg
              :class="'user-svg'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 8 13"
              width="8"
              height="13"
            >
              <path
                opacity=".13"
                d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"
              ></path>
              <path
                fill="currentColor"
                d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"
              ></path></svg
          ></span>
        </div>
      </div>
      <div class="main-footer sticky bottom-0 right-0 left-0 text-gray-400">
        <div v-if="editingMessage" class="pt-3 px-4 relative">
          <span class="font-bold">🖊 Editing:</span>
          {{ editingMessage.text || getFileName(editingMessage.file) }}

          <button @click="cancelEditing" class="absolute right-0 mr-4">
            ✖
          </button>
        </div>
        <div v-if="fileInput" class="pt-3 px-4 relative">
          <span class="font-bold">📂 File:</span> {{ fileInput.name }}

          <button @click="fileInput = null" class="absolute right-0 mr-4">
            ✖
          </button>
        </div>
        <div class="flex items-center px-4 py-1">
          <div class="flex-none">
            <label>
              <input
                @change="onUpload"
                type="file"
                id="file-upload"
                class="hidden"
              />
              <svg
                class="inline w-6 h-6 -mt-1 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </label>
          </div>
          <div class="flex-grow">
            <div class="px-4 py-2 w-full">
              <form @submit.prevent="sendMessage">
                <div class="relative text-gray-600 focus-within:text-gray-200">
                  <input
                    v-model.trim="input"
                    class="message-input w-full py-3 text-sm text-white rounded-full pl-5 focus:outline-none focus:bg-white focus:text-gray-900"
                    :placeholder="
                      fileInput ? 'Add a caption' : 'Type a message'
                    "
                    autocomplete="off"
                  />
                </div>
              </form>
            </div>
          </div>
          <div @click="sendMessage" class="flex-none text-right">
            <button>{{ editingMessage ? "Update" : "Send" }}</button>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>
