<template>
    <form class="w-full h-full bg-transparent rounded px-8 pt-6 pb-8 text-white flex flex-col justify-center items-center border border-red-500">
        <div class="xl:w-30 xl:h-30 lg:h-50 h-80">
          <img :src="logo" alt="Logo" class="object-cover w-full h-full"/>
        </div>
        <div class="w-full lg:w-[80%] xl:p-0 md:p-15">
          <div id="header" class="mb-5 text-center w-full">
            <p class="text-sky-500 leading-normal font-light">
               Please enter your username to access your repositories
            </p>
          </div>

          <div class="mb-10 w-full">
              <input 
                class="shadow rounded-lg w-full py-2 xl:py-3 md:py-4 px-4 border-2 border-sky-500 bg-gray-50 text-[#074b60] focus:outline-sky-100 focus:shadow-outline " 
                id="username" 
                type="text" 
                placeholder="Username"
                v-model="username"
              >

              <div class="h-2 py-2 ">
                  <p v-show="username" :class="['text-red-500 text-sm', isValidUsername ? 'invisible' : '']">
                    Invalid username. Only letters, numbers, and single hyphens allowed. No leading/trailing or consecutive hyphens.
                  </p>
              </div>

          </div>

          <div class="flex items-center justify-center">
              <button 
                  @click.prevent="handleSubmit" 
                  :class="[
                      'border-2 border-sky-500 bg-sky-500 hover:border-white hover:bg-transparent hover:cursor-pointer text-white font-semibold py-2 xl:py-3 md:py-4 px-4 rounded-lg w-full',
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
import logo from "../assets/images/logo_black_bg.jpg"

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