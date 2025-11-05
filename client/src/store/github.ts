import {defineStore} from 'pinia'
import type { Repository } from '../interfaces/repository';
import type { Commit } from '../interfaces/commit';
import axios from 'axios';

export const useGithubStore = defineStore('github', {
  state: () => ({
    repositories: [] as Repository[],
    loading: false,
    error: null as string | null,
    commits: [] as Commit[],
    selectedCommit: null as Commit | null,
    favourites: [] as Commit[]
  }),

  actions: {
    async fetchRepositories(username: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get<Repository[]>(`https://api.github.com/users/${username}/repos`)
        this.repositories = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch repositories.'
      } finally {
        this.loading = false
      }
    },
    async fetchCommits(username: string, repo:string ){
      this.loading = true
      this.error = null
      this.commits = []
      try{
        const response = await axios.get<Commit[]>(`https://api.github.com/repos/${username}/${repo}/commits`)
        this.commits = response.data;
      }
      catch(err: any){
        this.error = err.response?.data?.message || 'Failed to fetch commits'
      }
      finally {
        this.loading = false
      }
      
    },
    async fetchCommitDetails(username: string, repo: string, sha: string) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get(`https://api.github.com/repos/${username}/${repo}/commits/${sha}`)
        this.selectedCommit = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch commit details.'
      } finally {
        this.loading = false
      }
    },
    reset() {
      this.repositories = []
      this.commits = []
      this.selectedCommit = null
      this.error = null
      this.loading = false
      this.favourites = []
    },

    addFavourite(commit: Commit) {

      if (!this.favourites.find(fav => fav.sha === commit.sha)) {
        this.favourites.push(commit)
      }
    },
    removeFavourite(sha: string) {

      this.favourites = this.favourites.filter(fav => fav.sha !== sha)
    }



    
  }
})


