import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/home.vue";
import hungry_snake from "@/views/games/hungry_snake.vue";
import _2048 from "@/views/games/2048.vue";
import Tower_of_Hanoi from '@/views/games/Tower_of_Hanoi.vue'
import russcia_block from "@/views/games/russcia_block.vue";
import Minesweeper from "@/views/games/Minesweeper.vue";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/games/hungry_snake',
      name: 'hungry_snake',
      component: hungry_snake
    },
    {
      path: '/games/2048',
      name: '2048',
      component: _2048
    },
    {
      path: '/games/TowerofHanoi',
      name: 'Tower of Hanoi',
      component: Tower_of_Hanoi
    },
    {
      path: '/games/russciablock',
      name: 'Russcia Block',
      component: russcia_block
    },
    {
      path: '/games/Minesweeper',
      name: 'Minesweeper',
      component: Minesweeper
    }
  ]
})
export default router;