
export interface Commit {
  sha: string
  node_id: string
  commit: {
    author: User
    committer: User
    message: string
    tree: {
      sha: string
      url: string
    }
    url: string
    comment_count: number
    verification: {
      verified: boolean
      reason: string
      signature: string | null
      payload: string | null
      verified_at: string | null
    }
  }
  author: UserType2 | null
  committer: UserType2 | null
  html_url: string
  comments_url: string
  parents: {
    sha: string
    url: string
    html_url: string
  }[]
  stats?: {
    total: number
    additions: number
    deletions: number
  }
  files?: {
    filename: string
    additions: number
    deletions: number
    changes: number
    status: string
    raw_url: string
    blob_url: string
    patch?: string
  }[]
}


export interface User {
  name: string
  email: string
  date: string
}

export interface UserType2 {
  login: string
  avatar_url: string
}



