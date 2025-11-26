<template>

<div class="lg:px-40 relative">
  
<div class="py-4 flex items-center justify-between">
      <h2 class="text-2xl text-gray-100 font-semibold pl-4">{{ githubStore.currentUsername }}'s Repos</h2>

      <div class="flex items-center gap-2 pr-4">
        <!-- Prev -->
        <button
          ref="prevRepos"
          class="icon-btn rounded-full w-6 h-6 lg:w-10 lg:h-10"
          type="button"
          aria-label="Previous"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>

        <button
          ref="nextRepos"
          class="icon-btn rounded-full w-8 h-8 lg:w-10 lg:h-10"
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
          320:  { slidesPerView: 1.1 },
          640:  { slidesPerView: 1.2},
          768:  { slidesPerView: 1.5},
          1024: { slidesPerView: 2},
          1280: { slidesPerView: 2.7},
          1440: { slidesPerView: 3.5},
          1536: { slidesPerView: 4.5 },
          1920: { slidesPerView: 5.5 },
          2560: { slidesPerView: 6 },
        }"
        :keyboard="{ enabled: true }"
        :mousewheel="{ forceToAxis: true }"
        class=""
    >
        <SwiperSlide v-for="repo in githubStore.repositories" :key="repo.id">
          <div class="w-full h-full pl-4 py-2">
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

</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useGithubStore } from '../store/github';
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

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
