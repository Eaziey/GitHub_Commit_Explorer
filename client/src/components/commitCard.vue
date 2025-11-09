<script setup lang="ts">
import { useGithubStore } from '../store/github';


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
    <div class="flex flex-col rounded w-60 h-80 break-all">
        <div class="min-h-4/5 rounded border shadow-lg bg-white">
            <div id="header" class="flex mb-1 p-2">
                <div class="w-2/3 flex justify-start items-center pl-4">
                    <h1 class="text-blue-800 text-sm font-semibold wrap-break-words">{{ props.repo }}</h1>
                </div>
                <div class="flex justify-end w-1/3">
                    <button 
                        class="bg-red-300 rounded p-2 w-10 text-red-500"
                        v-if="isFavourite(props.sha)"
                        @click="emit('removeFromFavourites')"
                    >
                        @
                    </button>
                    <button 
                        class="bg-gray-100 rounded p-2 w-10 text-gray-500"
                        v-else
                        @click="emit('addToFavourite')"
                    >
                        @
                    </button>
                </div>
                
            </div>
            <div class="flex flex-wrap flex-col justify-center h-full px-3">
                 <div class="h-2/3 overflow-auto">
                    <h1 class="italic wrap-break-words mb-5">{{ props.name }}</h1>
                    <p class="text-gray-800 dark:text-gray-200 text-sm font-semibold mb-2 overflow-hidden text-ellipsis break-all">
                        {{ props.message }} 
                    </p>
                 </div>
                <div class="h-1/3">
                    <p class="text-gray-800 dark:text-gray-200 font-light text-sm mb-2 break-all">
                        {{ formattedDate }}
                    </p>
                </div>
            </div>
            
        </div>
        <div class="h-1/5 flex flex-col justify-center items-center">
            <button 
                @click="emit('viewCommitDetails',props.repo, props.sha)"
                class="border bg-sky-500 w-20 rounded p-2"
                
            >
                details
            </button>
        </div>
    </div>
</template>