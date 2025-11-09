import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGithubStore } from '../store/github';
import axios from 'axios';
import router from '../router';

vi.mock('axios');
vi.mock('../router', () => ({
  default: {
    push: vi.fn()
  }
}));

describe('Github Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  //Initialization test
  it('initializes with default state', () => {
    const store = useGithubStore();
    expect(store.repositories).toEqual([]);
    expect(store.commits).toEqual([]);
    expect(store.selectedCommit).toBeNull();
    expect(store.error).toBeNull();
    expect(store.loading).toBe(false);
    expect(store.favourites).toEqual([]);
    expect(store.currentUsername).toBe('');
    expect(store.totalPages).toBe(1);
  });

  //fetchRepositories test
  describe('fetchRepositories', () => {
    it('fetches repositories successfully', async () => {
      const mockRepos = [
        {
          id: 1,
          name: 'repo1',
          full_name: 'test/repo1',
          html_url: 'https://github.com/test/repo1',
          description: 'A test repository',
          stargazers_count: 42,
          forks_count: 7
        }
      ];
    
      (axios.get as any).mockResolvedValue({ data: mockRepos });
    
      const store = useGithubStore();
      localStorage.setItem('favourites_test', JSON.stringify([{ sha: 'abc123' }]));
    
      await store.fetchRepositories('test');
    
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
      expect(store.repositories).toEqual(mockRepos);
      expect(store.currentUsername).toBe('test');
      expect(store.favourites).toEqual([{ sha: 'abc123' }]);
    });

    it('handles 403 error and navigates to forbidden page', async () => {
      const error403 = {
        response: { status: 403 },
        message: 'Rate limit exceeded'
      };
    
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);
      (axios.get as any).mockRejectedValue(error403);
    
      const store = useGithubStore();
      await store.fetchRepositories('test');
    
      expect(router.push).toHaveBeenCalledWith('/forbidden');
      //expect(store.error).toBe('403 Rate limit exceeded');
      expect(store.loading).toBe(false);
    });

    
    it('handles unexpected error gracefully', async () => {
      const unexpectedError = new Error('Network error');
    
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(false);
      (axios.get as any).mockRejectedValue(unexpectedError);
    
      const store = useGithubStore();
      await store.fetchRepositories('test');
    
      expect(store.error).toBe('Error fetching repositories.');
      expect(store.loading).toBe(false);
    });

  });

  describe('fetchCommits', () => {
    it('fetches commits successfully and maps repo name', async () => {
      const mockCommits = [
      {
        sha: 'abc123',
        repo_Name: 'testrepo',
        node_id: 'node123',
        commit: {
          author: {
            name: 'Letlhogonolo',
            email: 'letlhogonolo@example.com',
            date: '2023-01-01'
          },
          committer: {
            name: 'Letlhogonolo',
            email: 'letlhogonolo@example.com',
            date: '2023-01-01'
          },
          message: 'Initial commit',
          tree: {
            sha: 'tree123',
            url: 'https://api.github.com/tree/tree123'
          },
          url: 'https://api.github.com/commit/abc123',
          comment_count: 0,
          verification: {
            verified: true,
            reason: 'valid',
            signature: null,
            payload: null,
            verified_at: null
          }
        },
        author: {
          login: 'letlhogonolo',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
        committer: {
          login: 'letlhogonolo',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
        html_url: 'https://github.com/testuser/testrepo/commit/abc123',
        comments_url: 'https://api.github.com/comments/abc123',
        parents: [],
        stats: {
          total: 10,
          additions: 6,
          deletions: 4
        },
        files: [
          {
            filename: 'index.js',
            additions: 6,
            deletions: 4,
            changes: 10,
            status: 'modified',
            raw_url: 'https://github.com/raw/index.js',
            blob_url: 'https://github.com/blob/index.js',
            patch: 'patch content'
          }
        ]
      }];
    

      (axios.get as any).mockResolvedValue({ data: mockCommits });

      const store = useGithubStore();
      await store.fetchCommits('testuser', 'testrepo', 1);

      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
      expect(store.commits).toEqual([
        { ...mockCommits[0], repo_Name: 'testrepo' }
      ]);
    });

    it('handles 403 error and navigates to forbidden page', async () => {
      const error403 = {
        response: { status: 403 },
        message: 'Rate limit exceeded'
      };
    
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);
      (axios.get as any).mockRejectedValue(error403);
    
      const store = useGithubStore();
      await store.fetchCommits('testuser', 'testrepo', 1);
    
      expect(router.push).toHaveBeenCalledWith('/forbidden');
      //expect(store.error).toBe('403 Rate limit exceeded');
      expect(store.loading).toBe(false);
    });

    it('handles unexpected error gracefully', async () => {
      const unexpectedError = new Error('Network error');

      vi.spyOn(axios, 'isAxiosError').mockReturnValue(false);
      (axios.get as any).mockRejectedValue(unexpectedError);

      const store = useGithubStore();
      await store.fetchCommits('testuser', 'testrepo', 1);

      expect(store.error).toBe('Error fetching commits.');
      expect(store.loading).toBe(false);
    });

  });

  describe('fetchCommitDetails', () => {
    it('fetches commit details successfully', async () => {
      const mockCommitDetails = {
        sha: 'abc123',
        repo_Name: 'testrepo',
        node_id: 'node123',
        commit: {
          author: {
            name: 'Letlhogonolo',
            email: 'letlhogonolo@example.com',
            date: '2023-01-01'
          },
          committer: {
            name: 'Letlhogonolo',
            email: 'letlhogonolo@example.com',
            date: '2023-01-01'
          },
          message: 'Initial commit',
          tree: {
            sha: 'tree123',
            url: 'https://api.github.com/tree/tree123'
          },
          url: 'https://api.github.com/commit/abc123',
          comment_count: 0,
          verification: {
            verified: true,
            reason: 'valid',
            signature: null,
            payload: null,
            verified_at: null
          }
        },
        author: {
          login: 'letlhogonolo',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
        committer: {
          login: 'letlhogonolo',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
        html_url: 'https://github.com/testuser/testrepo/commit/abc123',
        comments_url: 'https://api.github.com/comments/abc123',
        parents: [],
        stats: {
          total: 10,
          additions: 6,
          deletions: 4
        },
        files: [
          {
            filename: 'index.js',
            additions: 6,
            deletions: 4,
            changes: 10,
            status: 'modified',
            raw_url: 'https://github.com/raw/index.js',
            blob_url: 'https://github.com/blob/index.js',
            patch: 'patch content'
          }
        ]
      };
    
      (axios.get as any).mockResolvedValue({ data: mockCommitDetails });
    
      const store = useGithubStore();
      store.currentUsername = 'testuser';
    
      await store.fetchCommitDetails('testrepo', 'abc123');
    
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
      expect(store.selectedCommit).toEqual(mockCommitDetails);
    });
  
    it('handles 403 error and navigates to forbidden page', async () => {
      const error403 = {
        response: { status: 403 },
        isAxiosError: true
      };

      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);
      (axios.get as any).mockRejectedValue(error403);

      const store = useGithubStore();
      store.currentUsername = 'testuser';
    
      await store.fetchCommitDetails('testrepo', 'abc123');

      expect(router.push).toHaveBeenCalledWith('/forbidden');
      //expect(store.error).toBe('Error fetching commit details.');
      expect(store.loading).toBe(false);
    });
  
    it('handles unexpected error gracefully', async () => {
      const unexpectedError = new Error('Network error');
    
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(false);
      (axios.get as any).mockRejectedValue(unexpectedError);
    
      const store = useGithubStore();
      store.currentUsername = 'testuser';
    
      await store.fetchCommitDetails('testrepo', 'abc123');
    
      expect(store.error).toBe('Error fetching commit details.');
      expect(store.loading).toBe(false);
    });
  });

  describe('reset', () => {
    it('resets the store to its initial state', () => {
      const store = useGithubStore();
      // dummy state
      store.repositories = [{ id: 1, name: 'repo1', full_name: '', html_url: '', description: '', stargazers_count: 0, forks_count: 0 }];
      store.commits = [{ sha: 'abc123', repo_Name: 'repo1', node_id: '', commit: { author: { name: '', email: '', date: '' }, committer: { name: '', email: '', date: '' }, message: '', tree: { sha: '', url: '' }, url: '', comment_count: 0, verification: { verified: false, reason: '', signature: null, payload: null, verified_at: null } }, author: null, committer: null, html_url: '', comments_url: '', parents: [] }];
      store.selectedCommit = { sha: 'abc123', repo_Name: 'repo1', node_id: '', commit: { author: { name: '', email: '', date: '' }, committer: { name: '', email: '', date: '' }, message: '', tree: { sha: '', url: '' }, url: '', comment_count: 0, verification: { verified: false, reason: '', signature: null, payload: null, verified_at: null } }, author: null, committer: null, html_url: '', comments_url: '', parents: [] };
      store.error = 'Some error';
      store.loading = true;
      store.favourites = [{ sha: 'abc123', repo_Name: 'repo1', node_id: '', commit: { author: { name: '', email: '', date: '' }, committer: { name: '', email: '', date: '' }, message: '', tree: { sha: '', url: '' }, url: '', comment_count: 0, verification: { verified: false, reason: '', signature: null, payload: null, verified_at: null } }, author: null, committer: null, html_url: '', comments_url: '', parents: [] }];
      store.currentUsername = 'testuser';

      // Call reset 
      store.reset();

      // Assert initial state
      expect(store.repositories).toEqual([]);
      expect(store.commits).toEqual([]);
      expect(store.selectedCommit).toBeNull();
      expect(store.error).toBeNull();
      expect(store.loading).toBe(false);
      expect(store.favourites).toEqual([]);
      expect(store.currentUsername).toBe('');
      expect(store.totalPages).toBe(1);
    });
  });

  describe('getTotalCommitPages', () => {
    let store: ReturnType<typeof useGithubStore>;

    beforeEach(() => {
      setActivePinia(createPinia());
      store = useGithubStore();
      store.error = null;
      vi.clearAllMocks();
    });

    it('returns correct number of pages when link header is present', async () => {
      (axios.get as any).mockResolvedValue({
        headers: {
          link: '<https://api.github.com/repos/test/repo/commits?per_page=1&page=25>; rel="last"'
        }
      });

      const pages = await store.getTotalCommitPages('test', 'repo');
      expect(pages).toBe(3); 
    });

    it('returns 1 when link header is missing', async () => {
      (axios.get as any).mockResolvedValue({
        headers: {}
      });

      const pages = await store.getTotalCommitPages('test', 'repo');
      expect(pages).toBe(1);
    });

    it('handles 403 error and navigates to forbidden page', async () => {
      const error403 = {
        response: { status: 403 },
        isAxiosError: true
      };

      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);
      (axios.get as any).mockRejectedValue(error403);

      const pages = await store.getTotalCommitPages('test', 'repo');
      expect(router.push).toHaveBeenCalledWith('/forbidden');
      expect(pages).toBe(1);
    });

    it('handles non-axios errors', async () => {
      const unexpectedError = new Error('Network error');

      vi.spyOn(axios, 'isAxiosError').mockReturnValue(false);
      (axios.get as any).mockRejectedValue(unexpectedError);

      const pages = await store.getTotalCommitPages('test', 'repo');
      expect(store.error).toContain('Network error');
      expect(pages).toBe(1);
    });
  });

  describe('addFavourite', () => {
    let store: ReturnType<typeof useGithubStore>;

    const mockCommit = {
      sha: 'abc123',
      repo_Name: 'repo1',
      node_id: '',
      commit: {
        author: { name: '', email: '', date: '' },
        committer: { name: '', email: '', date: '' },
        message: '',
        tree: { sha: '', url: '' },
        url: '',
        comment_count: 0,
        verification: {
          verified: false,
          reason: '',
          signature: null,
          payload: null,
          verified_at: null
        }
      },
      author: null,
      committer: null,
      html_url: '',
      comments_url: '',
      parents: []
    };

    beforeEach(() => {
      setActivePinia(createPinia());
      store = useGithubStore();
      store.currentUsername = 'testuser';
      vi.spyOn(store, 'saveFavourites').mockImplementation(() => {});
    });

    it('adds a new favourite commit if not already present', () => {
      store.addFavourite(mockCommit);
      expect(store.favourites).toEqual(expect.arrayContaining([mockCommit]));
      expect(store.saveFavourites).toHaveBeenCalledWith('testuser');
    });

    it('does not add duplicate favourites', () => {
      store.favourites = [mockCommit];
      store.addFavourite(mockCommit);
      expect(store.favourites.length).toBe(1);
      expect(store.saveFavourites).not.toHaveBeenCalled(); // no need to save again
    });
  });

  describe('removeFavourite', () => {
    let store: ReturnType<typeof useGithubStore>;

    const mockCommit = {
      sha: 'abc123',
      repo_Name: 'repo1',
      node_id: '',
      commit: {
        author: { name: '', email: '', date: '' },
        committer: { name: '', email: '', date: '' },
        message: '',
        tree: { sha: '', url: '' },
        url: '',
        comment_count: 0,
        verification: {
          verified: false,
          reason: '',
          signature: null,
          payload: null,
          verified_at: null
        }
      },
      author: null,
      committer: null,
      html_url: '',
      comments_url: '',
      parents: []
    };

    beforeEach(() => {
      setActivePinia(createPinia());
      store = useGithubStore();
      store.currentUsername = 'testuser';
      store.favourites = [mockCommit];
      vi.spyOn(store, 'saveFavourites').mockImplementation(() => {});
    });

    it('removes a favourite by sha', () => {
      store.removeFavourite('abc123');
      expect(store.favourites).toEqual([]);
      expect(store.saveFavourites).toHaveBeenCalledWith('testuser');
    });

    it('does nothing if sha is not found', () => {
      store.removeFavourite('nonexistent-sha');
      expect(store.favourites).toEqual([mockCommit]);
      expect(store.saveFavourites).toHaveBeenCalledWith('testuser');
    });
  });
  
  describe('saveFavourites', () => {
    let store: ReturnType<typeof useGithubStore>;

    const mockCommit = {
      sha: 'abc123',
      repo_Name: 'repo1',
      node_id: '',
      commit: {
        author: { name: '', email: '', date: '' },
        committer: { name: '', email: '', date: '' },
        message: '',
        tree: { sha: '', url: '' },
        url: '',
        comment_count: 0,
        verification: {
          verified: false,
          reason: '',
          signature: null,
          payload: null,
          verified_at: null
        }
      },
      author: null,
      committer: null,
      html_url: '',
      comments_url: '',
      parents: []
    };

    beforeEach(() => {
      setActivePinia(createPinia());
      store = useGithubStore();
      localStorage.clear();
    });

    it('saves favourites to localStorage under the correct key', () => {
      store.favourites = [mockCommit];
      store.saveFavourites('testuser');

      const saved = localStorage.getItem('favourites_testuser');
      expect(saved).not.toBeNull();
      expect(JSON.parse(saved!)).toEqual([mockCommit]);
    });
  });

  describe('loadFavourites', () => {
    let store: ReturnType<typeof useGithubStore>;

    const mockCommit = {
      sha: 'abc123',
      repo_Name: 'repo1',
      node_id: '',
      commit: {
        author: { name: '', email: '', date: '' },
        committer: { name: '', email: '', date: '' },
        message: '',
        tree: { sha: '', url: '' },
        url: '',
        comment_count: 0,
        verification: {
          verified: false,
          reason: '',
          signature: null,
          payload: null,
          verified_at: null
        }
      },
      author: null,
      committer: null,
      html_url: '',
      comments_url: '',
      parents: []
    };

    beforeEach(() => {
      setActivePinia(createPinia());
      store = useGithubStore();
      localStorage.clear();
    });

    it('loads favourites from localStorage if data exists', () => {
      localStorage.setItem('favourites_testuser', JSON.stringify([mockCommit]));
      store.loadFavourites('testuser');
      expect(store.favourites).toEqual([mockCommit]);
    });

    it('sets favourites to empty array if no data exists', () => {
      store.loadFavourites('unknownuser');
      expect(store.favourites).toEqual([]);
    });
  });

  describe('handleError', () => {
    let store: ReturnType<typeof useGithubStore>;

    beforeEach(() => {
      setActivePinia(createPinia());
      store = useGithubStore();
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.clearAllMocks();
    });

    it('redirects to /forbidden on 403 Axios error', () => {
      const error403 = {
        response: { status: 403 },
        message: 'Rate limit exceeded'
      };

      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);
      store.handleError('commits', error403);

      expect(router.push).toHaveBeenCalledWith('/forbidden');
    });

    it('sets error message for other Axios errors', () => {
      const error404 = {
        response: { status: 404 },
        message: 'Not Found'
      };

      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);
      store.handleError('repositories', error404);

      expect(store.error).toBe('404 Not Found');
    });

    it('sets generic error message for non-Axios errors', () => {
      const unexpectedError = new Error('Something went wrong');

      vi.spyOn(axios, 'isAxiosError').mockReturnValue(false);
      store.handleError('details', unexpectedError);

      expect(store.error).toBe('Error fetching details.');
    });
  });

});

