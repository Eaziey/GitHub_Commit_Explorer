<template>
  <div>
  <!--loader-->
    <div v-if="loading" class="fixed inset-0 bg-gray-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-sky-500 border-solid"></div>
      </div>
    </div>

  
    <div v-else class="h-screen w-full flex justify-center">
      <div class="lg:w-1/2 h-screen">
        <img :src="homeBgImage" alt="Background" class="object-cover w-full h-full" />
      </div>

      <div class="lg:w-1/2">
        <div class="h-screen flex justify-center items-center bg-sky-500">
          <UsernameForm @submit="onSubmit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UsernameForm from '../components/usernameForm.vue'
import { useGithubStore } from '../store/github'
import homeBgImage from '../assets/images/homepage_bgImage.jpg'

const router = useRouter()
const githubStore = useGithubStore()
const loading = ref(true)

onMounted(() => {
  // Show loader for 3.5 seconds
  setTimeout(() => {
    loading.value = false
  }, 3500)
})

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