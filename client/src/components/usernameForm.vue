<template>
    <form class="w-full h-full bg-transparent rounded px-8 pt-6 pb-8 mb-4 text-white flex flex-col justify-center items-center p-20">
        <div class="w-40 h-40">
            <img :src="logo" alt="Logo" class="object-cover w-full h-full"/>
        </div>
        <div class="w-[68%]">
        <div id="header" class="mb-5 text-center w-full">
            <h5 class="mb-2 text-white text-2xl font-semibold">
                WELCOME TO GITSPLORE
            </h5>
             <p class="text-gray-600 leading-normal font-light">
                Please enter your username to access your repositories
             </p>
        </div>

        <div class="mb-10 w-full">
            <label class="block text-white text-sm font-bold mb-2" for="username">
                Username
            </label>
            <input 
              class="shadow border-2 rounded w-full py-2 px-3 text-[#074b60] focus:outline-white focus:shadow-outline " 
              id="username" 
              type="text" 
              placeholder="Username"
              v-model="username"
            >

            <div class="h-6 py-2">
                <p v-show="username" :class="['text-red-500 text-sm', isValidUsername ? 'invisible' : '']">
                  Invalid username. Only letters, numbers, and single hyphens allowed. No leading/trailing or consecutive hyphens.
                </p>
            </div>

        </div>
        
        <div class="flex items-center justify-center">
            <button 
                @click.prevent="handleSubmit" 
                :class="[
                    'border-2 border-sky-500 bg-[#074b60] hover:border-white hover:bg-transparent hover:cursor-pointer text-white font-semibold py-2 px-4 rounded w-full',
                    !isValidUsername ? 'invisible' : ''
                  ]"
                type="button"
                :disabled="!isValidUsername"
            >
                Fetch
        </button>
            
        </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import logo from "../assets/images/logo_noBg.png"

const username = ref('')

const emit = defineEmits<{
  (e: 'submit', username: string): void
}>()


const isValidUsername = computed(() => {
  
    const value = username.value.trim()
    if (!value) return false
    
    const regex = /^(?!-)(?!.*--)[a-zA-Z0-9-]+(?<!-)$/

    return regex.test(value)
});

function handleSubmit() {
  if (isValidUsername.value) {
    emit('submit', username.value)
  }
}



</script>