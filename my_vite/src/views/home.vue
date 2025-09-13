<template>
  <div class="g-show">
    <main class="main-container">
      <div class="g-contain">
        <gchange></gchange>
      </div>
      <div class="g-enter">
        <gplay></gplay>
      </div>
    </main>
  </div>
  
</template>

<script setup lang="ts">
import gchange from '@/components/gchange.vue';
import gplay from '@/components/gplay.vue';
</script>

<style scoped>
.main-container {
  width: 80%;
  max-width: 1200px;
  height: 70%;
  background-color: var(--light-text-color);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
}

.g-contain, .g-enter {
  width: 48%;
  height: 90%;
}
</style>
