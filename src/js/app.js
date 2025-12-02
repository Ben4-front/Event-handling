import Game from './Game';
import '../css/style.css'; // Импортируем стили, чтобы Webpack их обработал

document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('game-container');
  const game = new Game(gameContainer);
  game.start();
});