<template>
  <div class="g-show">
    <div class="russciablock">
      <h1 class="title">俄罗斯方块</h1>
      <div class="game-container">
        <canvas ref="gameCanvas" :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT"></canvas>
        <div class="game-info">
          <div>得分: {{ score }}</div>
          <div>消除行数: {{ lines }}</div>
          <div>等级: {{ level }}</div>
          <div class="next-piece">
            <h3>下一个</h3>
            <canvas ref="nextCanvas" width="120" height="120"></canvas>
          </div>
          <button @click="startGame" v-if="!isPlaying">开始游戏</button>
          <div v-if="isGameOver" class="game-over-text">游戏结束!</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useKeyboardListener } from '@/composables/useKeyboardListener';
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

// --- 游戏常量 ---
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const CANVAS_WIDTH = COLS * BLOCK_SIZE;
const CANVAS_HEIGHT = ROWS * BLOCK_SIZE;

const COLORS = [
  null,
  '#FF0D72', // Z
  '#0DC2FF', // S
  '#0DFF72', // T
  '#F538FF', // O
  '#FF8E0D', // L
  '#FFE138', // J
  '#3877FF', // I
];

const SHAPES = [
  [],
  [[1, 1, 0], [0, 1, 1], [0, 0, 0]], // Z
  [[0, 2, 2], [2, 2, 0], [0, 0, 0]], // S
  [[0, 3, 0], [3, 3, 3], [0, 0, 0]], // T
  [[4, 4], [4, 4]],                   // O
  [[0, 0, 5], [5, 5, 5], [0, 0, 0]], // L
  [[6, 0, 0], [6, 6, 6], [0, 0, 0]], // J
  [[0, 0, 0, 0], [7, 7, 7, 7], [0, 0, 0, 0], [0, 0, 0, 0]], // I
];

// --- 响应式状态 ---
const gameCanvas = ref<HTMLCanvasElement | null>(null);
const nextCanvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const nextCtx = ref<CanvasRenderingContext2D | null>(null);

const board = ref<number[][]>([]);
const currentPiece = ref<any>(null);
const nextPiece = ref<any>(null);

const score = ref(0);
const lines = ref(0);
const level = ref(0);

const isPlaying = ref(false);
const isGameOver = ref(false);

let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000; // ms

// --- 游戏逻辑 ---

// 创建新棋盘
const createBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// 创建新方块
const createPiece = () => {
  const typeId = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
  const shape = SHAPES[typeId];
  return {
    x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
    y: 0,
    shape,
    color: COLORS[typeId],
    typeId,
  };
};

// 绘制
const draw = () => {
  if (!ctx.value) return;
  ctx.value.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawBoard();
  drawPiece(currentPiece.value, ctx.value);
};

const drawBoard = () => {
  if (!ctx.value) return;
  board.value.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        ctx.value!.fillStyle = COLORS[value] || '#000';
        ctx.value!.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    });
  });
};

const drawPiece = (piece: any, context: CanvasRenderingContext2D) => {
  if (!piece || !context) return;
  context.fillStyle = piece.color;
  piece.shape.forEach((row: number[], y: number) => {
    row.forEach((value: number, x: number) => {
      if (value > 0) {
        context.fillRect((piece.x + x) * BLOCK_SIZE, (piece.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    });
  });
};

const drawNextPiece = () => {
    if (!nextCtx.value || !nextPiece.value) return;
    const nextSize = nextPiece.value.shape.length;
    nextCtx.value.clearRect(0, 0, 120, 120);
    const offsetX = (120 - nextSize * BLOCK_SIZE) / 2;
    const offsetY = (120 - nextSize * BLOCK_SIZE) / 2;

    nextCtx.value.fillStyle = nextPiece.value.color;
    nextPiece.value.shape.forEach((row: number[], y: number) => {
        row.forEach((value: number, x: number) => {
            if (value > 0) {
                nextCtx.value!.fillRect(offsetX + x * BLOCK_SIZE, offsetY + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}


// 碰撞检测
const checkCollision = (piece: any, newX: number, newY: number) => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const boardX = newX + x;
        const boardY = newY + y;
        if (
          boardX < 0 ||
          boardX >= COLS ||
          boardY >= ROWS ||
          (board.value[boardY] && board.value[boardY][boardX] !== 0)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

// 固定方块
const solidifyPiece = () => {
  currentPiece.value.shape.forEach((row: number[], y: number) => {
    row.forEach((value: number, x: number) => {
      if (value > 0) {
        board.value[currentPiece.value.y + y][currentPiece.value.x + x] = currentPiece.value.typeId;
      }
    });
  });
};

// 消除行
const clearLines = () => {
  let linesCleared = 0;
  outer: for (let y = ROWS - 1; y >= 0; y--) {
    for (let x = 0; x < COLS; x++) {
      if (board.value[y][x] === 0) {
        continue outer;
      }
    }
    const row = board.value.splice(y, 1)[0].fill(0);
    board.value.unshift(row);
    y++;
    linesCleared++;
  }
  if (linesCleared > 0) {
    lines.value += linesCleared;
    score.value += linesCleared * 100 * linesCleared; // 得分加成
    level.value = Math.floor(lines.value / 10);
    dropInterval = 1000 - level.value * 50;
  }
};

// 方块下落
const pieceDrop = () => {
  if (checkCollision(currentPiece.value, currentPiece.value.x, currentPiece.value.y + 1)) {
    solidifyPiece();
    clearLines();
    currentPiece.value = nextPiece.value;
    nextPiece.value = createPiece();
    drawNextPiece();
    if (checkCollision(currentPiece.value, currentPiece.value.x, currentPiece.value.y)) {
      isGameOver.value = true;
      isPlaying.value = false;
    }
  } else {
    currentPiece.value.y++;
  }
};

// 移动
const pieceMove = (dir: number) => {
  if (!checkCollision(currentPiece.value, currentPiece.value.x + dir, currentPiece.value.y)) {
    currentPiece.value.x += dir;
  }
};

// 旋转
const pieceRotate = () => {
    const shape = currentPiece.value.shape;
    const newShape = shape[0].map((_: any, colIndex: number) => shape.map((row: number[]) => row[colIndex]).reverse());
    
    // 碰撞检测，墙踢
    let offsetX = 1;
    if (!checkCollision({ ...currentPiece.value, shape: newShape }, currentPiece.value.x, currentPiece.value.y)) {
        currentPiece.value.shape = newShape;
    } else if (!checkCollision({ ...currentPiece.value, shape: newShape }, currentPiece.value.x + offsetX, currentPiece.value.y)) {
        currentPiece.value.x += offsetX;
        currentPiece.value.shape = newShape;
    } else if (!checkCollision({ ...currentPiece.value, shape: newShape }, currentPiece.value.x - offsetX, currentPiece.value.y)) {
        currentPiece.value.x -= offsetX;
        currentPiece.value.shape = newShape;
    }
};


// 游戏循环
const update = (time = 0) => {
  if (!isPlaying.value) return;

  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;

  if (dropCounter > dropInterval) {
    pieceDrop();
    dropCounter = 0;
  }

  draw();
  if (!isGameOver.value) {
    requestAnimationFrame(update);
  }
};

// 开始游戏
const startGame = () => {
  board.value = createBoard();
  currentPiece.value = createPiece();
  nextPiece.value = createPiece();
  score.value = 0;
  lines.value = 0;
  level.value = 0;
  isGameOver.value = false;
  isPlaying.value = true;
  dropInterval = 1000;
  
  drawNextPiece();
  update();
};

// --- 事件处理 ---
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    goHome();
    return;
  }
  if (!isPlaying.value) return;

  switch (e.key) {
    case 'a':
    case 'ArrowLeft':
      pieceMove(-1);
      break;
    case 'd':
    case 'ArrowRight':
      pieceMove(1);
      break;
    case 's':
    case 'ArrowDown':
      pieceDrop();
      dropCounter = 0;
      break;
    case 'r':
    case 'ArrowUp':
      pieceRotate();
      break;
  }
};

// --- 生命周期钩子 ---
onMounted(() => {
  ctx.value = gameCanvas.value?.getContext('2d') || null;
  nextCtx.value = nextCanvas.value?.getContext('2d') || null;
  if (ctx.value) {
    ctx.value.scale(1, 1);
  }
});

onBeforeUnmount(() => {
  isPlaying.value = false;
});

useKeyboardListener(handleKeydown);

</script>

<style scoped>
.g-show {
  background-color: #f0f0f0;
  font-family: var(--font-family);
}

.russciablock {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  color: white;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5em;
  color: #eee;
}

.game-container {
  display: flex;
  gap: 20px;
}

canvas {
  border: 2px solid #555;
  /* background-color: #000; */
}

.game-info {
  width: 150px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-size: 1.2em;
}

.next-piece {
    text-align: center;
}

.next-piece canvas {
    background-color: #222;
    border-radius: 5px;
}

button {
  padding: 10px 15px;
  font-size: 1em;
  background-color: var(--primary-color);
  color: white; /* Overriding global to ensure contrast */
  border-radius: var(--border-radius);
}

button:hover {
  background-color: #45a049; /* Keep specific hover for this button */
}

.game-over-text {
  color: #ff4136;
  font-weight: bold;
  font-size: 1.5em;
}
</style>
