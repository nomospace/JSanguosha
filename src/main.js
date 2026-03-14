// 🦞 三国杀 Mini - 文字版主入口
import { Game } from './game/Game';

// 初始化游戏
const game = new Game();
window.game = game;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('🦞 三国杀 Mini 文字版已加载');
  game.init();
});
