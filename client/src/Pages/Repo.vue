<template>
    <div class=" text-[#074b60] w-full pt-16">

      <div v-if="githubStore.loading" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="px-6 py-4 rounded shadow-lg text-lg font-semibold bg-blue-100 text-blue-800">
          Loading...
        </div>
      </div>

      <div v-if="githubStore.error" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="px-6 py-4 rounded shadow-lg text-lg bg-red-100 text-red-800 font-semibold">
          {{ githubStore.error }}
        </div>
      </div>

      <div v-if="!githubStore.loading && !githubStore.error" class="flex flex-col text-center justify-center py-10 bg-sky-200">
        <div class="px-30">
          <h1 class="mb-2  text-2xl font-bold">Your Repos</h1>
          <div class="flex flex-wrap gap-3 w-full justify-center px-5">
            <div v-for="repo in githubStore.repositories" :key="repo.id">
              <RepoCard :name="repo.name" :description="repo.description" @viewCommits="handleViewCommits" />
            </div>
          </div> 
        </div> 
      </div>
      
      <div class="flex flex-col text-center py-5 bg-gray-50">
        <div class="relative flex justify-center mt-5 items-center px-30">

          <div class="flex gap-6 mx-auto bg-white shadow-md px-5 py-2 rounded">
            <button
              @click="activeTab = 'commits'"
              :class="[
                'px-4 py-2 font-semibold rounded hover:cursor-pointer w-40',
                activeTab === 'commits' ? 'bg-sky-500 hover:bg-sky-700 text-white' : 'bg-gray-50 hover:bg-gray-200 dark:text-white'
              ]"
            >
              Commits
            </button>
            <button
              @click="activeTab = 'favourites'"
              :class="[
                'px-4 py-2 font-semibold rounded hover:cursor-pointer w-40',
                activeTab === 'favourites' ? 'bg-sky-500 hover:bg-sky-700 text-white' : 'bg-gray-50 hover:bg-gray-200 dark:bg-gray-700 dark:text-white'
              ]"
            >
              Favourites
            </button>
          </div>

          <div class="absolute right-30">
            <select v-model="sortOrder" class="border rounded px-4 py-2 bg-gray-50 text-[#074b60]">
              <option value="latest" class="rounded px-3 py-2 bg-gray-50">Latest First</option>
              <option value="oldest" class="rounded px-3 py-2 bg-gray-50">Oldest First</option>
            </select>
          </div>
        </div>

        <!--Commits section-->
        <div v-if="activeTab === 'commits'" class="text-center flex flex-col justify-center mt-5 px-30">
          <div v-if="githubStore.commits.length" class=" bg-gray-50 py-7 px-5 rounded-lg shadow-inner">
    
            <div class="flex flex-wrap gap-3 w-full justify-center">
              <div v-for="commit in sortedCommits" :key="commit.sha" class="">
                <CommitCard 
                  :message="commit.commit.message" 
                  :name="commit.commit.author.name" 
                  :date="commit.commit.author.date"
                  :sha="commit.sha"
                  :repo="commit.repo_Name"
                  @viewCommitDetails="fetchCommitDetails"
                  @addToFavourite="githubStore.addFavourite(commit)"
                  @removeFromFavourites = "githubStore.removeFavourite(commit.sha)"
                />
              </div>
            </div>
            <!--pagination-->
            <div class="mt-6 flex justify-center gap-2" v-if="activeTab === 'commits' && githubStore.commits.length">
              <!-- First Page -->
              <button
                @click="fetchCommitsForPage(1)"
                class="px-3 py-1 rounded font-semibold bg-gray-300 text-black"
                v-if="currentPage > 3"
              >
                1
              </button>
            
              <!-- Ellipsis before -->
              <span v-if="currentPage > 4">...</span>
            
              <!-- Visible Pages -->
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="fetchCommitsForPage(page)"
                :class="[
                  'px-3 py-1 rounded font-semibold',
                  currentPage === page ? 'bg-sky-500 text-white' : 'bg-gray-300 text-black'
                ]"
              >
                {{ page }}
              </button>
            
              <!-- Ellipsis after -->
              <span v-if="currentPage < githubStore.totalPages - 3">...</span>
            
              <!-- Last Page -->
              <button
                @click="fetchCommitsForPage(githubStore.totalPages)"
                class="px-3 py-1 rounded font-semibold bg-gray-300 text-black"
                v-if="currentPage < githubStore.totalPages - 2"
              >
                {{ githubStore.totalPages }}
              </button>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg shadow-inner">
            <!-- Icon -->
            <CodeBracketIcon class="w-16 h-16 text-sky-400 mb-4" />
        
            <h2 class="text-xl font-bold text-gray-700">No commits for you here</h2>
            <p class="text-gray-500 mt-2">Please click on a repository to view commits.</p>
          
          </div>
        </div>
          <!--Favourites section-->
        <div v-if="activeTab === 'favourites'" class="text-center flex flex-col justify-center mt-5 px-30">
          <div v-if="githubStore.favourites.length" class=" bg-gray-50 py-7 px-5 rounded-lg shadow-inner">
    
            <div class="flex flex-wrap gap-3 w-full justify-center px-5">
              <div v-for="commit in sortedCommits" :key="commit.sha" class="">
                <CommitCard 
                  :message="commit.commit.message" 
                  :name="commit.commit.author.name" 
                  :date="commit.commit.author.date"
                  :sha="commit.sha"
                  :repo="commit.repo_Name"
                  @viewCommitDetails="fetchCommitDetails"
                  @addToFavourite="githubStore.addFavourite(commit)"
                  @removeFromFavourites = "githubStore.removeFavourite(commit.sha)"
                />
              </div>
              
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg shadow-inner">
                <div class="bg-red-50 text-red-500 rounded-full p-2 mb-2">
                  <HeartIcon class="w-14 h-14" />
                </div>
               
                <h2 class="text-xl font-bold text-gray-700">No favourites yet</h2>
                <p class="text-gray-500 mt-2">Add commits to your favourites to see them here.</p>
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
import CommitCard from '../components/commitCard.vue';

import { ref, computed } from 'vue'
import { CodeBracketIcon, HeartIcon } from '@heroicons/vue/24/outline';



const selectedRepoName = ref<string>("")
const activeTab = ref<'commits' | 'favourites'>('commits')
const sortOrder = ref<'latest' | 'oldest'> ('latest')

const currentPage = ref(1)


//check for the amount of visible page numbers on pagination
const visiblePages = computed(() => {
  const start = Math.max(currentPage.value - 2, 1);
  const end = Math.min(currentPage.value + 2, githubStore.totalPages);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});



const route = useRoute()
const githubStore = useGithubStore()

//sorting commits on date
const sortedCommits = computed(() => {
  const commits = activeTab.value === "commits" ? githubStore.commits : githubStore.favourites;

  return [...commits].sort((a,b) => {
    const dateA = new Date(a.commit.author.date).getTime();
    const dateB = new Date(b.commit.author.date).getTime();

    return sortOrder.value === 'latest'? dateB - dateA : dateA - dateB;
  })
})


onMounted(() => {
  const username = route.params.username as string;
  githubStore.fetchRepositories(username);
})


async function handleViewCommits(repoName: string) {
  const username = route.params.username as string;
  selectedRepoName.value = repoName;
  githubStore.commits = [];
  currentPage.value = 1;

  githubStore.totalPages = await githubStore.getTotalCommitPages(username, repoName);
  githubStore.fetchCommits(username, repoName, currentPage.value);
}

function fetchCommitsForPage(page: number) {
  const username = route.params.username as string;
  currentPage.value = page;
  githubStore.commits = [];
  githubStore.fetchCommits(username, selectedRepoName.value!, page);
}

function fetchCommitDetails(repo: string, sha: string){ 

    if(!repo || !sha ){
        console.error(`Error: repo or sha cannot be null or empty`)
    }
  
    githubStore.fetchCommitDetails(repo, sha)
  
  
}


</script>

<style>
</style>