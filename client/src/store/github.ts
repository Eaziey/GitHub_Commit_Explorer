import {defineStore} from 'pinia'
import type { Repository } from '../interfaces/repository';
import type { Commit } from '../interfaces/commit';
import axios from 'axios';
import router from '../router';

export const useGithubStore = defineStore('github', {
  state: () => ({
    repositories: [] as Repository[],
    loading: false,
    error: null as string | null,
    commits: [] as Commit[],
    selectedCommit: null as Commit | null,
    favourites: [] as Commit[],
    currentUsername: '',
    totalPages: 1
  }),

  actions: {

    async fetchRepositories(username: string) {
      this.loading = true
      this.error = null
      //store current Users username for future use
      this.currentUsername = username;

      /*
        Get users favourites from localstorage. 
        To make sure if you switch a user and come back you will still have the currentUsers favourites
      */
      this.loadFavourites(username);
  
      try {

        const response = await axios.get<Repository[]>(`https://api.github.com/users/${username}/repos`)
        this.repositories = response.data

      } catch (error) {
        console.log(error);
        this.handleError("repositories", error);

      } finally {
        this.loading = false
      }
    },
    async fetchCommits(username: string, repo:string, page: number = 1 ){
      this.loading = true
      this.error = null

      try{

        //Api call with per_page and page params for pagination
        const response = await axios.get<Commit[]>(`https://api.github.com/repos/${username}/${repo}/commits`, {
          params: {
            per_page: 8,
            page: page
          }
        });

        //map each commit to it's repo
        const commitsWithRepo = response.data.map(commit => ({
          ...commit,
          repo_Name: repo
        }));

        //combine previous commits with new page commits
        this.commits = [...this.commits, ...commitsWithRepo];
        
      }
      catch(error){
        if(axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            router.push('/forbidden');
          } else {
            console.error('Axios error while fetching commits:', error.message);
            this.error = error.response?.status + error.message || "Error fetching commits."
          }
        } else {
          console.error('An unexpected error occurred while fetching commits', error);
          this.error =`Error fetching commits.`;
        }
      }
      finally {
        this.loading = false
      }
      
    },
    async fetchCommitDetails(repo: string | null, sha: string) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get(`https://api.github.com/repos/${this.currentUsername}/${repo}/commits/${sha}`)
        
        this.selectedCommit = response.data

      } catch (error) {
        
        this.handleError("commit details", error);
        
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
      this.currentUsername = ''

    },
    
    async getTotalCommitPages(username: string, repo: string): Promise<number> {
      try {
        // Make an API request to GitHub to get commits for the repo.
        // This is a trick to get the pagination info from the response headers.
        const response = await axios.get(`https://api.github.com/repos/${username}/${repo}/commits`, {
          params: {
            per_page: 1,
            page: 1
          }
        });
      
        //Get link header
        const linkHeader = response.headers['link'];
        if (!linkHeader) return 1;
        
        // Get the last page number from the link header using regex.(1 commit = 1 page)
        const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
        const totalCommits = match ? parseInt(match[1], 8) : 1;

        // Divide total commits by 10 commits per page to get the number of pages
        return Math.ceil(totalCommits / 8);
      } catch (error) {

        if(axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            router.push('/forbidden');
          } else {
            console.error('Axios error while fetching total commit pages:', error.message);
            this.error = error.response?.status + error.message || "Error fetching total commit pages"
          }
        } else {
          console.error('Error fetching total commit pages:', error);
          this.error =`Error fetching total commit pages: ${error}`;
        }

        return 1;
      }
    },
    addFavourite(commit: Commit) {
      if (!this.favourites.find(fav => fav.sha === commit.sha)) {
        this.favourites.push(commit)
        this.saveFavourites(this.currentUsername);
      }
    },
    removeFavourite(sha: string) {

      this.favourites = this.favourites.filter(fav => fav.sha !== sha)
      this.saveFavourites(this.currentUsername);
    },

    saveFavourites(username:string) {
      localStorage.setItem(`favourites_${username}`, JSON.stringify(this.favourites));
    },

    loadFavourites(username: string) {
      
      const data = localStorage.getItem(`favourites_${username}`);
      this.favourites = data ? JSON.parse(data) : [];
    }, 

    handleError(name:string, error: any){

      //check if error is an AxiosError and handle ir
        if(axios.isAxiosError(error)) {
          //Take to 403 forbidden page if Rate Limit reached
          if (error.response?.status === 403) {
            router.push('/forbidden');
          } else {
            console.error(`Axios error while fetching ${name}:`, error.message);
            
            this.error = axios.isAxiosError(error)
              ? `${error.response?.status ?? ''} ${error.message}`
              : `Error fetching ${name}.`;

            //this.error = error.response?.status + error.message || `Error fetching ${name}.`
          }
        } else {
          console.error('Unexpected error:', error);
          this.error =`Error fetching ${name}.`;
        }
    }




    
  }
})


