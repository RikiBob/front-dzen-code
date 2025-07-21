<script setup>
import GlobalError from "@/components/GlobalError.vue";
import {globalError} from "@/utils/globalError.js";
</script>

<template>
  <div class="app">
    <RouterView />
  </div>

  <GlobalError v-if="globalError.length" />
</template>

<style scoped>
  .app {
    background-color: #ffffff;
  }
</style>
