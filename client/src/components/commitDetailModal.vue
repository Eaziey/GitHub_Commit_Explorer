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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Commit } from '../interfaces/commit'

defineProps<{ commit: Commit }>()
defineEmits(['close'])
</script>