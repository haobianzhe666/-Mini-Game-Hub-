import { onMounted, onBeforeUnmount } from 'vue';

type KeyHandler = (e: KeyboardEvent) => void;

/**
 * 一个简单的 Vue Composable，用于管理键盘事件监听器。
 * @param handler - 当键盘按下时要执行的回调函数。
 */
export function useKeyboardListener(handler: KeyHandler) {
  onMounted(() => {
    window.addEventListener('keydown', handler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handler);
  });
}