<template>
    <div class="bg-sky-200 text-[#074b60] w-full pt-16">
      
      <div class="bg-transparent text-center flex justify-center items-center">
        <div v-if="githubStore.loading">Loading...</div>
        <div v-if="githubStore.error">{{ githubStore.error }}</div>
      </div>

        <div v-if="!githubStore.loading && !githubStore.error" class="flex flex-col text-center px-30 py-10 bg-white">

            <h1 class="mb-2  text-2xl font-bold">Your Repos</h1>
                <div class="flex flex-wrap gap-3 w-full justify-start px-5">
                  <div v-for="repo in githubStore.repositories" :key="repo.id">
                    <RepoCard :name="repo.name" :description="repo.description" @viewCommits="handleViewCommits" />
                  </div>
                </div>
              
        </div>
      
      <!--Reminder: Split commits section into smaller components-->
      <div v-if="githubStore.commits.length" class="flex flex-col text-center px-30 ">

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

        <div class="text-center flex flex-col justify-center mt-5 ">
          <div class="container rounded-2xl py-5">
            

            <div class="flex justify-end py-4 px-40">
              <select v-model="sortOrder" class="border rounded px-4 py-2 bg-gray-50 text-[#074b60]">
                <option value="latest" class="rounded px-3 py-2 bg-gray-50">Latest First</option>
                <option value="oldest" class="rounded px-3 py-2 bg-gray-50">Oldest First</option>
              </select>
            </div>

            <div class="flex flex-wrap gap-3 w-full justify-start px-30">
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

const selectedRepoName = ref<string>("")
const activeTab = ref<'commits' | 'favourites'>('commits')
const sortOrder = ref<'latest' | 'oldest'> ('latest')

const currentPage = ref(1)



const visiblePages = computed(() => {
  const start = Math.max(currentPage.value - 2, 1);
  const end = Math.min(currentPage.value + 2, githubStore.totalPages);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});



const props = defineProps<{ username: string }>();


const route = useRoute()
const githubStore = useGithubStore()

console.log("r", githubStore.favourites);

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

function isFavourite(sha: string): boolean {
  return githubStore.favourites.some(fav => fav.sha === sha)
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