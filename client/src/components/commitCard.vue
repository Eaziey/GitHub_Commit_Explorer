<script setup lang="ts">
import { useGithubStore } from '../store/github';
import { HeartIcon as HeartOutline, HeartIcon as HeartSolid } from '@heroicons/vue/24/solid'

interface Props {
  message: string
  name: string 
  date: string
  sha: string
  repo: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'viewCommitDetails',repo:string, sha: string): void
  (e: 'addToFavourite'):void
  (e: 'removeFromFavourites'):void
}>()

const date = new Date(props.date)
const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
const githubStore = useGithubStore()

function isFavourite(sha: string): boolean {
  return githubStore.favourites.some(fav => fav.sha === sha)
}
</script>

<template>
  <div class="flex flex-col w-72 h-80 bg-white rounded shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-200">
    <!-- Header -->
    <div class="flex justify-between items-center px-5 py-4 bg-gray-50 border-b border-gray-200">
      <h1 class="text-gray-500 text-lg font-semibold truncate mr-2">{{ props.repo }}</h1>
      <button
        v-if="isFavourite(props.sha)"
        @click="emit('removeFromFavourites')"
        class="bg-red-50 text-red-500 rounded-full p-2 hover:bg-red-100 hover:cursor-pointer transition"
      >
        <HeartSolid class="w-5 h-5" />
      </button>
      <button
        v-else
        @click="emit('addToFavourite')"
        class="bg-gray-50 text-gray-500 rounded-full p-2 hover:bg-gray-100 hover:cursor-pointer transition"
      >
        <HeartOutline class="w-5 h-5" />
      </button>
    </div>

    <!-- Body -->
    <div class="flex flex-col justify-between bg-gray-50 mx-5 mt-4 px-4 py-3 h-60 rounded ">
      <div class="overflow-none h-28">
        <h2 class=" text-blue-800 text-sm font-medium mb-2">{{ props.name }}</h2>
        <p class="text-gray-700 text-sm line-clamp-4">{{ props.message }}</p>
      </div>
      <p class="text-gray-400 text-xs mt-3">{{ formattedDate }}</p>
    </div>

    <!-- Footer -->
    <div class="flex justify-center items-center py-4">
      <button
        @click="emit('viewCommitDetails', props.repo, props.sha)"
        class="bg-sky-500 hover:bg-sky-600 w-40 text-white font-semibold rounded py-2 px-4 hover:cursor-pointer shadow-md transition"
      >
        View Details
      </button>
    </div>
  </div>
</template>
