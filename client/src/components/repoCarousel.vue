<template>

<div v-if="githubStore.repositories.length > 0" class="lg:px-40 md:px-10 px-0 relative">
  
  <div class="py-2 flex items-center justify-between">
      <h2 class="lg:text-2xl text-sm text-gray-100 font-semibold lg:pl-4">{{ githubStore.currentUsername }}'s Repos</h2>

      <div class="flex items-center gap-2 pr-4">
        <!-- Prev -->
        <button
          ref="prevRepos"
          class="icon-btn rounded-full w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
          type="button"
          aria-label="Previous"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>

        <button
          ref="nextRepos"
          class="icon-btn rounded-full w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
          type="button"
          aria-label="Next"
        >
          <ArrowRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="pt-2">
    <Swiper
        :modules="[Navigation, Pagination]"
        :slides-per-view="3.6"
        :space-between="2"
        :centered-slides="false" 
        :navigation="{ prevEl: prevRepos, nextEl: nextRepos }"
        :pagination="{ type: 'progressbar' }"
        :breakpoints="{
          320:  { slidesPerView: 1.2},
          375:  { slidesPerView: 1.35},
          412: {slidesPerView: 1.5},
          540: {slidesPerView: 2},
          768:  { slidesPerView: 2.1},
          820: {slidesPerView: 2.25},
          912: {slidesPerView: 2.5},
          1024: { slidesPerView: 2},
          1280: { slidesPerView: 2.8},
          1440: { slidesPerView: 3.4},
          1536: { slidesPerView: 4.4},
          1920: { slidesPerView: 5.5 },
          2560: { slidesPerView: 6 },
        }"
        :keyboard="{ enabled: true }"
        :mousewheel="{ forceToAxis: true }"
        class=""
    >
        <SwiperSlide v-for="repo in githubStore.repositories" :key="repo.id">
          <div class="w-full h-full py-2">
            <RepoCard
              :name="repo.name"
              :description="repo.description"
              @viewCommits='handleViewCommits'
            />
          </div>
        </SwiperSlide>
        
    </Swiper>
    </div>
</div>
<div v-else class="lg:px-40 md:px-10 px-0 relative">
  <div class="py-2">
    <h2 class="lg:text-2xl text-sm text-gray-100 font-semibold lg:pl-4 lg:mb-6 md:mb-2 mb-1">
      {{ githubStore.currentUsername }}'s Repos
    </h2>
    <div class="flex flex-col items-center justify-center text-center py-10">
      <FolderIcon class="md:w-16 md:h-16 w-10 h-10 text-sky-400 mb-4" />
      <h2 class="md:text-xl text-lg font-bold text-white">
        No repositories found
      </h2>
      <p class="text-gray-100 mt-2 md:text-base text-sm">
        Check that this GitHub profile has repositories to explore.
      </p>
    </div>
  </div>
</div>

</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useGithubStore } from '../store/github';
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'

import { ArrowLeftIcon, ArrowRightIcon, FolderIcon } from '@heroicons/vue/24/outline';

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import RepoCard from '../components/repoCard.vue';

const githubStore = useGithubStore()

const emit = defineEmits<{
  (e: 'viewCommits', repoName: string): void
}>()

const handleViewCommits = (repoName: string) => {
  emit('viewCommits', repoName)
}


const prevRepos = ref<HTMLButtonElement | null>(null)
const nextRepos = ref<HTMLButtonElement | null>(null)

</script>


<style scoped>
.icon-btn {
  background: rgba(255,255,255,0.92);
  display: grid;
  place-items: center;
  border: 1px solid rgba(17,24,39,0.06);  
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  transition: all .2s ease;
}

.icon-btn:hover {
  background: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
}

.icon-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(2,132,199,0.35); 
}

.icon-btn:disabled {
  opacity: .35;
  cursor: not-allowed;
  box-shadow: none;
}



:deep(.swiper-pagination) {
  position: static;
  
}

:deep(.swiper-pagination-progressbar) {
  height: 4px;
  width: min(600px, 90%);
  margin: 20px auto;               
  background: #1f1f1f;
  border-radius: 1rem;
}

:deep(.swiper-pagination-progressbar .swiper-pagination-progressbar-fill){
  background: var(--color-sky-500);
  border-radius: 2rem;
}

</style>
