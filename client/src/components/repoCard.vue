<script setup lang="ts">
import { FolderIcon } from '@heroicons/vue/24/outline';
import { onMounted, ref } from 'vue';

interface Props {
  name: string
  description: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'viewCommits', repoName: string): void
}>()

const repoLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    repoLoading.value = false
  }, 2000)
})
</script>

<template>
    <div 
      @click="emit('viewCommits', props.name)"
      class="relative p-6 bg-[#1f1f1f] rounded-xl w-75 lg:w-80 h-45 transition-transform duration-300 overflow-hidden hover:cursor-pointer hover:scale-102">

      <div class=" px-1">
        <template v-if="repoLoading">
          <div class="h-5 w-7 bg-gray-700/40 rounded animate-pulse"></div>
          <div class="h-4 w-1/2 bg-gray-700/40 rounded animate-pulse mt-2"></div>
          <div class="space-y-2 mt-4 w-full">
            <div class="h-4 w-full bg-gray-700/40 rounded animate-pulse"></div>
            <div class="h-4 w-5/6 bg-gray-700/40 rounded animate-pulse"></div>
          </div>
        </template>
        <template v-else>
          <FolderIcon class="w-7 h-7 text-sky-500"/>
          <h5 class="mb-2 text-white text-lg font-semibold">
            {{props.name}}
          </h5>
          <p class="text-gray-100 leading-normal line-clamp-3 font-light text-sm">
            {{ props.description || 'No description available.' }}
          </p>
        </template>
      </div>
      
    </div>
</template>