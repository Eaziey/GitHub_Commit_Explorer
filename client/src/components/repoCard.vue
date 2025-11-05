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
    <div class="relative flex flex-col my-6 border border-[#fafbfc] bg-sky-[#24292e] shadow-sm rounded-lg w-72 min-h-60">      
      <div class="mx-3 mb-0 border-b border-sky-300 pt-3 pb-2 px-1">
        <h5 class="mb-2 text-sky-300 text-xl font-semibold">
          {{props.name}}
        </h5>
      </div>

      <div class="p-4 min-h-40">
        
        <p class="text-white leading-normal font-light">
          {{ props.description || 'No description available.' }}
        </p>
      </div>
      <div class="mx-3 border-t border-sky-300 pb-3 pt-2 px-1">
        <button 
            type="button"
            @click="emit('viewCommits', props.name)"
            class="bg-sky-400 hover:bg-sky-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline" 
        >
            Commits
        </button>
      </div>
    </div>
</template>