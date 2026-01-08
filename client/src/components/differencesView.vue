<template>
  <div class="lg:px-50 md:pb-4 md:pt-16 md:px-10 px-4 pt-10 h-screen w-full">
    <div class="flex justify-start items-center md:gap-6 gap-3 px-1">
      <button @click="goBack" class="text-white hover:text-gray-500">
        <ArrowUturnLeftIcon class="md:w-7 md:h-7 w-5 h-5 "/>
      </button>
      <h1 class="md:my-15 my-10 lg:text-3xl md:text-2xl text-base font-bold text-center text-sky-500">Differences for {{ filename }}</h1>
    </div>
    
    <div class="bg-[#0f0f0f] border border-gray-500 text-white rounded-xl md:p-4 p-2 overflow-auto max-h-[70vh]">
      <div class="whitespace-pre-wrap wrap-break-word font-mono">
        <div v-for="(line, index) in lines" :key="index" :class="[getLineClass(line), 'block text-left']">
          {{ line }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowUturnLeftIcon } from '@heroicons/vue/24/outline';
import { useGithubStore } from '../store/github';

const route = useRoute();
const filename = route.params.filename as string;
const patch = (route.query.patch as string) || '';
const router = useRouter();
const gitHubStore = useGithubStore();

const lines = computed(() => patch.split('\n'));

function getLineClass(line: string): string {
  if (line.startsWith('+')) return 'text-green-400';
  if (line.startsWith('-')) return 'text-red-400';
  if (line.startsWith('@@')) return 'text-blue-400 font-bold';
  return '';
}

function goBack(): void {
  router.push({
    name: 'Repo',
    params: { username: gitHubStore.currentUsername }
  });
}
</script>

<style scoped>
pre div {
  font-family: monospace;
}
</style>