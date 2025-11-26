
<template>
  <div>
    <!-- Loader -->
    <transition name="fade" mode="out-in">
      <div
        v-if="loading"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <Loader />
      </div>

    <!-- Page -->
      <div v-else class="h-screen w-full flex justify-center">
        <div class="lg:w-1/2 h-screen">
          <img :src="homeBgImage" loading="lazy" alt="Background" class="object-cover w-full h-full" />
        </div>
        <div class="lg:w-1/2 m-5 rounded-lg">
          <div class="h-full flex justify-center items-center bg-black">
            <UsernameForm @submit="onSubmit" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UsernameForm from '../components/usernameForm.vue'
import { useGithubStore } from '../store/github'
import homeBgImage from '../assets/images/homepage_bgImage.jpg'
import Loader from '../components/loader.vue';

const router = useRouter()
const githubStore = useGithubStore()
const loading = ref(true)

onMounted(() => {
  // Show loader for 4 seconds
  setTimeout(() => {
    loading.value = false
  }, 4000)
})

function onSubmit(username: string) {
  const trimmedUsername = username.trim()
  if (trimmedUsername !== githubStore.currentUsername) {
    githubStore.reset()
  }
  router.push(`/repos/${trimmedUsername}`)
}
</script>

<style scoped>



</style>