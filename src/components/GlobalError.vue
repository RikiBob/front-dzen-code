<script setup>
import { globalError } from '@/utils/globalError.js'
</script>

<template>
  <div class="global-error" v-if="globalError.length">
    <ul>
      <li v-for="(err, index) in globalError" :key="index">
        {{ err }}
      </li>
    </ul>
    <button @click="globalError = []">✖</button>
  </div>
</template>

<style scoped>
.global-error {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: #ffe0e0;
  color: #b00020;
  padding: 12px 16px;
  border: 1px solid #b00020;
  border-radius: 6px;
  z-index: 9999;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
