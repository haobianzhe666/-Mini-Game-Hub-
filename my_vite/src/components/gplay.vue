<template>
  <div class="g-show">
    <div class="g-bimg" :style="{ backgroundImage: `url(${selectedGame?.big_img_url || ''})` }"></div>
    <div class="g-info">
      <h2 class="g-name">{{ selectedGame?.name }}</h2>
    </div>
    <div class="g-bottom">
      <button @click="route_to_game">
        开始游戏
      </button>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usegamedataStore } from '@/stores'
import { storeToRefs } from 'pinia';

const router = useRouter()
const gamedataStore = usegamedataStore()
const {data}=storeToRefs(gamedataStore)

// 从 store 中响应式地获取选中的游戏
const { selectedGame} = storeToRefs(gamedataStore)
console.log(selectedGame.value)
let ishover = ref(false)

const toggleHover = () => {
  ishover.value = !ishover.value
}

function route_to_game() {
  // 使用 store 中的 selectedGame 的路径
  if (selectedGame.value) {
    router.push(`/games${selectedGame.value.path}`)
    selectedGame.value=gamedataStore.allGames[0]

  }
}
</script>


<style scoped>
.g-show {
  width: 100%;
  height: 100%;
  background-color: #333;
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  box-shadow: inset 0 0 15px rgba(0,0,0,0.5);
}

.g-bimg {
  width: 100%;
  height: 60%;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  transition: background-image 0.5s ease-in-out;
}

.g-info {
  text-align: center;
  color: white;
}

.g-name {
  font-size: 2em;
  font-weight: bold;
  margin: 10px 0;
}

.g-bottom {
  width: 100%;
  display: flex;
  justify-content: center;
}

button {
  width: 80%;
  padding: 15px;
  font-size: 1.2em;
  background-color: var(--primary-color);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(0);
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
</style>