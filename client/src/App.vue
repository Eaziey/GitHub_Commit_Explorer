<script setup lang="ts">
import Navbar from './components/navbar.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

</script>

<template>
<Navbar v-if="$route.meta.showNavbar" />
  
<RouterView v-slot="{ Component }">
    <Transition :name="route.meta.transition || 'fade'" mode="out-in">
      <component :is="Component" />
    </Transition>
</RouterView>

</template>


<style scoped>

</style>


