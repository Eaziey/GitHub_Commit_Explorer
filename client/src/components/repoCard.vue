<script setup lang="ts">

interface Props {
  name: string
  description: string 
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'viewCommits', repoName: string): void
}>()


</script>

<template>
    <div 
      @click="emit('viewCommits', props.name)"
      class="relative flex flex-col my-2 border border-sky-300 bg-sky-300 rounded w-100 min-h-30 shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden hover:cursor-pointer">      
      <div class="pt-3 px-1">
        <h5 class="mb-2 text-blue-800 text-lg font-semibold">
          {{props.name}}
        </h5>
      </div>

      <div class="px-4">
        <p class="text-white leading-normal font-light text-sm">
          {{ props.description || 'No description available.' }}
        </p>
      </div>
      
    </div>
</template>