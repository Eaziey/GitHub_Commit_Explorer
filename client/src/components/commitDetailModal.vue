<template>
  <div class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white rounded shadow-xl w-full max-w-xl max-h-[80vh] flex flex-col relative">
      
      <!-- Header -->
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-800">Commit Details</h2>
        <button @click="$emit('close')" class="bg-gray-50 text-gray-500 rounded-full p-2 hover:bg-gray-100 hover:cursor-pointer transition">
          <XMarkIcon class="w-5 h-5"/>
        </button>
      </div>
    
      <div class="p-6 overflow-y-auto">
        <p class="mb-2"><strong>Message:</strong> {{ commit.commit.message || "No commit message" }}</p>
        <p class="mb-2"><strong>Author:</strong> {{ commit.commit.author.name }} ({{ commit.commit.author.email }})</p>
        <p class="mb-2"><strong>Date:</strong> {{ commit.commit.author.date }}</p>
        <p class="mb-2"><strong>Verified:</strong> {{ commit.commit.verification.verified ? 'Yes' : 'No' }}</p>

        <h3 class="text-lg font-semibold mb-3">Files</h3>
        <div v-if="commit.files && commit.files.length > 0">
          <p class="mb-4">{{ commit.files.length }} file(s) changed</p>

          <div v-for="file in commit.files" :key="file.filename" class="mb-4 border-b border-gray-100 pb-3">
            <h4 class="text-blue-600 font-medium">
              <a :href="file.blob_url" target="_blank" class="hover:underline">{{ file.filename }}</a>
              <span class="text-gray-500 text-sm">({{ file.status }})</span>
            </h4>
            
            <div class="flex flex-wrap gap-2 my-4">
                <div class="bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-medium">
                  Changes: {{ file.changes }}
                </div>
                <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-medium">
                  Additions: {{ file.additions }}
                </div>
                <div class="bg-red-100 text-red-800 px-3 py-1 rounded text-xs font-medium">
                  Deletions: {{ file.deletions }}
                </div>
            </div>

            
            <button
              @click="viewDiff(file)"
              class="bg-sky-500  hover:bg-sky-600 flex items-center gap-1 text-white font-semibold rounded py-2 px-4 hover:cursor-pointer shadow-md transition"
            >
              View Full Diff
              <ArrowRightIcon class="w-4 h-4" />
            </button>

          </div>
        </div>
        <div v-else>
          <p>No files changed</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Commit } from '../interfaces/commit'
import { useRouter } from 'vue-router';
import { XMarkIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

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