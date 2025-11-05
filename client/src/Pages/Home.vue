<template>
    <div 
      class="h-screen flex justify-center items-center bg-[#2b3137]">
        <UsernameForm
          @submit="onSubmit"
        />
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import UsernameForm from '../components/usernameForm.vue';

    const router = useRouter();
  

    function onSubmit(username: string){
      router.push(`/repos/${username}`);
    }
</script>
   
<style>
</style>