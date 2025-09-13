<template>
  <div class="gchange">
    <el-carousel class="el-carousel__container" indicator-position='none' type="card" height="100%" @change="getchange" inertval="5000" :autoplay='false'>
      <el-carousel-item v-for="item in data" :key="item.id">
        <div class="item" >
          <div class="g-img" :style="{ backgroundImage: `url(${item.img_url})` }">
          </div>
          <div class="g-name">
            {{ item.name }}
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { ElCarousel } from 'element-plus';
import { usegamedataStore } from '@/stores'
import { storeToRefs } from 'pinia';

// 从 store 中获取数据和 actions
const gamedataStore = usegamedataStore()
const { data } = storeToRefs(gamedataStore)
const { selectGame } = gamedataStore

// 当轮播图切换时，调用 action 更新选中的游戏
function getchange(index: number) {
  selectGame(data.value[index]);
}
</script>

<style scoped>
.el-carousel__mask {
    background-color: var(--el-color-white) ;
    height: 100%;
    left: 0;
    opacity: .24;
    position: absolute;
    top: 0;
    transition: var(--el-transition-duration-fast);
    width: 100%;
}

.gchange {
  width: 100%;
  height: 100%;
}

.el-carousel {
  height: 100%;
}

.el-carousel__item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.item {
  width: 80%;
  height: 60%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.is-active .item {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.g-img {
  height: 65%;
  width: 100%;
  background-color: transparent; /* Placeholder color */
  background-size: cover;
  background-position: center;
}

.g-name {
  height: 25%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8em;
  text-align: center;
  color: #333;
  font-weight: bold;
}
</style>
