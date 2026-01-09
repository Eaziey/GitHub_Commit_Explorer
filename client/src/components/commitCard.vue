<script setup lang="ts">
import { useGithubStore } from '../store/github';
import { HeartIcon as HeartSolid, ArrowUpRightIcon, CodeBracketIcon } from '@heroicons/vue/24/solid'
import {HeartIcon as HeartOutline} from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue';

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

const commitLoading = ref(true);

const date = new Date(props.date)
const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
const githubStore = useGithubStore()

function isFavourite(sha: string): boolean {
  return githubStore.favourites.some(fav => fav.sha === sha)
}

onMounted(() => {
  setTimeout(() => {
    commitLoading.value = false
  }, 2000)
})
</script>

<template>
  <div 
    class="bg-[#0f0f0f] flex flex-col xl2:w-67 xl:w-71 lg:w-76 md2:w-108 md:w-89 sm2:w-95 xs2:w-61 w-full lg:h-72 md2:h-100 md:h-86 sm2:h-89 sm:h-77 xs2:h-63 h-68 rounded-sm transition-transform duration-300 hover:scale-102 md:p-2 p-1"
  >
    <div class="rounded-sm md:h-full md:px-4 flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <CodeBracketIcon class="md:w-6 md:h-6 w-5 h-5 text-sky-500" />
        
        <template v-if="commitLoading">
          <div class="md:h-8 md:w-8 h-4 w-4 rounded-full bg-gray-700/40 animate-pulse"></div>
        </template>

        <template v-else>
          <button
            v-if="isFavourite(props.sha)"
            @click="emit('removeFromFavourites')"
            class=" text-red-500 rounded-full p-2 hover:cursor-pointer transition"
          >
            <HeartSolid class="md:w-5 md:h-5 w-4 h-4" />
          </button>
          <button
            v-else
            @click="emit('addToFavourite')"
            class=" text-gray-200 p-2 hover:text-red-500 items-center rounded-full hover:cursor-pointer transition"
          >
            <HeartOutline class="md:w-5 md:h-5 w-4 h-4" />
          </button>
        </template>
        
      </div>

      <div class="flex-1 flex flex-col sm:text-left md:text-center md:mt-7 mt-1">
        
        <template v-if="commitLoading">
          <div class="md:h-5 h-3 w-3/4 bg-gray-700/40 rounded animate-pulse mt-2"></div>
          <div class="md:h-4 h-2 w-1/2 bg-gray-700/40 rounded animate-pulse md:mb-2 mb-0.5 mt-2"></div>
          <div class="space-y-2 md:mt-4 mt-2 w-full">
            <div class="md:h-4 h-2 w-full bg-gray-700/40 rounded animate-pulse"></div>
            <div class="md:h-4 h-2 w-5/6 bg-gray-700/40 rounded animate-pulse"></div>
          </div>
        </template>

        
        <template v-else>
          <h5 class="lg:text-lg md:text-base text-xs text-white font-semibold truncate">{{ props.repo }}</h5>
          <h2 class="md:text-sm text-xs text-sky-600 font-medium md:mb-2 mb-0.5">{{ props.name }}</h2>
          <p class="text-white md:text-sm text-xs line-clamp-2 md:mt-4 mt-2">{{ props.message }}</p>
        </template>

      </div>
    </div>

    <!-- Footer -->
    <div class="mt-auto flex justify-between items-center md:px-4 md:py-2 px-1 py-1 ">

      <template v-if="commitLoading">
        <div class="md:h-3 md:w-24 h-2 w-5/6 bg-gray-700/40 rounded animate-pulse"></div>
        <div class="md:h-8 md:w-8 h-4 w-4 rounded-full bg-gray-700/40 animate-pulse"></div>
      </template>
      <template v-else>
        <p class="text-gray-100 text-xs">{{ formattedDate }}</p>
        <button @click="emit('viewCommitDetails', props.repo, props.sha)" class="bg-sky-500 text-white rounded-full md:p-2 p-1 hover:cursor-pointer">
          <ArrowUpRightIcon class="md:w-4 md:h-4 w-3 h-3" />
        </button>
      </template>

    </div>
  </div>
</template>
