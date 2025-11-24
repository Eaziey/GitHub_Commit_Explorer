<script setup lang="ts">
import { FolderIcon } from '@heroicons/vue/24/outline';

interface Props {
  name: string
  description: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'viewCommits', repoName: string): void
}>()


</script>

<template>
    <div 
      @click="emit('viewCommits', props.name)"
      class="relative p-6 bg-[#1f1f1f] rounded-xl w-75 lg:w-80 h-45 transition-transform duration-300 overflow-hidden hover:cursor-pointer hover:scale-102">

      <div class=" px-1">
        <FolderIcon class="w-7 h-7 text-sky-500"/>
        <h5 class="mb-2 text-white text-lg font-semibold">
          {{props.name}}
        </h5>
        <p class="text-gray-100 leading-normal line-clamp-3 font-light text-sm">
          {{ props.description || 'No description available.' }}
        </p>
      </div>
      
    </div>
</template>