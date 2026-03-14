import { Game } from './core/Game';

const game = new Game();
window.game = game;

document.addEventListener('DOMContentLoaded', () => {
  console.log('🦞 三国杀 Mini v3.3.0');
  game.init();
});