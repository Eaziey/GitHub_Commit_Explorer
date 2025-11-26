<script setup lang="ts">
import logo from "../assets/images/logo_black_bg.jpg"
import { useGithubStore } from "../store/github";

const githubStore = useGithubStore();

</script>

<template>
  <nav class="fixed top-0 z-50 w-full border-b border-sky-500 bg-black shadow-md flex items-center justify-between px-15 py-4 h-20">
    <router-link to="/" class="flex items-center space-x-2 hover:opacity-80">
      <img :src="logo" alt="Logo" class="h-13 w-auto" />
      <span class="text-xl font-bold text-white">GitSplore</span>
    </router-link>

    <div v-show="githubStore.currentUsername" class="bg-sky-100 text-sky-600 px-4 py-1 rounded-full text-sm font-medium">
      {{ githubStore.currentUsername }}
    </div>
  </nav>
</template>
