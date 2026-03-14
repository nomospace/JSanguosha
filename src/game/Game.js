import { CHARACTERS, KINGDOM_COLORS, getCharacterAvatar } from '../config/characters';
import { CARDS, SUITS, CARD_TYPES, getCardImage, getCardPlaceholder } from '../config/cards';

export class Game {
  constructor() {
    this.playerCount = 4;
    this.players = [];
    this.deck = [];
    this.discardPile = [];
    this.currentPlayerIndex = 0;
    this.turnCount = 0;
    this.gameState = 'waiting';
    this.isPaused = false;
    this.logEntries = [];
    this.tooltip = null;
  }

  init() {
    this.renderPlayers();
    this.updateUI();
    this.initTooltip();
    this.showBuildTimestamp();
    this.log('🎮 欢迎来到三国杀 Mini！', 'system');
    this.log('点击"开始游戏"按钮开始对战', 'system');
  }

  showBuildTimestamp() {
    const tsEl = document.getElementById('build-timestamp');
    if (tsEl) {
      const now = new Date();
      const timeStr = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      tsEl.textContent = `🕐 构建时间：${timeStr}`;
    }
  }

  // ========== 悬浮提示 ==========

  initTooltip() {
    this.tooltip = {
      el: document.getElementById('card-tooltip'),
      image: document.getElementById('tooltip-image'),
      name: document.getElementById('tooltip-name'),
      suit: document.getElementById('tooltip-suit'),
      desc: document.getElementById('tooltip-desc')
    };

    // 鼠标移动时更新提示位置
    document.addEventListener('mousemove', (e) => {
      if (this.tooltip.el.classList.contains('show')) {
        const x = e.clientX + 15;
        const y = e.clientY + 15;
        
        // 防止超出屏幕
        const rect = this.tooltip.el.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 20;
        const maxY = window.innerHeight - rect.height - 20;
        
        this.tooltip.el.style.left = Math.min(x, maxX) + 'px';
        this.tooltip.el.style.top = Math.min(y, maxY) + 'px';
      }
    });
  }

  showCardTooltip(cardKey, event) {
    const card = CARDS[cardKey];
    if (!card || !this.tooltip) return;

    const suit = SUITS[card.suit];
    const imageUrl = getCardImage(cardKey);
    const placeholderUrl = getCardPlaceholder(cardKey);

    this.tooltip.image.src = imageUrl;
    this.tooltip.image.onerror = () => {
      // 图片加载失败时显示精美的占位图
      this.tooltip.image.src = placeholderUrl;
    };
    this.tooltip.name.textContent = card.name;
    this.tooltip.name.style.color = card.color;
    this.tooltip.suit.textContent = `${suit.symbol} ${suit.name} | ${CARD_TYPES[card.type].name}`;
    this.tooltip.desc.textContent = card.description;

    this.tooltip.el.classList.add('show');
  }

  hideCardTooltip() {
    if (this.tooltip) {
      this.tooltip.el.classList.remove('show');
    }
  }

  // ========== 渲染 ==========

  renderPlayers() {
    const grid = document.getElementById('players-grid');
    grid.innerHTML = '';

    const positions = this.calculatePlayerPositions(this.playerCount);

    positions.forEach((pos, index) => {
      const character = CHARACTERS[index % CHARACTERS.length];
      const player = {
        index,
        character,
        hp: character.hp,
        maxHp: character.hp,
        handCards: [],
        isAlive: true,
        element: null
      };
      this.players.push(player);

      const card = this.createPlayerCard(player);
      player.element = card;
      grid.appendChild(card);
    });
  }

  createPlayerCard(player) {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.id = `player-${player.index}`;

    const kingdom = KINGDOM_COLORS[player.character.kingdom];
    const avatarUrl = getCharacterAvatar(player.character.key);

    card.innerHTML = `
      <div class="player-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${avatarUrl}" style="width: 40px; height: 40px; border-radius: 50%; background: ${kingdom.primary};" alt="${player.character.name}">
          <span class="player-name kingdom-${player.character.kingdom}">${player.character.name}</span>
        </div>
        <span style="color: ${kingdom.primary}; font-size: 12px; font-weight: bold;">${kingdom.name}</span>
      </div>
      <div class="player-skill">【${player.character.skill}】${player.character.description}</div>
      <div class="player-hp" id="hp-${player.index}">${this.renderHP(player.hp, player.maxHp)}</div>
      <div class="player-cards" id="cards-${player.index}">📦 0 张手牌</div>
      <div class="hand-cards" id="hand-cards-${player.index}"></div>
    `;

    return card;
  }

  renderHP(current, max) {
    let hp = '';
    for (let i = 0; i < current; i++) hp += '❤️';
    for (let i = current; i < max; i++) hp += '🖤';
    return hp;
  }

  updatePlayerDisplay(player) {
    const hpEl = document.getElementById(`hp-${player.index}`);
    const cardsEl = document.getElementById(`cards-${player.index}`);
    const cardEl = document.getElementById(`player-${player.index}`);
    const handCardsEl = document.getElementById(`hand-cards-${player.index}`);

    if (hpEl) hpEl.innerHTML = this.renderHP(player.hp, player.maxHp);
    if (cardsEl) cardsEl.textContent = `📦 ${player.handCards.length} 张手牌`;

    // 渲染手牌
    if (handCardsEl) {
      handCardsEl.innerHTML = player.handCards.map(card => {
        const suit = SUITS[card.suit] || SUITS.spade;
        return `
          <div class="mini-card" 
               style="background: ${card.color}; border-color: ${card.color};"
               onmouseenter="game.showCardTooltip('${card.key}', event)"
               onmouseleave="game.hideCardTooltip()">
            <div class="suit" style="color: #fff;">${suit.symbol}</div>
            <div class="name" style="color: #fff;">${card.name}</div>
          </div>
        `;
      }).join('');
    }

    if (player.isAlive) {
      cardEl?.classList.remove('dead');
    } else {
      cardEl?.classList.add('dead');
    }
  }

  highlightPlayer(player) {
    this.players.forEach(p => {
      p.element?.classList.remove('active');
    });
    player.element?.classList.add('active');
  }

  updateUI() {
    const deckCount = document.getElementById('deck-count');
    const discardCount = document.getElementById('discard-count');
    const deckRemaining = document.getElementById('deck-remaining');
    const discardPile = document.getElementById('discard-pile');
    const turnDisplay = document.getElementById('turn-display');
    const gameStatus = document.getElementById('game-status');

    if (deckCount) deckCount.textContent = `牌堆：${this.deck.length}`;
    if (discardCount) discardCount.textContent = `弃牌：${this.discardPile.length}`;
    if (deckRemaining) deckRemaining.textContent = this.deck.length;
    if (discardPile) discardPile.textContent = this.discardPile.length;

    if (this.gameState === 'playing') {
      const player = this.players[this.currentPlayerIndex];
      if (turnDisplay) {
        turnDisplay.textContent = `第 ${this.turnCount} 回合 | ${player?.character.name || ''}`;
        turnDisplay.style.color = '#f39c12';
      }
      if (gameStatus) {
        gameStatus.textContent = this.isPaused ? '已暂停' : '游戏中';
        gameStatus.style.background = this.isPaused ? '#f39c12' : '#2ecc71';
      }
    } else if (this.gameState === 'waiting') {
      if (turnDisplay) {
        turnDisplay.textContent = '准备开始';
        turnDisplay.style.color = '#fff';
      }
      if (gameStatus) {
        gameStatus.textContent = '等待开始';
        gameStatus.style.background = '#2ecc71';
      }
    }
  }

  // ========== 游戏逻辑 ==========

  initGame() {
    this.initDeck();
  }

  initDeck() {
    this.deck = [];
    let cardId = 0;

    Object.entries(CARDS).forEach(([key, card]) => {
      for (let i = 0; i < card.count; i++) {
        this.deck.push({
          id: cardId++,
          key,
          name: card.name,
          type: card.type,
          suit: card.suit,
          color: card.color,
          description: card.description
        });
      }
    });

    this.shuffleDeck();
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealInitialCards() {
    this.players.forEach(player => {
      for (let i = 0; i < 4; i++) {
        this.drawCard(player);
      }
    });
  }

  drawCard(player, count = 1) {
    for (let i = 0; i < count; i++) {
      if (this.deck.length > 0) {
        const card = this.deck.pop();
        player.handCards.push(card);
      }
    }
    this.updatePlayerDisplay(player);
    this.updateUI();
  }

  startGame() {
    if (this.gameState === 'playing') {
      // 重新开始
      this.resetGame();
      return;
    }

    this.gameState = 'playing';
    this.isPaused = false;
    this.log('🎲 游戏开始！', 'system');

    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');

    if (btnStart) {
      btnStart.textContent = '🔄 重新开始';
      btnStart.classList.remove('btn-primary');
      btnStart.classList.add('btn-danger');
    }
    if (btnPause) {
      btnPause.style.display = 'block';
      btnPause.classList.remove('btn-secondary');
      btnPause.classList.add('btn-primary');
    }

    this.startTurn();
  }

  resetGame() {
    this.players = [];
    this.deck = [];
    this.discardPile = [];
    this.currentPlayerIndex = 0;
    this.turnCount = 0;
    this.isPaused = false;
    this.logEntries = [];
    document.getElementById('log-content').innerHTML = '';

    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');

    if (btnStart) {
      btnStart.textContent = '🎲 开始游戏';
      btnStart.classList.remove('btn-danger');
      btnStart.classList.add('btn-primary');
    }
    if (btnPause) {
      btnPause.style.display = 'none';
    }

    this.init();
  }

  togglePause() {
    if (this.gameState !== 'playing') return;

    this.isPaused = !this.isPaused;
    const btnPause = document.getElementById('btn-pause');

    if (this.isPaused) {
      this.gameState = 'paused';
      if (btnPause) {
        btnPause.textContent = '▶️ 继续';
        btnPause.classList.remove('btn-primary');
        btnPause.classList.add('btn-secondary');
      }
      this.log('⏸️ 游戏已暂停', 'system');
    } else {
      this.gameState = 'playing';
      if (btnPause) {
        btnPause.textContent = '⏸️ 暂停';
        btnPause.classList.remove('btn-secondary');
        btnPause.classList.add('btn-primary');
      }
      this.log('▶️ 游戏继续', 'system');
      this.startTurn();
    }

    this.updateUI();
  }

  backToMenu() {
    if (confirm('确定要返回吗？当前游戏进度将丢失。')) {
      window.location.reload();
    }
  }

  startTurn() {
    if (this.isPaused) return;

    const player = this.players[this.currentPlayerIndex];

    if (!player.isAlive) {
      this.nextTurn();
      return;
    }

    this.turnCount++;
    this.log(`========== 第 ${this.turnCount} 回合 - ${player.character.name} ==========`, 'turn');
    this.log(`📦 摸牌阶段`, 'phase');

    this.highlightPlayer(player);
    this.updateUI();

    setTimeout(() => {
      this.drawCard(player, 2);
      this.log(`🃏 摸了 2 张牌`, 'draw');

      setTimeout(() => {
        this.log(`🎯 出牌阶段`, 'phase');
        this.aiPlayCard(player);
      }, 800);
    }, 500);
  }

  aiPlayCard(player) {
    if (player.handCards.length === 0 || !player.isAlive) {
      this.endTurn();
      return;
    }

    const cardIndex = Math.floor(Math.random() * player.handCards.length);
    const card = player.handCards[cardIndex];

    this.log(`🃏 使用【${card.name}】`, 'play');

    setTimeout(() => {
      const targetPlayer = this.getRandomTarget(player);
      this.resolveCard(player, targetPlayer, card, cardIndex);
    }, 500);
  }

  getRandomTarget(sourcePlayer) {
    const alivePlayers = this.players.filter(p => p !== sourcePlayer && p.isAlive);
    if (alivePlayers.length === 0) return sourcePlayer;
    return alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
  }

  resolveCard(sourcePlayer, targetPlayer, card, cardIndex) {
    let damage = 1;

    if (card.key === 'juedou') damage = 2;
    if (card.key === 'tao') {
      if (sourcePlayer.hp < sourcePlayer.maxHp) {
        sourcePlayer.hp = Math.min(sourcePlayer.maxHp, sourcePlayer.hp + 1);
        this.updatePlayerDisplay(sourcePlayer);
        this.log(`❤️ ${sourcePlayer.character.name} 使用【桃】回复 1 点体力`, 'heal');
      }
      sourcePlayer.handCards.splice(cardIndex, 1);
      this.discardPile.push(card);
      this.endTurn();
      return;
    }

    this.log(`⚔️ ${sourcePlayer.character.name} 对 ${targetPlayer.character.name} 造成 ${damage} 点伤害`, 'play');

    targetPlayer.hp = Math.max(0, targetPlayer.hp - damage);
    this.updatePlayerDisplay(targetPlayer);

    if (targetPlayer.hp <= 0) {
      targetPlayer.isAlive = false;
      this.log(`💀 ${targetPlayer.character.name} 阵亡！`, 'death');
    }

    sourcePlayer.handCards.splice(cardIndex, 1);
    this.discardPile.push(card);
    this.updateUI();

    setTimeout(() => {
      this.endTurn();
    }, 800);
  }

  endTurn() {
    this.log(`✅ 回合结束`, 'system');

    const player = this.players[this.currentPlayerIndex];

    if (player.character.key === 'diaochan' && player.isAlive) {
      setTimeout(() => {
        this.drawCard(player, 1);
        this.log(`🌙 貂蝉发动【闭月】摸 1 张牌`, 'skill');
      }, 500);
    }

    setTimeout(() => {
      this.nextTurn();
    }, 800);
  }

  nextTurn() {
    if (this.checkGameOver()) {
      return;
    }

    do {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    } while (!this.players[this.currentPlayerIndex].isAlive);

    this.startTurn();
  }

  checkGameOver() {
    const aliveCount = this.players.filter(p => p.isAlive).length;

    if (aliveCount <= 1) {
      this.gameState = 'ended';
      const winner = this.players.find(p => p.isAlive);

      this.log(`🏆 游戏结束！${winner ? winner.character.name : '无人'} 获胜！`, 'system');

      const btnStart = document.getElementById('btn-start');
      const btnPause = document.getElementById('btn-pause');

      if (btnStart) {
        btnStart.textContent = '🔄 重新开始';
        btnStart.classList.remove('btn-danger');
        btnStart.classList.add('btn-primary');
      }
      if (btnPause) {
        btnPause.style.display = 'none';
      }

      const gameStatus = document.getElementById('game-status');
      if (gameStatus) {
        gameStatus.textContent = '游戏结束';
        gameStatus.style.background = '#e74c3c';
      }

      return true;
    }

    return false;
  }

  // ========== 日志系统 ==========

  log(message, type = 'normal') {
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const entry = `[${time}] ${message}`;

    this.logEntries.push({ text: entry, type });
    if (this.logEntries.length > 50) {
      this.logEntries.shift();
    }

    this.renderLog();
  }

  renderLog() {
    const logContent = document.getElementById('log-content');
    if (!logContent) return;

    logContent.innerHTML = this.logEntries.map(e =>
      `<div class="log-entry log-${e.type}">${e.text}</div>`
    ).join('');

    logContent.scrollTop = logContent.scrollHeight;
  }

  calculatePlayerPositions(count) {
    return Array.from({ length: count }, (_, i) => ({ x: i, y: 0 }));
  }
}
