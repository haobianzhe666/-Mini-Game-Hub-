import { defineStore } from "pinia";
import { ref, computed } from "vue";
import img2048 from "@/assets/2048.png";
import snake from "@/assets/snake.png";
import tower from "@/assets/tower.png";
import rusionblock from "@/assets/rusionblock.png";
import lei from "@/assets/lei.png";


// 定义游戏数据的类型
interface Game {
  id: number;
  big_img_url: string;
  img_url: string;
  name: string;
  path: string;
}

export const usegamedataStore = defineStore('gamedata', () => {
  // 所有游戏的数据
  const allGames = ref<Game[]>([
    { id: 1, big_img_url: img2048, img_url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtZ3JpZDN4My1pY29uIGx1Y2lkZS1ncmlkLTN4MyI+PHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSIzIiByeD0iMiIvPjxwYXRoIGQ9Ik0zIDloMTgiLz48cGF0aCBkPSJNMyAxNWgxOCIvPjxwYXRoIGQ9Ik05IDN2MTgiLz48cGF0aCBkPSJNMTUgM3YxOCIvPjwvc3ZnPg==', name: '2048', path: '/2048' },
    { id: 2, big_img_url: snake, img_url: 'https://img.icons8.com/?size=100&id=qQWxL5FgeL3L&format=png&color=000000', name: '贪吃蛇', path: '/hungry_snake' },
    { id: 3, big_img_url: tower, img_url: 'https://img.icons8.com/?size=100&id=VY24tukSwq9E&format=png&color=000000', name: '汉诺塔', path: '/TowerofHanoi' },
    { id: 4, big_img_url: rusionblock, img_url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtcGFja2FnZTItaWNvbiBsdWNpZGUtcGFja2FnZS0yIj48cGF0aCBkPSJNMTIgM3Y2Ii8+PHBhdGggZD0iTTE2Ljc2IDNhMiAyIDAgMCAxIDEuOCAxLjFsMi4yMyA0LjQ3OWEyIDIgMCAwIDEgLjIxLjg5MVYxOWEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY5LjQ3MmEyIDIgMCAwIDEgLjIxMS0uODk0TDUuNDUgNC4xQTIgMiAwIDAgMSA3LjI0IDN6Ii8+PHBhdGggZD0iTTMuMDU0IDkuMDEzaDE3Ljg5MyIvPjwvc3ZnPg==', name: '俄罗斯方块', path: '/russciablock' },
    { id: 5, big_img_url: lei, img_url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtbGFuZC1wbG90LWljb24gbHVjaWRlLWxhbmQtcGxvdCI+PHBhdGggZD0ibTEyIDggNi0zLTYtM3YxMCIvPjxwYXRoIGQ9Im04IDExLjk5LTUuNSAzLjE0YTEgMSAwIDAgMCAwIDEuNzRsOC41IDQuODZhMiAyIDAgMCAwIDIgMGw4LjUtNC44NmExIDEgMCAwIDAgMC0xLjc0TDE2IDEyIi8+PHBhdGggZD0ibTYuNDkgMTIuODUgMTEuMDIgNi4zIi8+PHBhdGggZD0iTTE3LjUxIDEyLjg1IDYuNSAxOS4xNSIvPjwvc3ZnPg==', name: '扫雷', path: '/Minesweeper' }
  ]);

  // 当前选中的游戏
  const selectedGame = ref<Game>(allGames.value[0]);

  // 更新选中游戏的 action
  function selectGame(game: Game) {
    selectedGame.value = game;
  }

  // 为了保持与旧代码的兼容性，我们继续暴露一个名为 data 的计算属性
  const data = computed(() => allGames.value);

  return {
    data,
    allGames,
    selectedGame,
    selectGame
  }
})

