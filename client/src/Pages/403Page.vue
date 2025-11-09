

<template>
  <div class="relative h-screen w-full bg-black flex items-center justify-center">
    
    <img 
      :src="forbiddenImg" 
      alt="403 Forbidden. Looks like you exceeded your request limit. Please try again in an hour" 
      class="object-cover w-full h-full"
    />

    <button 
      class="absolute bottom-20 w-50 cursor-pointer left-1/2 transform -translate-x-1/2 bg-[#074b60] hover:bg-transparent hover:border-2 hover:border-white text-white px-4 py-2 rounded shadow"
      @click="goHome"
    >
      Home
    </button>
  </div>
</template>



<script setup lang="ts">
    import forbiddenImg from "../assets/images/forbiddenImg.png"
    import router from "../router";

    function goHome(){
        router.push("/")
    }
</script>