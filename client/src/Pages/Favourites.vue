<template>

    <div v-if="!githubStore.loading && !githubStore.error" class="flex flex-col text-center border px-30">
            
            <h1 class="mb-2  text-2xl font-bold">Your Favourites</h1>
            
            <div class="flex flex-wrap gap-3 w-full justify-start border border-orange-300 px-5">
                <div v-for="commit in githubStore.favourites" :key="commit.sha">
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
</template>

<script setup lang="ts">
import { useGithubStore } from '../store/github';
import CommitCard from '../components/commitCard.vue';

const githubStore = useGithubStore();

console.log(githubStore.favourites);

function fetchCommitDetails(repo: string, sha: string){ 

    if(!repo || !sha ){
        console.error(`Error: repo or sha cannot be null or empty`)
    }
  
    githubStore.fetchCommitDetails(repo, sha)
  
  
}
</script>