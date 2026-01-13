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
    class="bg-[#0f0f0f] xl3:w-86 xl2:w-67 xl:w-71 lg:w-75 md2:w-108 md:w-89 sm2:w-95 xs2:w-61 w-full
           lg:h-72 md2:h-100 md:h-86 sm2:h-89 sm:h-77 xs2:h-63 h-68
           rounded-sm flex flex-col transition-transform duration-300 hover:scale-102
           items-stretch group"
  >
    <!-- Header -->
    <div class="h-12 flex items-center justify-between px-3">
      <CodeBracketIcon class="md:w-10 md:h-10 w-10 h-10 text-sky-500" />

      <div class="flex items-center gap-2">
        <button
          v-if="isFavourite(props.sha)"
          @click="emit('removeFromFavourites')"
          class="text-red-500 rounded-full p-2 hover:cursor-pointer transition"
        >
          <HeartSolid class="w-7 h-10" />
        </button>
        <button
          v-else
          @click="emit('addToFavourite')"
          class="text-gray-200 p-2 hover:text-red-500 rounded-full hover:cursor-pointer transition"
        >
          <HeartOutline class="w-7 h-10" />
        </button>
      </div>
    </div>
    <!-- Body -->
    <div class="flex-1 min-h-0 px-3 py-2 overflow-hidden text-left">
      <template v-if="commitLoading">
        <div class="md:h-5 h-3 w-3/4 bg-gray-700/40 rounded animate-pulse mt-2"></div>
        <div class="md:h-4 h-2 w-1/2 bg-gray-700/40 rounded animate-pulse md:mb-2 mb-0.5 mt-2"></div>
        <div class="space-y-2 md:mt-4 mt-2 w-full">
          <div class="md:h-4 h-2 w-full bg-gray-700/40 rounded animate-pulse"></div>
          <div class="md:h-4 h-2 w-5/6 bg-gray-700/40 rounded animate-pulse"></div>
          <div class="md:h-4 h-2 w-5/6 bg-gray-700/40 rounded animate-pulse"></div>
        </div>
      </template>

      <template v-else>
        <h2 class="text-2xl text-white truncate" :title="props.repo">
          {{ props.repo }}
        </h2>
        <p class="mt-2 text-sm text-sky-500 dark:text-gray-300 line-clamp-1">
          {{ props.name }}
        </p>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
          {{ props.message }}
        </p>
        <p class="mt-2 text-gray-100 text-xs">
          {{ formattedDate }}
        </p>
      </template>
    </div>

    <!-- Footer -->
    <div class="h-14 flex items-center justify-start px-3 py-3">
      <template v-if="commitLoading">
        <div class="md:h-8 md:w-8 h-4 w-4 rounded-full bg-gray-700/40 animate-pulse"></div>
      </template>
      <template v-else>
        <button
          @click="emit('viewCommitDetails', props.repo, props.sha)"
          class="bg-sky-500 text-white rounded-full p-2 hover:cursor-pointer"
        >
          <ArrowUpRightIcon class="w-6 h-6" />
        </button>
      </template>
    </div>
  </div>
</template>
