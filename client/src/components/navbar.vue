<script setup lang="ts">
import logo from "../assets/images/logo_noBg.png"
import { useGithubStore } from "../store/github";

const githubStore = useGithubStore();

</script>

<template>
  <nav class="fixed top-0 z-50 w-full bg-white shadow-md flex items-center justify-between px-6 py-3 h-16">
    <router-link to="/" class="flex items-center space-x-2 hover:opacity-80">
      <img :src="logo" alt="Logo" class="h-20 w-auto" />
      <span class="text-xl font-bold text-gray-800">GitSplore</span>
    </router-link>

    <div class="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
      {{ githubStore.currentUsername }}
    </div>
  </nav>
</template>
