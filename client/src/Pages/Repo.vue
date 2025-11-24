<template>
    <div class=" w-full pt-16 ">

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

      <!--Welcome Section-->
      <div v-if="!githubStore.loading && !githubStore.error" class="pt-4 px-50 flex items-center justify-between h-2/5 w-full">
        
        <div class="w-1/2 max-w-xl pt-10 pb-10">
          
          <h1 class="text-6xl font-extrabold bg-linear-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">
            Welcome to GitSplore
          </h1>

          <p class="text-xl leading-relaxed text-gray-300">
            Your personal GitHub explorer!  
          </p>

          <ul class="mt-10 text-lg space-y-4 text-white">
            <li><FolderIcon class="w-7 h-7 text-sky-500"/> <span class="font-semibold">Browse your repositories</span> in a sleek interface.</li>
            <li><CodeBracketIcon class="w-7 h-7 text-sky-500" /> <span class="font-semibold">Dive into commits</span> for any repo with ease.</li>
            <li><ClipboardDocumentIcon class="w-7 h-7 text-sky-500" /> <span class="font-semibold">Inspect commit details & files</span> like a pro.</li>
          </ul>

          <p class="mt-6 text-gray-400 italic">
            Ready to explore your code history? Let’s get started!
          </p>
        </div>

        <div class="flex justify-end items-center pt-10 pb-10 h-full w-1/2 ">
           <img :src="gitbranch" class="h-full w-full object-contain"/> 
        </div>
      </div>

      <!--Repo Carousel Section-->
      <div v-if="!githubStore.loading && !githubStore.error" class="py-10 h-3/5">
        <div class="px-6">
          <h1 class="mb-4 text-3xl font-bold text-center text-sky-500">Repositories</h1>
          <repoCarousel
            @viewCommits="handleViewCommits"
          />
        </div>
      </div>

      <!--Commit and Favouites Tabs-->
      <div class="flex flex-col text-center py-5 px-30 bg-[#1f1f1f]">
        <div class="relative flex justify-center mt-5 items-center">

          <div class="flex gap-6 mx-auto shadow-md px-5 py-2 rounded-lg bg-black">
            <button
              @click="activeTab = 'commits'"
              :class="[
                'px-4 py-2 font-semibold rounded-lg hover:cursor-pointer w-40',
                activeTab === 'commits' ? 'bg-sky-500 text-white' : 'hover:bg-[#1f1f1f] text-white'
              ]"
            >
              Commits
            </button>
            <button
              @click="activeTab = 'favourites'"
              :class="[
                'px-4 py-2 font-semibold rounded-lg hover:cursor-pointer w-40',
                activeTab === 'favourites' ? 'bg-sky-500 text-white' : 'hover:bg-[#1f1f1f] text-white'
              ]"
            >
              Favourites
            </button>
          </div>
          <!--Sort dropdown-->
          <div class="absolute inline-block right-20">
            <select v-model="sortOrder"
              class="appearance-none border border-gray-300 rounded-lg pl-4 pr-10 py-2 bg-gray-50 text-[#074b60] text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 hover:border-sky-400 transition">
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

        </div>

        <!--Commits section-->
        <div v-if="activeTab === 'commits'" ref="commitsSection" class="text-center flex flex-col justify-center mt-5 px-3 mb-10">
          <div v-if="githubStore.commits.length" class=" py-7 px-2 rounded-lg shadow-inner">
    
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
          <div v-else class="flex flex-col items-center justify-center py-16 rounded-lg shadow-inner">
            <!-- Icon -->
            <CodeBracketIcon class="w-16 h-16 text-sky-400 mb-4" />
        
            <h2 class="text-xl font-bold text-white">No commits for you here</h2>
            <p class="text-gray-100 mt-2">Please click on a repository to view commits.</p>
          
          </div>
        </div>
          <!--Favourites section-->
        <div v-if="activeTab === 'favourites'" class="text-center flex flex-col justify-center mt-5 px-3 mb-10">
          <div v-if="githubStore.favourites.length" class=" py-7 px-5 rounded-lg shadow-inner">
    
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
          <div v-else class="flex flex-col items-center justify-center py-16 rounded-lg shadow-inner px-3">
                <div class=" text-red-500 rounded-full p-2 mb-2">
                  <HeartIcon class="w-14 h-14" />
                </div>
               
                <h2 class="text-xl font-bold text-white">No favourites yet</h2>
                <p class="text-gray-100 mt-2">Add commits to your favourites to see them here.</p>
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

import commitDetailModal from '../components/commitDetailModal.vue';
import CommitCard from '../components/commitCard.vue';
import repoCarousel from '../components/repoCarousel.vue';

import { ref, computed, nextTick } from 'vue'
import { CodeBracketIcon, HeartIcon, FolderIcon, ClipboardDocumentIcon } from '@heroicons/vue/24/outline';

import gitbranch from "../assets/images/gitbranch2.png";


const route = useRoute()
const githubStore = useGithubStore()

const selectedRepoName = ref<string>("")
const activeTab = ref<'commits' | 'favourites'>('commits')
const sortOrder = ref<'latest' | 'oldest'> ('latest')
const currentPage = ref(1)
const commitsSection = ref<HTMLElement | null>(null);

//check for the amount of visible page numbers on pagination
const visiblePages = computed(() => {
  const start = Math.max(currentPage.value - 2, 1);
  const end = Math.min(currentPage.value + 2, githubStore.totalPages);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});


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

  activeTab.value = 'commits';

  //await nextTick(); //wait for it to load
  //scroll to commits section
  //scrollToEl(commitsSection.value, 96);

}


function scrollToEl(el: HTMLElement | null, offsetPx = 0) {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offsetPx;
  window.scrollTo({ top, behavior: 'smooth' });
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