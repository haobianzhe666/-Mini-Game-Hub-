# 🎮 Mini Game Hub (迷你游戏中心)

这是一个使用 Vue 3 和 Vite 构建的交互式迷你游戏平台。它提供了一个清爽的界面，用于浏览和启动各种经典的休闲游戏。

## ✨ 功能特性

- **游戏浏览器**: 使用 Element Plus 的走马灯组件，以卡片形式动态展示游戏列表。
- **游戏启动器**: 显示选中游戏的详细信息，并提供“开始游戏”按钮，无缝导航到游戏页面。
- **响应式状态管理**: 利用 Pinia 跨组件共享和管理游戏数据及选择状态。
- **模块化路由**: 使用 Vue Router 为每个游戏和主页设置了独立的路由。
- **组合式API**: 大量使用 Vue 3 的组合式 API (`setup` 语法糖) 来组织逻辑，例如通过 `useKeyboardListener` 来处理全局键盘事件。

## 🕹️ 已包含的游戏

1.  **2048**: 经典的数字合并游戏，挑战你的逻辑思维。
2.  **贪吃蛇 (Hungry Snake)**: 控制小蛇吃食物，不断变长，看看你能得多少分。
3.  **扫雷 (Minesweeper)**: 找出所有非地雷的方块，考验你的推理和运气。
4.  **俄罗斯方块 (Russcia Block)**: 移动和旋转下落的方块，以填充和消除行。
5.  **汉诺塔 (Tower of Hanoi)**: 一个经典的递归问题，将所有盘子从一个柱子移动到另一个柱子。

## 🛠️ 技术栈

- **前端框架**: [Vue 3](https://vuejs.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **路由**: [Vue Router](https://router.vuejs.org/)
- **UI 组件库**: [Element Plus](https://element-plus.org/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)

## 📁 项目结构

```
src/
├── assets/         # 静态资源，如图片和全局样式
├── components/     # 可重用的Vue组件
│   ├── gchange.vue # 游戏选择走马灯组件
│   └── gplay.vue   # 游戏展示和启动组件
├── composables/    # 组合式函数
│   └── useKeyboardListener.ts # 键盘监听钩子
├── router/         # 路由配置
│   └── index.ts
├── stores/         # Pinia状态管理
│   └── index.ts
└── views/          # 页面视图
    ├── home.vue    # 主页
    └── games/      # 存放所有游戏组件
        ├── 2048.vue
        ├── hungry_snake.vue
        ├── Minesweeper.vue
        ├── russcia_block.vue
        └── Tower_of_Hanoi.vue
```

## 🚀 快速开始

1.  **克隆仓库**
    ```bash
    git clone https://github.com/haobianzhe666/-Mini-Game-Hub-.git
    cd my_vite
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **运行开发服务器**
    ```bash
    npm run dev
    ```

4.  在浏览器中打开 `http://localhost:5173` (或终端中显示的地址)。

## 🧩 核心组件解析

### `gchange.vue`

该组件负责以卡片轮播的形式展示所有可玩的游戏。当用户切换卡片时，它会通过 Pinia store 更新当前选中的游戏，从而触发 `gplay.vue` 组件的内容更新。

### `gplay.vue`

此组件订阅 Pinia store 中的 `selectedGame` 状态。当 `gchange.vue` 中选择的游戏变化时，它会动态地展示该游戏的背景大图和名称，并提供一个“开始游戏”的按钮，点击后会通过 Vue Router 跳转到对应的游戏页面。
