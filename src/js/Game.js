import goblinImg from '../img/goblin.png';

export default class Game {
  constructor(element) {
    this.element = element;
    this.boardSize = 4;
    this.activeCell = null;
    this.intervalId = null;
    
    // Статистика
    this.score = 0;
    this.missCount = 0;
    this.maxMisses = 5;
  }

  drawBoard() {
    const board = document.createElement('div');
    board.className = 'board';

    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      board.append(cell);
    }

    this.element.append(board);
    this.cells = Array.from(document.querySelectorAll('.cell'));

    // Добавляем слушатель кликов на всё поле (делегирование)
    board.addEventListener('click', (e) => this.onCellClick(e));
    
    // Находим элементы статистики
    this.scoreEl = document.getElementById('score');
    this.missEl = document.getElementById('miss');
  }

  generatePosition() {
    const position = Math.floor(Math.random() * this.cells.length);
    if (position === this.activeCell) {
      return this.generatePosition();
    }
    return position;
  }

  moveGoblin() {
    // 1. Проверка промаха (если это не первый ход и гоблин всё еще на поле)
    // Если activeCell !== null, значит гоблин был на поле.
    // Мы проверяем: если в текущей активной ячейке есть ребенок (картинка), значит его НЕ удалили кликом -> Промах.
    if (this.activeCell !== null) {
        const currentCell = this.cells[this.activeCell];
        if (currentCell.querySelector('.goblin')) {
            this.missCount += 1;
            this.missEl.textContent = this.missCount;
            
            // Удаляем гоблина (очищаем старую ячейку)
            currentCell.innerHTML = '';

            if (this.missCount >= this.maxMisses) {
                this.gameOver();
                return; // Выходим, чтобы не создавать нового гоблина
            }
        }
    }

    // 2. Создаем нового гоблина
    const index = this.generatePosition();
    this.activeCell = index;

    const img = document.createElement('img');
    img.src = goblinImg;
    img.className = 'goblin';
    img.alt = 'goblin';

    this.cells[index].append(img);
  }

  onCellClick(e) {
    // e.target - это элемент, на который кликнули (div.cell)
    // Т.к. у картинки pointer-events: none, клик всегда будет по .cell
    const targetCell = e.target;
    
    // Если в ячейке есть гоблин
    if (targetCell.querySelector('.goblin')) {
        this.score += 1;
        this.scoreEl.textContent = this.score;
        
        // Гоблин "убит" - удаляем его сразу
        targetCell.innerHTML = '';
        
        // Можно сбросить таймер, чтобы игра стала динамичнее, 
        // но по ТЗ "появляется ровно на 1 сек", поэтому просто ждем следующего тика.
    }
  }

  start() {
    this.drawBoard();
    
    // Интервал 1 секунда (1000 мс)
    this.intervalId = setInterval(() => {
      this.moveGoblin();
    }, 1000);
    
    // Сразу запускаем первого, чтобы не ждать секунду
    this.moveGoblin();
  }

  gameOver() {
    clearInterval(this.intervalId);
    alert(`Game Over! Ваш счет: ${this.score}`);
    // Можно добавить логику перезапуска здесь
  }
}