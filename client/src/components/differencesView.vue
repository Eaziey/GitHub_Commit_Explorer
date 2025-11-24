<template>
  <div class="px-50 pb-4 pt-16 h-screen">
    <h1 class="my-15 text-3xl font-bold text-center text-sky-500">Differences for {{ filename }}</h1>
    <div class="bg-[#0f0f0f] border border-gray-500 text-white rounded-xl p-4 overflow-auto max-h-[70vh]">
      <pre class="whitespace-pre-wrap wrap-break-words">
        <div v-for="(line, index) in lines" :key="index" :class="getLineClass(line)">
          {{ line }}
        </div>
      </pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const filename = route.params.filename as string;
const patch = (route.query.patch as string) || '';

const lines = computed(() => patch.split('\n'));

function getLineClass(line: string): string {
  if (line.startsWith('+')) return 'text-green-400';
  if (line.startsWith('-')) return 'text-red-400';
  if (line.startsWith('@@')) return 'text-blue-400 font-bold';
  return '';
}
</script>

<style scoped>
pre div {
  font-family: monospace;
}
</style>