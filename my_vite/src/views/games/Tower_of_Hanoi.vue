<template>
  <div class="g-show">
    <div class="towerofhanoi">
      <div class="discribe">
        欢迎来到汉诺塔游戏！
      </div>
      <div class="g-contain" :p_width="p_width">
        <div class="g-play">
          <div class="ploe a" ref="poleARef"
          @dragover="handleDragOver($event, 'a')"
          @dragleave="handleDragLeave"
          @drop="drop($event, 'a')">
            <div class="p-block">
              <div v-for="value in poles.a" :key="value"
                   class="plate" 
                   :style="{width: blockWidth(value)}"
                   :draggable="poles.a[0]==value?true:false"
                   @dragstart="dragStart(value)"
                   @dragover.prevent
                   @dragenter.prevent
              >
                <div class="cell">
                  {{ value }}
                </div>
              </div>
            </div>
            <div class="p-buttom" :style="{width: bottomWidth}"><div>A</div></div>
          </div>
          <div class="ploe b"
          @dragover="handleDragOver($event, 'b')"
          @dragleave="handleDragLeave"
          @drop="drop($event, 'b')">
            <div class="p-block">
              <div v-for="value in poles.b" :key="value"
                   class="plate" 
                   :style="{width: blockWidth(value)}"
                   :draggable="poles.b[0]==value?true:false"
                   @dragstart="dragStart(value)"
                   @dragover.prevent
                   @dragenter.prevent
              >
                <div class="cell">
                  {{ value }}
                </div>
              </div>
            </div>
            <div class="p-buttom" :style="{width: bottomWidth}"><div>B</div></div>
          </div>
          <div class="ploe c"
          @dragover="handleDragOver($event, 'c')"
          @dragleave="handleDragLeave"
          @drop="drop($event, 'c')">
            <div class="p-block">
              <div v-for="value in poles.c" :key="value"
                   class="plate" 
                   :style="{width: blockWidth(value)}"
                   :draggable="poles.c[0]==value?true:false"
                   @dragstart="dragStart(value)"
                   @dragover.prevent
                   @dragenter.prevent
              >
                <div class="cell">
                  {{ value }}
                </div>
              </div>
            </div>
            <div class="p-buttom" :style="{width: bottomWidth}"><div>C</div></div>
          </div>
        </div>
        <div class="g-buttom">
          <div>选择数量：<input type="text" v-model="selectedNum" @change="initializeGame"></div>
          <button @click="resetGame">重 置</button>
          <div>当前步数：{{ stepCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElStep } from 'element-plus'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useKeyboardListener } from '@/composables/useKeyboardListener';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

useKeyboardListener((e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    goHome();
  }
});

let p_width = ref<number>(40)
const num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]
const poleARef = ref<HTMLElement | null>(null)
const selectedNum = ref<number>(3) // 默认选择所有盘子
const stepCount = ref<number>(0) // 步数计数器
let bottomWidth=ref<string>('0px') // 底部宽度
bottomWidth.value = selectedNum.value > 16 ? `${p_width.value / 13 + selectedNum.value * 6.6}px` : '140px'
let current_plate=ref<number>(0)

// 初始化盘子位置
const poles = ref<{ a: number[], b: number[], c: number[] }>({
  a: [...num.slice(0, selectedNum.value)],
  b: [],
  c: []
})

// 计算盘子宽度
const blockWidth = (value: number) => {
  return p_width.value !== undefined ? `${p_width.value / 13 + value * 5.8}px` : '0px'
}

// 计算底部宽度


// 拖拽开始事件
const dragStart = (value: number) => {
  current_plate.value = value// 打印当前拖拽的盘子
}


const handleDragOver = (event: DragEvent, poleKey: 'a' | 'b' | 'c') => {
  const draggedPlate = current_plate.value;
  if (!poles.value[poleKey].includes(draggedPlate)) {
    event.preventDefault();
    let divelement = event.target as HTMLElement;
    if (divelement.classList.contains(poleKey)) {
      divelement.classList.add('dragover');
    }
  }
};







// 拖拽离开事件处理
const handleDragLeave = (event: DragEvent) => {
  const divelement=event.target as HTMLElement
  if(divelement.classList.contains('dragover')){
    divelement.classList.remove('dragover')
  }
  event.preventDefault()
}

// 拖拽结束事件
const drop = (event: DragEvent, poleKey: 'a' | 'b' | 'c') => {
  const draggedPlate = current_plate.value
  let divelement = event.target as HTMLElement;
  divelement.classList.remove('dragover');
  if (draggedPlate) {
    const sourcePole = Object.keys(poles.value).find(
      key => poles.value[key as 'a' | 'b' | 'c'].includes(draggedPlate)
    ) as 'a' | 'b' | 'c'
    // 新增汉诺塔规则验证（不能拖动中间盘子/不能大压小）
    
    const targetStack = poles.value[poleKey]
    const isValidTarget = targetStack.length === 0 || targetStack[0] > draggedPlate
    if (sourcePole &&isValidTarget) {
      poles.value[sourcePole] = poles.value[sourcePole].filter(value => value !== draggedPlate)
      poles.value[poleKey].unshift(draggedPlate)
      stepCount.value++
      current_plate.value = 0
      console.log(`${poles.value.a}\n`)
      console.log(`${poles.value.b}\n`)
      console.log(`${poles.value.c}\n`)
    } 
     else {
      alert('禁止将大盘子放在小盘子上！')
    }
  }
}

// 初始化游戏
const initializeGame = () => {
  const numCount = parseInt(selectedNum.value.toString(), 10)
  if (!isNaN(numCount) && numCount > 2 && numCount <= num.length) {
    poles.value.a = num.slice(0, numCount)
    poles.value.b = []
    poles.value.c = []
    stepCount.value = 0
    p_width.value = poleARef.value ? poleARef.value.offsetWidth : 40
  } else {
    alert('请输入有效的盘子数量（3-32）')
  }
}

// 重置游戏逻辑
const resetGame = () => {
  poles.value.a = [...num.slice(0, selectedNum.value)]
  poles.value.b = []
  poles.value.c = []
  stepCount.value = 0
  bottomWidth.value = selectedNum.value > 16 ? `${p_width.value / 13 + selectedNum.value * 6.6}px` : '140px'
}

onMounted(() => {
  initializeGame()
  window.addEventListener('resize', () => {
    if (poleARef.value) {
      p_width.value = poleARef.value.offsetWidth
    }
  })
})
</script>

<style scoped>
.dragover{
  box-shadow: 0 0 10px gray;
  border-radius: 20px;
  transition: all 0.3s ease;
  /* background-color: red!important; */
}
.plate:hover {
  background-color: rgb(1, 114, 46);
  cursor: pointer;
  box-shadow: 0 0 10px rgb(1, 114, 46);
  transition: all 0.3s ease;
  transform: scale(1.1);
}

.p-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 6%;
}

.p-buttom {
  width: 80%;
  display: flex;
  height: 14px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: rgb(95, 156, 246);
  font-size: 15px;
  margin-top: 2px;
  margin-bottom: 7%;
  color: white;
  position: absolute;
  bottom: 0;
}

.cell {
  font-size: 10px;
  font-weight: bold;
  color: white;
}

.ploe {
  user-select: none;
  width: 30%;
  display: flex;
  position: relative;
  align-items: center;
  background-color: white;
  flex-direction: column;
  height: 100%;

}

.plate {
  height: 16px;
  background-color: rgb(60, 188, 60);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.g-show {
  background-color: white;
}

.towerofhanoi {
  max-width: 980px;
  width: 80%;
  height: 80%;
  background-color: #78f4a8;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.discribe {
  text-align: center;
  display: flex;
  align-items: center;
  font-size: 24px;
  color: black;
  margin-bottom: 20px;
}

.g-contain {
  width: 100%;
  height: 90%;
  background-color: white;
  position: relative;
}

.g-play {
  width: 100%;
  height: 95%;
  display: flex;
  justify-content: space-evenly;
  position: absolute;
  bottom: 5%;
}

.g-buttom {
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #78f4a8;
  position: absolute;
  bottom: 0;
}

button {
  margin-top: 25px;
  width: 100px;
  font-size: 20px;
  color: white;
  background-color: rgb(95, 156, 246);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  box-shadow: 0 0 10px rgb(95, 156, 246);
}

.g-buttom div {
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin-top: 25px;
  color: white;
  background-color: rgb(95, 156, 246);
  border-radius: 10px;
}

input {
  font-size: 15px;
  width: 30px;
  display: block;
  line-height: 20px;
  text-align: center;
  margin-left: -10px;
  margin-top: 3px;
  border: 4px solid rgb(95, 156, 246);
  border-radius: 5px;
}
</style>
