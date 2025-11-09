<template>
  <div class="h-screen w-full flex justify-center">
    <div class="lg:w-1/2 h-screen">
      <img :src="homeBgImage" alt="Background" class="object-cover w-full h-full" />
    </div>

    <div class="lg:w-1/2">
      <div class="h-screen flex justify-center items-center bg-sky-500">
        <UsernameForm @submit="onSubmit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import UsernameForm from '../components/usernameForm.vue'
import { useGithubStore } from '../store/github'
import homeBgImage from '../assets/images/homepage_bgImage.jpg'

const router = useRouter()
const githubStore = useGithubStore()

function onSubmit(username: string) {
  const trimmedUsername = username.trim()

  if (trimmedUsername !== githubStore.currentUsername) {
    githubStore.reset()
  }

  router.push(`/repos/${trimmedUsername}`)
}
</script>

<style>

</style>