<template>
  <div class="g-show">
    <div class="g-hungry_snake">
      <div class="discribe">
        <h1>欢迎来到贪吃蛇游戏！</h1>
        <p>使用wasd或者↑↓←→键控制方向</p>
        <p>当前分数: {{ score }}</p>
        <p>历史最高分: {{ highScore }}</p>
        <button @click="initGame" v-if="!gameStarted">开始游戏</button>
        <label class="cheat-mode-label">
          <input type="checkbox" v-model="cheatMode"> 开启作弊模式
        </label>
      </div>
    </div>
    <div v-if="gameOver" class="game-over">
      游戏结束！<button @click="initGame">再试一次</button>
    </div>
    <canvas ref="canvas" width="400" height="400"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useKeyboardListener } from '@/composables/useKeyboardListener';
import { useRouter } from 'vue-router';

type Direction = 'up' | 'down' | 'left' | 'right';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const CELL_SIZE = 20;
const GRID_SIZE = 20; // 地图大小
const GAME_SPEED = 150; // 蛇移动速度

// 游戏状态
const canvas = ref<HTMLCanvasElement>();
const ctx = ref<CanvasRenderingContext2D>();
const snake = ref<{ x: number; y: number }[]>([]);
const food = ref({ x: -1, y: -1 });
const direction = ref<Direction>('right');
const nextDirection = ref<Direction>('right');
const score = ref(0);
const highScore = ref(0);
const gameOver = ref(false);
const gameStarted = ref(false);
const gameLoopId = ref<number | null>(null);
const cheatMode = ref(false);

// 初始化游戏
const initGame = () => {
  snake.value = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
  ];
  direction.value = 'right';
  nextDirection.value = 'right';
  score.value = 0;
  highScore.value = Math.max(highScore.value, score.value);
  gameOver.value = false;
  gameStarted.value = true;
  generateFood();
  if (gameLoopId.value) clearTimeout(gameLoopId.value);
  gameLoopId.value = setTimeout(update, GAME_SPEED);
};

// 生成食物
const generateFood = () => {
  const validPositions: { x: number; y: number }[] = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!snake.value.some(seg => seg.x === x && seg.y === y)) {
        validPositions.push({ x, y });
      }
    }
  }
  if (validPositions.length > 0) {
    const { x, y } = validPositions[Math.floor(Math.random() * validPositions.length)];
    food.value = { x, y };
  }
};

// 游戏主循环
const update = () => {
  if (gameOver.value) return;

  // 移动蛇头
  const head = { ...snake.value[0] };
  direction.value = nextDirection.value;

  // 碰到墙壁时从相反的另一面墙壁出来
  switch (direction.value) {
    case 'up': head.y = head.y > 0 ? head.y - 1 : GRID_SIZE - 1; break;
    case 'down': head.y = head.y < GRID_SIZE - 1 ? head.y + 1 : 0; break;
    case 'left': head.x = head.x > 0 ? head.x - 1 : GRID_SIZE - 1; break;
    case 'right': head.x = head.x < GRID_SIZE - 1 ? head.x + 1 : 0; break;
  }

  // 碰撞检测（吃到自己身体）
  if (snake.value.some((seg, index) => index !== 0 && seg.x === head.x && seg.y === head.y)) {
    gameOver.value = true;
    if (score.value > highScore.value) highScore.value = score.value;
    return;
  }

  // 吃食物逻辑
  let ateFood = false;
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10;
    ateFood = true;
    generateFood();
  }

  // 作弊模式：自动寻找食物
  if (cheatMode.value && !ateFood) {
    // 计算下一个移动方向
    const foodPos = { x: food.value.x, y: food.value.y };
    const currentPos = snake.value[0];
    let newDir: Direction = 'right';

    if (foodPos.x < currentPos.x) newDir = 'left';
    else if (foodPos.x > currentPos.x) newDir = 'right';
    else if (foodPos.y < currentPos.y) newDir = 'up';
    else if (foodPos.y > currentPos.y) newDir = 'down';

    // 避免反向移动
    if (direction.value !== oppositeDirection(newDir)) {
      nextDirection.value = newDir;
    }
  } else {
    // 玩家控制
    nextDirection.value = direction.value;
  }

  // 更新蛇身
  snake.value.unshift(head);
  if (!ateFood) snake.value.pop();

  // 绘制
  if (ctx.value) {
    ctx.value.fillStyle = '#2c3e50';
    ctx.value.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    // 绘制食物
    ctx.value.fillStyle = '#e74c3c';
    ctx.value.fillRect(food.value.x * CELL_SIZE, food.value.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);

    // 绘制蛇
    snake.value.forEach((seg, index) => {
      ctx.value!.fillStyle = index === 0 ? '#27ae60' : '#2ecc71';
      ctx.value!.fillRect(seg.x * CELL_SIZE, seg.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
    });
  }

  gameLoopId.value = setTimeout(update, GAME_SPEED);
};

// 获取相反方向
const oppositeDirection = (dir: Direction): Direction => {
  switch (dir) {
    case 'up': return 'down';
    case 'down': return 'up';
    case 'left': return 'right';
    case 'right': return 'left';
  }
};

// 键盘控制
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    goHome();
    return;
  }
  if (cheatMode.value || !gameStarted.value) return; // 作弊模式或游戏未开始时忽略键盘输入

  const keyMap: Record<string, Direction> = {
    ArrowUp: 'up',
    w: 'up',
    ArrowDown: 'down',
    s: 'down',
    ArrowLeft: 'left',
    a: 'left',
    ArrowRight: 'right',
    d: 'right'
  };

  const newDir = keyMap[e.key];
  if (newDir) {
    e.preventDefault();
    // 禁止反向移动
    if (
      (direction.value === 'up' && newDir !== 'down') ||
      (direction.value === 'down' && newDir !== 'up') ||
      (direction.value === 'left' && newDir !== 'right') ||
      (direction.value === 'right' && newDir !== 'left')
    ) {
      nextDirection.value = newDir;
    }
  }
};

// 生命周期
useKeyboardListener(handleKeydown);

onMounted(() => {
  ctx.value = canvas.value?.getContext('2d') || undefined;
});

onBeforeUnmount(() => {
  if (gameLoopId.value) clearTimeout(gameLoopId.value);
});
</script>

<style scoped>
.g-show {
  flex-direction: column;
}

.g-hungry_snake {
  width: 80%;
  max-width: 500px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.discribe {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
  font-weight: bold;
}

.discribe h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.discribe p {
  font-size: 18px;
  margin: 5px 0;
}

.cheat-mode-label {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  font-size: 18px;
  color: #555;
}

.cheat-mode-label input[type="checkbox"] {
  margin-right: 10px;
  accent-color: #3498db;
}

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

button:hover {
  /* Now inherits from main.css */
  background: #7f6a56; /* Can be removed if brightness filter is enough */
}

canvas {
  border: 2px solid #34495e;
  border-radius: 8px;
  background-color: #ecf0f1;
  max-width: 400px;
  max-height: 400px;
}
</style>
