/**
 * UI 渲染器 - 专业游戏界面
 */
import { KINGDOM_COLORS } from '../config/characters';
import { SUITS, CARD_TYPES, getCardPlaceholder } from '../config/cards';

export class Renderer {
  constructor(game) {
    this.game = game;
    this.elements = {};
    this.logExpanded = false;
    this.currentHandTab = 'all';
    this.cacheElements();
  }

  cacheElements() {
    this.elements = {
      playersGrid: document.getElementById('players-grid'),
      turnDisplay: document.getElementById('turn-display'),
      gameStatus: document.getElementById('game-status'),
      deckRemaining: document.getElementById('deck-remaining'),
      discardPile: document.getElementById('discard-pile'),
      btnStart: document.getElementById('btn-start'),
      btnPause: document.getElementById('btn-pause'),
      logContent: document.getElementById('log-content'),
      logToggle: document.getElementById('log-toggle'),
      buildTimestamp: document.getElementById('build-timestamp'),
      cardTooltip: document.getElementById('card-tooltip'),
      tooltipImage: document.getElementById('tooltip-image'),
      tooltipName: document.getElementById('tooltip-name'),
      tooltipSuit: document.getElementById('tooltip-suit'),
      tooltipDesc: document.getElementById('tooltip-desc'),
      settingsPanel: document.getElementById('settings-panel')
    };
  }

  renderPlayers(players) {
    this.elements.playersGrid.innerHTML = '';
    
    players.forEach((player, index) => {
      const card = this.createPlayerCard(player);
      player.element = card;
      this.elements.playersGrid.appendChild(card);
    });
  }

  createPlayerCard(player) {
    const card = document.createElement('div');
    card.className = `player-card`;
    card.id = `player-${player.index}`;
    
    const kingdom = KINGDOM_COLORS[player.character.kingdom];
    const avatarColors = {
      wei: '#3498db',
      shu: '#2ecc71', 
      wu: '#e74c3c',
      qun: '#f39c12'
    };
    const bgColor = avatarColors[player.character.kingdom] || '#666';
    const initial = player.character.name.charAt(0);
    
    card.innerHTML = `
      <div class="player-header">
        <div class="player-avatar" style="background: ${bgColor}">${initial}</div>
        <div class="player-info">
          <div class="player-name-row">
            <span class="player-name">${player.character.name}</span>
            <span class="kingdom-badge kingdom-${player.character.kingdom}">${kingdom.name}</span>
          </div>
          <div class="player-skill">【${player.character.skill}】</div>
        </div>
      </div>
      
      <div class="hp-display" id="hp-${player.index}">${this.renderHP(player.hp, player.maxHp)}</div>
      
      <div class="status-icons" id="status-${player.index}">${this.renderStatus(player)}</div>
      
      <div class="equipment-bar" id="equip-${player.index}">${this.renderEquipment(player)}</div>
      
      <div class="hand-section">
        <div class="hand-tabs" id="tabs-${player.index}">${this.renderHandTabs()}</div>
        <div class="hand-area">
          <span class="hand-count" id="cards-${player.index}">📦 ${player.handCards?.length || 0}</span>
          <div class="hand-cards" id="hand-${player.index}"></div>
        </div>
      </div>
      
      <div class="quick-actions" id="actions-${player.index}">
        ${this.renderQuickActions(player)}
      </div>
    `;
    
    return card;
  }

  renderHP(current, max) {
    return `<span class="hp-number">${current}</span><span class="hp-heart">❤️</span>`;
  }

  renderStatus(player) {
    const icons = [];
    
    // 判定区的牌
    if (player.judgeCards && player.judgeCards.length > 0) {
      player.judgeCards.forEach(j => {
        if (j.key === 'lebusishu') {
          icons.push('<span class="status-icon">🎭乐</span>');
        } else if (j.key === 'bingliang') {
          icons.push('<span class="status-icon">🍚粮</span>');
        } else if (j.key === 'shandian') {
          icons.push('<span class="status-icon">⚡闪</span>');
        }
      });
    }
    
    return icons.join('');
  }

  renderEquipment(player) {
    const eq = player.equipment || {};
    const parts = [];
    if (eq.weapon) parts.push(`<span class="equip-tag weapon">⚔️${eq.weapon.name}</span>`);
    if (eq.armor) parts.push(`<span class="equip-tag armor">🛡️${eq.armor.name}</span>`);
    if (eq.defenseHorse) parts.push(`<span class="equip-tag horse">🐴+1</span>`);
    if (eq.offenseHorse) parts.push(`<span class="equip-tag horse">🐴-1</span>`);
    return parts.join('');
  }

  renderHandTabs() {
    return `
      <span class="hand-tab active" data-tab="all" onclick="game.filterHand('all', this)">全部</span>
      <span class="hand-tab" data-tab="basic" onclick="game.filterHand('basic', this)">基本牌</span>
      <span class="hand-tab" data-tab="scroll" onclick="game.filterHand('scroll', this)">锦囊牌</span>
      <span class="hand-tab" data-tab="equip" onclick="game.filterHand('equip', this)">装备牌</span>
    `;
  }

  renderQuickActions(player) {
    const hasSha = player.handCards?.some(c => c.key === 'sha');
    const hasTao = player.handCards?.some(c => c.key === 'tao');
    const canEnd = true;
    
    return `
      <button class="quick-btn sha" onclick="game.quickPlay('sha')" ${hasSha ? '' : 'disabled'}>⚔️ 出杀</button>
      <button class="quick-btn tao" onclick="game.quickPlay('tao')" ${hasTao ? '' : 'disabled'}>💖 出桃</button>
      <button class="quick-btn discard" onclick="game.quickDiscard()">🧹 弃牌</button>
      <button class="quick-btn end" onclick="game.quickEndTurn()">▶️ 结束</button>
    `;
  }

  renderHandCards(player, filterType = 'all') {
    const container = document.getElementById(`hand-${player.index}`);
    if (!container || !player.handCards) return;
    
    let cards = player.handCards;
    if (filterType !== 'all') {
      if (filterType === 'equip') {
        cards = cards.filter(c => ['weapon', 'armor', 'defense_horse', 'offense_horse'].includes(c.type));
      } else {
        cards = cards.filter(c => c.type === filterType);
      }
    }
    
    container.innerHTML = cards.map((card, i) => {
      const suit = SUITS[card.suit] || SUITS.spade;
      const isDisabled = this.isCardDisabled(player, card);
      return `
        <div class="mini-card ${isDisabled ? 'disabled' : ''}" 
             style="--card-color:${card.color}"
             data-card-key="${card.key}"
             onmouseenter="game.showCardTooltip('${card.key}', event)"
             onmouseleave="game.hideCardTooltip()">
          <span class="mini-card-suit">${suit.symbol}</span>
          <span class="mini-card-name">${card.name}</span>
        </div>
      `;
    }).join('');
  }

  isCardDisabled(player, card) {
    // 如果被乐不思蜀，不能使用锦囊牌
    const hasLebu = player.judgeCards?.some(j => j.key === 'lebusishu');
    if (hasLebu && card.type === 'scroll') {
      return true;
    }
    return false;
  }

  updatePlayer(player) {
    const hpEl = document.getElementById(`hp-${player.index}`);
    const cardsEl = document.getElementById(`cards-${player.index}`);
    const equipEl = document.getElementById(`equip-${player.index}`);
    const statusEl = document.getElementById(`status-${player.index}`);
    const actionsEl = document.getElementById(`actions-${player.index}`);
    const cardEl = document.getElementById(`player-${player.index}`);
    
    if (hpEl) hpEl.innerHTML = this.renderHP(player.hp, player.maxHp);
    if (cardsEl) cardsEl.textContent = `📦 ${player.handCards?.length || 0}`;
    if (equipEl) equipEl.innerHTML = this.renderEquipment(player);
    if (statusEl) statusEl.innerHTML = this.renderStatus(player);
    if (actionsEl) actionsEl.innerHTML = this.renderQuickActions(player);
    
    this.renderHandCards(player, this.currentHandTab);
    
    if (cardEl) {
      cardEl.classList.toggle('dead', !player.isAlive);
      cardEl.classList.toggle('dying', player.hp === 1 && player.isAlive);
    }
  }

  updateUI(game) {
    const { turnCount, currentPlayerIndex, deck, gameState, players } = game;
    const currentPlayer = players?.[currentPlayerIndex];
    
    // 更新牌堆信息
    if (deck && typeof deck.getRemaining === 'function') {
      this.elements.deckRemaining.textContent = deck.getRemaining();
      this.elements.discardPile.textContent = deck.getDiscardCount();
    } else {
      this.elements.deckRemaining.textContent = '0';
      this.elements.discardPile.textContent = '0';
    }
    
    // 更新状态
    const statusEl = this.elements.gameStatus;
    statusEl.className = 'status-badge';
    
    if (gameState === 'playing' && currentPlayer) {
      this.elements.turnDisplay.textContent = `第 ${turnCount} 回合 · ${currentPlayer.character.name}`;
      statusEl.textContent = '对战中';
      statusEl.classList.add('status-playing');
    } else if (gameState === 'paused') {
      statusEl.textContent = '已暂停';
      statusEl.classList.add('status-paused');
    } else if (gameState === 'ended') {
      statusEl.textContent = '已结束';
      statusEl.classList.add('status-ended');
    } else {
      this.elements.turnDisplay.textContent = '准备开始';
      statusEl.textContent = '等待开始';
      statusEl.classList.add('status-waiting');
    }
  }

  highlightPlayer(player) {
    document.querySelectorAll('.player-card').forEach(el => {
      el.classList.remove('active');
    });
    const cardEl = document.getElementById(`player-${player.index}`);
    if (cardEl) {
      cardEl.classList.add('active');
    }
  }

  showCardTooltip(cardKey, event) {
    const card = this.game.getCardData?.(cardKey);
    if (!card) return;
    
    const suit = SUITS[card.suit];
    const placeholderUrl = getCardPlaceholder(cardKey);
    
    this.elements.tooltipImage.src = placeholderUrl;
    this.elements.tooltipName.textContent = card.name;
    this.elements.tooltipName.style.color = card.color;
    this.elements.tooltipSuit.textContent = `${suit.symbol} ${suit.name} · ${CARD_TYPES[card.type].name}`;
    this.elements.tooltipDesc.textContent = card.description;
    this.elements.cardTooltip.classList.add('show');
    
    this.updateTooltipPosition(event);
  }

  hideCardTooltip() {
    this.elements.cardTooltip.classList.remove('show');
  }

  updateTooltipPosition(event) {
    const x = event.clientX + 10;
    const y = event.clientY + 10;
    const rect = this.elements.cardTooltip.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 10;
    const maxY = window.innerHeight - rect.height - 10;
    
    this.elements.cardTooltip.style.left = Math.min(x, maxX) + 'px';
    this.elements.cardTooltip.style.top = Math.min(y, maxY) + 'px';
  }

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

  clearLog() {
    this.elements.logContent.innerHTML = '';
  }

  toggleLog() {
    this.logExpanded = !this.logExpanded;
    this.elements.logContent.classList.toggle('expanded', this.logExpanded);
    this.elements.logToggle.textContent = this.logExpanded ? '收起' : '展开';
  }

  filterHandCards(type) {
    this.currentHandTab = type;
  }

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

  updateButtons(gameState) {
    const { btnStart, btnPause } = this.elements;
    
    if (gameState === 'playing' || gameState === 'paused') {
      btnStart.textContent = '🔄 重新开始';
      btnStart.className = 'btn btn-danger';
      btnPause.style.display = 'flex';
      btnPause.textContent = gameState === 'paused' ? '▶️ 继续' : '⏸️ 暂停';
    } else {
      btnStart.textContent = '🎲 开始游戏';
      btnStart.className = 'btn btn-primary';
      btnPause.style.display = 'none';
    }
  }

  toggleSettings() {
    this.elements.settingsPanel.classList.toggle('open');
  }

  closeSettings() {
    this.elements.settingsPanel.classList.remove('open');
  }

  setTheme(theme) {
    document.body.classList.remove('light-mode', 'eye-care-mode');
    
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else if (theme === 'eye-care') {
      document.body.classList.add('eye-care-mode');
    }
    
    // 更新按钮状态
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }
}