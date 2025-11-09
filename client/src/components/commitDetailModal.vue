<!-- components/CommitModal.vue -->
<template>
  <div class="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative text-black">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        close
      </button>
      <h2 class="text-xl font-bold mb-4">Commit Details</h2>
      <p><strong>Message:</strong> {{ commit.commit.message || "heyy" }}</p>
      <p><strong>Author:</strong> {{ commit.commit.author.name }} ({{ commit.commit.author.email }})</p>
      <p><strong>Date:</strong> {{ commit.commit.author.date }}</p>
      <p><strong>Verified:</strong> {{ commit.commit.verification.verified ? 'Yes' : 'No' }}</p>
      <p><strong>SHA:</strong> {{ commit.sha }}</p>
      <h1>Files</h1>
      
      <div v-if="commit.files && commit.files.length > 0">
        <p>{{ commit.files?.length }} files changed</p>

        <div v-for="file in commit.files" :key="file.filename">
          <h4><a :href="file.blob_url" target="_blank">{{ file.filename }}</a> ({{ file.status }})</h4>
          <p>Changes:{{file.changes}}, Additions: {{ file.additions }}, Deletions: {{ file.deletions }}</p>
          <button @click="viewDiff(file)">View Full Diff</button>
        </div>
      
      </div>
      <div v-else>
        <p>No files changed</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Commit } from '../interfaces/commit'
import { useRouter } from 'vue-router';

defineProps<{ commit: Commit }>()
defineEmits(['close'])
const router = useRouter();

function viewDiff(file: { filename: string; patch?: string }) {
    if (!file.patch) {
      alert('No diff available for this file.');
      return;
    }
    router.push({
      name: 'DiffView',
      params: { filename: file.filename },
      query: { patch: file.patch }
    });
  }

</script>