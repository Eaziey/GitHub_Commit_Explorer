<template>
  <div class="px-4 pb-4 pt-16 bg-gray-100 h-screen">
    <h2 class="text-xl font-bold mb-4 mt-10">Differences for {{ filename }}</h2>
    <div class="bg-gray-900 text-white rounded p-4 overflow-auto max-h-[80vh]">
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