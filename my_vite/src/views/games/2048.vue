<template>
  <div class="g-show">
    <div class="g-2048">
      <div class="discribe">
        欢迎来到2048游戏！使用wasd或者↑↓←→键控制方向
      </div>
      <div class="score-board">
        <div>得分: {{ score }}</div>
        <button @click="initGame">新游戏</button>
        <div>最高分: {{ highScore }}</div>
      </div>
      <div class="game-board">
        <div 
          v-for="(row, i) in board" 
          :key="i" 
          class="grid-row"
        >
          <div
            v-for="(cell, j) in row"
            :key="j"
            class="grid-cell"
            :class="`cell-${cell}`"
          >
            <div class="number" :class="{ 'cell-merged': cell === 0 }">
              {{ cell || '' }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="gameOver" class="game-over">
        游戏结束！<button @click="initGame">再试一次</button>
      </div>
    </div>
  </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useKeyboardListener } from '@/composables/useKeyboardListener';
  import { useRouter } from 'vue-router';
  
  type Direction = 'up' | 'down' | 'left' | 'right';
  
  const router = useRouter();
  const board = reactive<number[][]>([]);
  const score = ref(0);
  const highScore = ref(0);
  const gameOver = ref(false);
  
  const goHome = () => {
    router.push('/');
    
  };
  
  // 初始化游戏
  const initGame = () => {
    // 重置棋盘
    board.splice(0, board.length, ...Array(4).fill(0).map(() => Array(4).fill(0)));
    score.value = 0;
    gameOver.value = false;
    
    // 生成两个初始数字
    addNewNumber();
    addNewNumber();
  };
  
  // 添加新数字（90%概率生成2，10%生成4）
  const addNewNumber = () => {
    const emptyCells: [number, number][] = [];
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) emptyCells.push([i, j]);
      });
    });
  
    if (emptyCells.length > 0) {
      const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  };
  
  // 移动算法核心
  const move = (direction: Direction) => {
    let moved = false;
    const newBoard = JSON.parse(JSON.stringify(board));
  
    const rotate = (matrix: number[][]) => {
      return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
    };
  
    // 统一转换为左移处理
    let tempBoard = [...newBoard];
    switch (direction) {
      case 'up': tempBoard = rotate(rotate(rotate(tempBoard))); break;
      case 'down': tempBoard = rotate(tempBoard); break;
      case 'right': tempBoard = tempBoard.map(row => [...row].reverse()); break;
    }
  
    // 合并逻辑
    tempBoard.forEach(row => {
      let newRow = row.filter((cell:number) => cell !== 0);
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          score.value += newRow[i];
          newRow.splice(i + 1, 1);
          moved = true;
        }
      }
      while (newRow.length < 4) newRow.push(0);
      if (row.toString() !== newRow.toString()) moved = true;
      row.splice(0, 4, ...newRow);
    });
  
    // 转换回原方向
    switch (direction) {
      case 'up': tempBoard = rotate(tempBoard); break;
      case 'down': tempBoard = rotate(rotate(rotate(tempBoard))); break;
      case 'right': tempBoard = tempBoard.map(row => [...row].reverse()); break;
    }
  
    // 更新棋盘
    if (moved) {
      tempBoard.forEach((row, i) => {
        row.forEach((cell: number, j: number) => {
          board[i][j] = cell;
        });
      });
      addNewNumber();
      checkGameOver();
    }
  };
  
  // 检查游戏结束
  const checkGameOver = () => {
    const hasEmpty = board.some(row => row.includes(0));
    if (hasEmpty) return;
  
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if ((j < 3 && board[i][j] === board[i][j + 1]) ||
            (i < 3 && board[i][j] === board[i + 1][j])) {
          return;
        }
      }
    }
    gameOver.value = true;
    if (score.value > highScore.value) {
      highScore.value = score.value;
    }
  };
  
  // 键盘事件处理
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      goHome();
      return;
    }
    if (gameOver.value) return;
    
    const keyMap: { [key: string]: Direction } = {
      'ArrowUp': 'up',
      'w': 'up',
      'ArrowDown': 'down',
      's': 'down',
      'ArrowLeft': 'left',
      'a': 'left',
      'ArrowRight': 'right',
      'd': 'right'
    };
  
    const direction = keyMap[e.key];
    if (direction) {
      e.preventDefault();
      move(direction);
    }
  };
  
  // 生命周期钩子
  useKeyboardListener(handleKeydown);
  
  onMounted(() => {
    initGame();
  });
  </script>
  
  <style scoped>
  .g-2048 {
    width: 70%;
    max-width: 500px;
    background-color: var(--board-bg-color);
    padding: 20px;
    border-radius: 10px;
  }
  
  .discribe {
    text-align: center;
    margin-bottom: 20px;
    color: #776e65;
    font-size: 18px;
  }
  
  .score-board {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    color: var(--dark-text-color);
    font-weight: bold;
  }
  
  .game-board {
    background-color: var(--board-bg-color);
    padding: 10px;
    border-radius: var(--border-radius);
  }
  
  .grid-row {
    display: flex;
    margin-bottom: 10px;
  }
  
  .grid-cell {
    width: 25%;
    height: 80px;
    margin-right: 10px;
    background-color: rgba(238, 228, 218, 0.35);
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 35px;
    font-weight: bold;
    color: var(--dark-text-color);
  }
  
  .grid-cell:last-child {
    margin-right: 0;
  }
  
  .number {
    transition: all 0.15s ease;
  }
  
  /* 不同数字的颜色样式 */
  .cell-2 { background-color: #eee4da; }
  .cell-4 { background-color: #ede0c8; }
  .cell-8 { background-color: #f2b179; color: #f9f6f2; }
  .cell-16 { background-color: #f59563; color: #f9f6f2; }
  .cell-32 { background-color: #f67c5f; color: #f9f6f2; }
  .cell-64 { background-color: #f65e3b; color: #f9f6f2; }
  .cell-128 { background-color: #edcf72; font-size: 30px; }
  .cell-256 { background-color: #edcc61; font-size: 30px; }
  .cell-512 { background-color: #edc850; font-size: 30px; }
  .cell-1024 { background-color: #edc53f; font-size: 25px; }
  .cell-2048 { background-color: #edc22e; font-size: 25px; }
  
  .game-over {
    position: absolute;
    background: rgba(238, 228, 218, 0.73);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 24px;
    color: var(--dark-text-color);
    border-radius: 10px;
  }
  
  button {
    /* Now inherits from main.css */
    margin: 10px;
  }
  </style>
  