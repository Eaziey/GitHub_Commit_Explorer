<template>
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-[40%] h-[40%]">
        <div id="header" class="mb-5 text-center">
            <h5 class="mb-2 text-slate-800 text-xl font-semibold">
                WELCOME TO GITHUB COMMIT EXPLORER
            </h5>
             <p class="text-slate-600 leading-normal font-light">
                Please enter your username to access your repositories
             </p>
        </div>

        <div class="mb-10">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                Username
            </label>
            <input 
              class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-sky-100 focus:shadow-outline" 
              id="username" 
              type="text" 
              placeholder="Username"
              v-model="username"
            >
            
            <p v-if="username && !isValidUsername" class="text-red-500 text-sm mt-2">
                Invalid username. Only letters, numbers, and single hyphens allowed. No leading/trailing or consecutive hyphens.
            </p>

        </div>
        
        <div class="flex items-center justify-center">
            <button 
                @click.prevent="handleSubmit" 
                class="bg-sky-500 hover:bg-sky-300 hover:cursor-pointer text-white font-semibold py-2 px-4 rounded w-full disabled:bg-gray-300 disabled:cursor-not-allowed" 
                type="button"
                :disabled="!isValidUsername"
            >
                Fetch
        </button>
            
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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