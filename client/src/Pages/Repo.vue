<template>
    <div class="bg-[#2b3137] text-white min-h-screen py-20">
      <div class="text-center flex justify-center items-center">
        <div v-if="githubStore.loading">Loading...</div>
        <div v-if="githubStore.error">{{ githubStore.error }}</div>
      </div>

        <div v-if="!githubStore.loading && !githubStore.error" class="text-center flex justify-center">
      
            <div class="container">
              <h1 class="mb-4 text-white text-4xl font-bold">Hi {{username}}</h1>
              <div class="container p-5 mt-6">
                <h1 class="mb-2 text-white text-2xl font-bold">Your Repos</h1>

                <div class="flex flex-wrap gap-4">
                  <div v-for="repo in githubStore.repositories" :key="repo.id">
                    <RepoCard :name="repo.name" :description="repo.description" @viewCommits="handleViewCommits" />
                  </div>
                </div>
              </div>
              
            </div>
        </div>
      
      <!--Reminder: Split commits section into smaller components-->
      <div v-if="githubStore.commits.length">
        <div class="flex justify-center gap-6 mt-10">
          <button
            @click="activeTab = 'commits'"
            :class="[
              'px-4 py-2 font-semibold rounded',
              activeTab === 'commits' ? 'bg-sky-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
            ]"
          >
            Commits
          </button>
          <button
            @click="activeTab = 'favourites'"
            :class="[
              'px-4 py-2 font-semibold rounded',
              activeTab === 'favourites' ? 'bg-sky-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
            ]"
          >
            Favourites
          </button>
        </div>


        <div 
          class="text-center flex justify-center mt-10"
        >
          <div class="container border border-sky-300 rounded-2xl py-5">
            <h1 class="mb-2 text-white text-2xl font-bold">
              {{ activeTab === 'commits' ? 'Commits' : 'Favourites' }}
            </h1>

            <ul class="space-y-4 px-20">
              <li v-for="commit in activeTab === 'commits' ? githubStore.commits : githubStore.favourites" :key="commit.sha" class="p-4 border border-sky-300 rounded-lg bg-sky-300">
                <p class="text-gray-800 dark:text-gray-200 font-medium mb-2">
                  {{ commit.commit.message }} — <span class="italic">{{ commit.commit.author.name }}</span>
                </p>

                <div class="flex flex-wrap gap-2 ">
                  <button 
                    @click="githubStore.fetchCommitDetails(username, selectedRepoName!, commit.sha)"
                    class="bg-sky-500 hover:bg-sky-400 text-white px-3 py-1 rounded text-sm"
                  >
                    View Details
                  </button>
                
                  <button 
                    @click="githubStore.addFavourite(commit)" 
                    v-if="!isFavourite(commit.sha)"
                    class="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded text-sm"
                    >Add to Favourites</button>

                  <button 
                    v-else
                    @click="githubStore.removeFavourite(commit.sha)"
                    class="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded text-sm"
                  >Remove</button>
                </div>

              </li>
            </ul>

          </div>
        </div>
      </div>

      <div v-if="githubStore.selectedCommit">
        <commitDetailModal :commit="githubStore.selectedCommit" @close="githubStore.selectedCommit = null" />
      </div>



        
    </div>
</template>

<script setup lang="ts">

import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useGithubStore } from '../store/github';

import RepoCard from '../components/repoCard.vue';
import commitDetailModal from '../components/commitDetailModal.vue';

import { ref } from 'vue'

const selectedRepoName = ref<string | null>(null)
const activeTab = ref<'commits' | 'favourites'>('commits')

defineProps<{ username: string }>();


const route = useRoute()
const githubStore = useGithubStore()


onMounted(() => {
  githubStore.reset()
  const username = route.params.username as string
  githubStore.fetchRepositories(username)
})

function handleViewCommits(repoName: string) {
  const username = route.params.username as string
  selectedRepoName.value = repoName
  githubStore.fetchCommits(username, repoName)
}


function isFavourite(sha: string): boolean {
  return githubStore.favourites.some(fav => fav.sha === sha)
}



</script>

<style>
</style>