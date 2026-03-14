/**
 * UI 渲染器 - 移动端优先的游戏界面
 */
import { KINGDOM_COLORS, getCharacterAvatar } from '../config/characters';
import { SUITS, CARD_TYPES, getCardPlaceholder } from '../config/cards';

export class Renderer {
  constructor(game) {
    this.game = game;
    this.elements = {};
    this.cacheElements();
  }

  // 缓存 DOM 元素
  cacheElements() {
    this.elements = {
      playersGrid: document.getElementById('players-grid'),
      turnDisplay: document.getElementById('turn-display'),
      gameStatus: document.getElementById('game-status'),
      deckCount: document.getElementById('deck-count'),
      discardCount: document.getElementById('discard-count'),
      deckRemaining: document.getElementById('deck-remaining'),
      discardPile: document.getElementById('discard-pile'),
      btnStart: document.getElementById('btn-start'),
      btnPause: document.getElementById('btn-pause'),
      logContent: document.getElementById('log-content'),
      buildTimestamp: document.getElementById('build-timestamp'),
      cardTooltip: document.getElementById('card-tooltip'),
      tooltipImage: document.getElementById('tooltip-image'),
      tooltipName: document.getElementById('tooltip-name'),
      tooltipSuit: document.getElementById('tooltip-suit'),
      tooltipDesc: document.getElementById('tooltip-desc')
    };
  }

  // 渲染所有玩家
  renderPlayers(players) {
    this.elements.playersGrid.innerHTML = '';
    
    players.forEach((player, index) => {
      const card = this.createPlayerCard(player);
      player.element = card;
      this.elements.playersGrid.appendChild(card);
    });
  }

  // 创建玩家卡片
  createPlayerCard(player) {
    const card = document.createElement('div');
    card.className = `player-card ${player.isAlive ? '' : 'dead'}`;
    card.id = `player-${player.index}`;
    
    const kingdom = KINGDOM_COLORS[player.character.kingdom];
    const avatarUrl = getCharacterAvatar(player.character.key);
    
    card.innerHTML = `
      <div class="player-header">
        <div class="player-avatar-wrap">
          <img src="${avatarUrl}" class="player-avatar" alt="${player.character.name}">
          <span class="player-kingdom" style="background:${kingdom.primary}">${kingdom.name}</span>
        </div>
        <div class="player-info">
          <span class="player-name kingdom-${player.character.kingdom}">${player.character.name}</span>
          <span class="player-skill-name">【${player.character.skill}】</span>
        </div>
      </div>
      <div class="player-hp" id="hp-${player.index}">${this.renderHP(player.hp, player.maxHp)}</div>
      <div class="player-equip" id="equip-${player.index}">${this.renderEquipment(player)}</div>
      <div class="player-hand-info">
        <span class="hand-count" id="cards-${player.index}">📦 ${player.handCards.length}</span>
      </div>
      <div class="hand-cards" id="hand-${player.index}"></div>
    `;
    
    return card;
  }

  // 渲染体力值
  renderHP(current, max) {
    let html = '<div class="hp-display">';
    for (let i = 0; i < max; i++) {
      if (i < current) {
        html += '<span class="hp-heart hp-full">❤️</span>';
      } else {
        html += '<span class="hp-heart hp-empty">🖤</span>';
      }
    }
    html += '</div>';
    return html;
  }

  // 渲染装备
  renderEquipment(player) {
    const eq = player.equipment;
    const parts = [];
    if (eq.weapon) parts.push(`<span class="eq-item eq-weapon">⚔️${eq.weapon.name}</span>`);
    if (eq.armor) parts.push(`<span class="eq-item eq-armor">🛡️${eq.armor.name}</span>`);
    if (eq.defenseHorse) parts.push(`<span class="eq-item eq-horse">🐴+</span>`);
    if (eq.offenseHorse) parts.push(`<span class="eq-item eq-horse">🐴-</span>`);
    return parts.join('');
  }

  // 渲染手牌
  renderHandCards(player) {
    const container = document.getElementById(`hand-${player.index}`);
    if (!container) return;
    
    container.innerHTML = player.handCards.map((card, i) => {
      const suit = SUITS[card.suit] || SUITS.spade;
      return `
        <div class="mini-card" 
             data-card-index="${i}"
             style="--card-color:${card.color}"
             onmouseenter="game.showCardTooltip('${card.key}', event)"
             onmouseleave="game.hideCardTooltip()">
          <span class="mini-card-suit">${suit.symbol}</span>
          <span class="mini-card-name">${card.name}</span>
        </div>
      `;
    }).join('');
  }

  // 更新单个玩家显示
  updatePlayer(player) {
    const hpEl = document.getElementById(`hp-${player.index}`);
    const cardsEl = document.getElementById(`cards-${player.index}`);
    const equipEl = document.getElementById(`equip-${player.index}`);
    const cardEl = document.getElementById(`player-${player.index}`);
    
    if (hpEl) hpEl.innerHTML = this.renderHP(player.hp, player.maxHp);
    if (cardsEl) cardsEl.textContent = `📦 ${player.handCards.length}`;
    if (equipEl) equipEl.innerHTML = this.renderEquipment(player);
    
    this.renderHandCards(player);
    
    if (cardEl) {
      cardEl.classList.toggle('dead', !player.isAlive);
    }
  }

  // 更新 UI
  updateUI(game) {
    const { turnCount, currentPlayerIndex, deck, gameState, players } = game;
    const currentPlayer = players[currentPlayerIndex];
    
    // 更新牌堆信息（安全检查）
    if (deck && typeof deck.getRemaining === 'function') {
      const remaining = deck.getRemaining();
      const discarded = deck.getDiscardCount();
      this.elements.deckCount.textContent = `牌堆:${remaining}`;
      this.elements.discardCount.textContent = `弃牌:${discarded}`;
      this.elements.deckRemaining.textContent = remaining;
      this.elements.discardPile.textContent = discarded;
    } else {
      this.elements.deckCount.textContent = `牌堆:0`;
      this.elements.discardCount.textContent = `弃牌:0`;
      this.elements.deckRemaining.textContent = '0';
      this.elements.discardPile.textContent = '0';
    }
    
    // 更新回合信息
    if (gameState === 'playing' && currentPlayer) {
      this.elements.turnDisplay.textContent = `第 ${turnCount} 回合`;
      this.elements.turnDisplay.style.color = '#f39c12';
      this.elements.gameStatus.textContent = '游戏中';
      this.elements.gameStatus.style.background = '#2ecc71';
    } else if (gameState === 'paused') {
      this.elements.gameStatus.textContent = '已暂停';
      this.elements.gameStatus.style.background = '#f39c12';
    } else if (gameState === 'ended') {
      this.elements.gameStatus.textContent = '游戏结束';
      this.elements.gameStatus.style.background = '#e74c3c';
    } else {
      this.elements.turnDisplay.textContent = '准备开始';
      this.elements.turnDisplay.style.color = '#fff';
      this.elements.gameStatus.textContent = '等待开始';
      this.elements.gameStatus.style.background = '#2ecc71';
    }
  }

  // 高亮当前玩家
  highlightPlayer(player) {
    document.querySelectorAll('.player-card').forEach(el => {
      el.classList.remove('active');
    });
    document.getElementById(`player-${player.index}`)?.classList.add('active');
  }

  // 显示卡牌提示
  showCardTooltip(cardKey, event) {
    const card = this.game.getCardData(cardKey);
    if (!card) return;
    
    const suit = SUITS[card.suit];
    const placeholderUrl = getCardPlaceholder(cardKey);
    
    this.elements.tooltipImage.src = placeholderUrl;
    this.elements.tooltipName.textContent = card.name;
    this.elements.tooltipName.style.color = card.color;
    this.elements.tooltipSuit.textContent = `${suit.symbol} ${suit.name} | ${CARD_TYPES[card.type].name}`;
    this.elements.tooltipDesc.textContent = card.description;
    this.elements.cardTooltip.classList.add('show');
    
    // 更新位置
    this.updateTooltipPosition(event);
  }

  // 隐藏卡牌提示
  hideCardTooltip() {
    this.elements.cardTooltip.classList.remove('show');
  }

  // 更新提示位置
  updateTooltipPosition(event) {
    const x = event.clientX + 10;
    const y = event.clientY + 10;
    const rect = this.elements.cardTooltip.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 10;
    const maxY = window.innerHeight - rect.height - 10;
    
    this.elements.cardTooltip.style.left = Math.min(x, maxX) + 'px';
    this.elements.cardTooltip.style.top = Math.min(y, maxY) + 'px';
  }

  // 添加日志
  addLog(message, type = 'normal') {
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = `[${time}] ${message}`;
    
    this.elements.logContent.appendChild(entry);
    this.elements.logContent.scrollTop = this.elements.logContent.scrollHeight;
    
    // 限制日志数量
    while (this.elements.logContent.children.length > 100) {
      this.elements.logContent.removeChild(this.elements.logContent.firstChild);
    }
  }

  // 清空日志
  clearLog() {
    this.elements.logContent.innerHTML = '';
  }

  // 显示构建时间
  showBuildTimestamp() {
    if (this.elements.buildTimestamp) {
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
      this.elements.buildTimestamp.textContent = `🕐 ${timeStr}`;
    }
  }

  // 更新按钮状态
  updateButtons(gameState) {
    const { btnStart, btnPause } = this.elements;
    
    if (gameState === 'playing' || gameState === 'paused') {
      btnStart.textContent = '🔄 重新开始';
      btnStart.classList.remove('btn-primary');
      btnStart.classList.add('btn-danger');
      btnPause.style.display = 'block';
      btnPause.textContent = gameState === 'paused' ? '▶️ 继续' : '⏸️ 暂停';
    } else {
      btnStart.textContent = '🎲 开始游戏';
      btnStart.classList.remove('btn-danger');
      btnStart.classList.add('btn-primary');
      btnPause.style.display = 'none';
    }
  }
}