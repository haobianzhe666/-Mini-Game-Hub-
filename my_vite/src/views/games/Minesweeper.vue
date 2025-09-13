<template>
  <div class="minesweeper-container">
    <div class="header">
      <div class="flags">Flags: {{ flagsLeft }}</div>
      <div class="timer">Time: {{ timer }}</div>
    </div>
    <div class="grid-container">
      <div v-for="(row, y) in grid" :key="y" class="row">
        <div
          v-for="(cell, x) in row"
          :key="x"
          class="cell"
          :class="getCellClass(cell)"
          @click="onCellClick(cell)"
          @contextmenu.prevent="onCellRightClick(cell)"
        >
          <span v-if="cell.isRevealed && !cell.isMine && cell.adjacentMines > 0">
            {{ cell.adjacentMines }}
          </span>
          <span v-if="cell.isFlagged">🚩</span>
          <span v-if="cell.isRevealed && cell.isMine">💣</span>
        </div>
      </div>
    </div>
    <div v-if="isGameOver" class="game-over-message">
      <h2>{{ gameResultMessage }}</h2>
      <button @click="resetGame">Play Again</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useKeyboardListener } from '@/composables/useKeyboardListener';

const router = useRouter();
const GRID_SIZE = 10;

const goHome = () => {
  router.push('/');
};

useKeyboardListener((e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    goHome();
  }
});
const MINE_COUNT = 15;

const grid = ref<any[]>([]);
const isGameOver = ref(false);
const gameResultMessage = ref('');
const timer = ref(0);
const flagsLeft = ref(MINE_COUNT);
let timerInterval: any;

const getCellClass = (cell: any) => {
  if (cell.isRevealed) {
    return cell.isMine ? 'mine' : 'revealed';
  }
  return 'hidden';
};

const createGrid = () => {
  const newGrid = Array.from({ length: GRID_SIZE }, (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x) => ({
      x,
      y,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );

  let minesPlaced = 0;
  while (minesPlaced < MINE_COUNT) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (!newGrid[y][x].isMine) {
      newGrid[y][x].isMine = true;
      minesPlaced++;
    }
  }

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!newGrid[y][x].isMine) {
        let adjacentMines = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newY = y + i;
            const newX = x + j;
            if (
              newY >= 0 &&
              newY < GRID_SIZE &&
              newX >= 0 &&
              newX < GRID_SIZE &&
              newGrid[newY][newX].isMine
            ) {
              adjacentMines++;
            }
          }
        }
        newGrid[y][x].adjacentMines = adjacentMines;
      }
    }
  }

  return newGrid;
};

const onCellClick = (cell: any) => {
  if (isGameOver.value || cell.isFlagged || cell.isRevealed) return;

  if (cell.isMine) {
    gameOver(false);
    return;
  }

  revealCell(cell);
  checkWinCondition();
};

const onCellRightClick = (cell: any) => {
  if (isGameOver.value || cell.isRevealed) return;

  if (cell.isFlagged) {
    cell.isFlagged = false;
    flagsLeft.value++;
  } else if (flagsLeft.value > 0) {
    cell.isFlagged = true;
    flagsLeft.value--;
  }
};

const revealCell = (cell: any) => {
  if (cell.isRevealed) return;
  cell.isRevealed = true;

  if (cell.adjacentMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newY = cell.y + i;
        const newX = cell.x + j;
        if (
          newY >= 0 &&
          newY < GRID_SIZE &&
          newX >= 0 &&
          newX < GRID_SIZE
        ) {
          revealCell(grid.value[newY][newX]);
        }
      }
    }
  }
};

const gameOver = (isWin: boolean) => {
  isGameOver.value = true;
  gameResultMessage.value = isWin ? 'You Win!' : 'Game Over';
  clearInterval(timerInterval);

  grid.value.forEach(row => {
    row.forEach((cell: any) => {
      if (cell.isMine) {
        cell.isRevealed = true;
      }
    });
  });
};

const checkWinCondition = () => {
  const revealedCount = grid.value.flat().filter(cell => cell.isRevealed).length;
  if (revealedCount === GRID_SIZE * GRID_SIZE - MINE_COUNT) {
    gameOver(true);
  }
};

const resetGame = () => {
  grid.value = createGrid();
  isGameOver.value = false;
  gameResultMessage.value = '';
  timer.value = 0;
  flagsLeft.value = MINE_COUNT;
  startTimer();
};

const startTimer = () => {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer.value++;
  }, 1000);
};

onMounted(() => {
  resetGame();
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<style scoped>
.minesweeper-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 320px;
  margin-bottom: 10px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(10, 32px);
  grid-template-rows: repeat(10, 32px);
  border: 2px solid #ccc;
}

.cell {
  width: 32px;
  height: 32px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
}

.hidden {
  background-color: #ddd;
}

.revealed {
  background-color: #fff;
}

.mine {
  background-color: red;
}

.game-over-message {
  margin-top: 20px;
  text-align: center;
}
</style>