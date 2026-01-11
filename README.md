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
👉 [View Live App](https://eaziey.github.io/GitHub_Commit_Explorer/)

---

## ✨ Features
- 🔍 **Search GitHub Users** – Enter a username and fetch all public repositories for any github user
- 📜 **View Commits** – Browse commits for any public repository
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

## 📸 Quick View
- Home Page
<h3 style="color:#0ea5e9;">Home Page</h3>
<img src="client/src/assets/images/HomePage.png" style="width: 50%"/>
-Landing Page
<h3 align="center" style="color:#0ea5e9;">Landing Page</h3>
<img src="client/src/assets/images/LandingPage.png" style="width: 50%"/>
- Repo Section
<h3 align="center" style="color:#0ea5e9;">Repo Section</h3>
<img src="client/src/assets/images/Repos.png" style="width: 50%"/>
- Commits section
<h3 align="center" style="color:#0ea5e9;">Commits section</h3>
  <img src="client/src/assets/images/commits.png" style="width: 50%"/>
-Favourites section
<h3 align="center" style="color:#0ea5e9;">Favourites section</h3>
<img src="client/src/assets/images/Favourites.png" style="width: 50%"/>
-View commit modal
<h3 align="center" style="color:#0ea5e9;">View commit details modal</h3>
<img src="client/src/assets/images/viewCommit.png" style="width: 50%"/>
-Commit Details
<h3 align="center" style="color:#0ea5e9;">Commit differences</h3>
<img src="client/src/assets/images/commitDetails.png" style="width: 50%"/>

---

## 📦 Installation & Setup
```bash
# Clone the repo
git clone https://github.com/Eaziey/GitHub_Commit_Explorer.git

# Navigate to project folder
cd GitHub_Commit_Explorer/client

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Building for Production
npm run build
