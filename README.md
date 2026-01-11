# 🔍 GitSplore - GitHub Commit Explorer

![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-Store-F59E0B?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-Tests-6E9F18?logo=vitest&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI/CD-2088FF?logo=githubactions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A **Vue 3 + TypeScript** app to explore any public GitHub user’s repositories and commits.  
Search repos, view commit logs, drill into commit details (files changed, additions/deletions, diffs), mark commits as favourites, sort & paginate — with **Pinia**, **Vue Router**, **Vite**, and **Vitest**. Fully responsive and deployed via **GitHub Actions CI/CD**.

---

## 🚀 Live Demo
👉 [View Live App]((https://eaziey.github.io/GitHub_Commit_Explorer/))

---

## ✨ Features
- 🔍 **Search GitHub Users** – Enter a username and fetch all public repositories
- 📜 **View Commits** – Browse commits for any repository
- 📝 **Commit Details** – See files changed, additions, deletions, and diffs
- ⭐ **Favourites** – Mark commits as favourites and manage them easily
- 🔄 **Sorting** – Sort commits by newest or oldest
- 📑 **Pagination** – Load commits in batches for better performance
- ⚠️ **Error Handling** – Handles invalid usernames, empty repos, and API rate limits
- 📱 **Responsive Design** – Works seamlessly on desktop and mobile
- ✅ **CI/CD** – Automated build and deploy via GitHub Actions

---

## 🛠 Tech Stack
- **Frontend:** Vue 3, TypeScript, Vite
- **State Management:** Pinia
- **Routing:** Vue Router
- **Testing:** Vitest
- **API:** GitHub Open API
- **Deployment:** GitHub Actions

---

## 📸 Screenshots
*(Add screenshots here)*  
- Home Page  
- Repo Page  
- Commit Details  

---

## 📦 Installation & Setup
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/github_commit_explorer.git

# Navigate to project folder
cd github_commit_explorer

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test


How to get started:
1. Clone the Repository
    -git clone https://github.com/Eaziey/GitHub_Commit_Explorer.git
    -cd GitHub_Commit_Explorer

2. Install Dependencies
    -cd client
    -npm install

3. Run the Development Server
    -npm run dev

Running Tests
    -npm run test

Building for Production
    -npm run build
