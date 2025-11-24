<script setup lang="ts">
import { useGithubStore } from '../store/github';
import { HeartIcon as HeartSolid, ArrowUpRightIcon, CodeBracketIcon } from '@heroicons/vue/24/solid'
import {HeartIcon as HeartOutline} from '@heroicons/vue/24/outline'

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
  <div class="bg-[#0f0f0f] border border-gray-500 flex flex-col w-67 h-80 rounded-xl transition-transform duration-300 overflow-hidden hover:scale-102 p-2">

    <div class="h-full rounded-xl px-4 text-xs">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <CodeBracketIcon class="w-7 h-7 text-sky-500" />
        <button
          v-if="isFavourite(props.sha)"
          @click="emit('removeFromFavourites')"
          class=" text-red-500 rounded-full p-2 hover:cursor-pointer transition"
        >
          <HeartSolid class="w-5 h-5" />
        </button>
        <button
          v-else
          @click="emit('addToFavourite')"
          class=" text-gray-200 p-2 hover:text-red-500 items-center rounded-full hover:cursor-pointer transition"
        >
          <HeartOutline class="w-5 h-5" />
        </button>
      </div>

      <div class=" flex flex-col justify-start items-start h-45 mt-7">
        <h5 class="text-lg text-white font-semibold truncate">{{ props.repo }}</h5>
        <h2 class=" text-sm text-sky-600 font-medium mb-2 w-full text-left"> {{ props.name }}</h2>
        <p class="text-white text-sm line-clamp-2 mt-4 w-full text-left">{{ props.message }}</p>
      </div>
      
     
    </div>

    <!-- Footer -->
    <div class="flex justify-between items-center px-4 pb-2">
      
      <p class="text-gray-100 text-xs w-full text-left">{{ formattedDate }}</p>
      <button
        @click="emit('viewCommitDetails', props.repo, props.sha)"
        class="items-center bg-sky-500 text-white rounded-full p-2 hover:bg-[#1f1f1f] hover:cursor-pointer transition"
      >
        <ArrowUpRightIcon class="w-4 h-4"/>
      </button>
    </div>
  </div>
</template>
