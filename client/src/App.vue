<script setup lang="ts">
import Navbar from './components/navbar.vue';

</script>

<template>
  <Navbar v-if="$route.meta.showNavbar"s />
  <RouterView/>
</template>

