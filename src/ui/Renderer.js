/**
 * UI 渲染器
 */
import { KINGDOM_COLORS } from '../config/characters';
import { SUITS, CARD_TYPES, getCardPlaceholder } from '../config/cards';

export class Renderer {
  constructor(game) {
    this.game = game;
    this.elements = {};
    this.logExpanded = false;
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
      settingsPanel: document.getElementById('settings-panel'),
      // 弹窗
      modalOverlay: document.getElementById('card-modal-overlay'),
      modalImage: document.getElementById('modal-image'),
      modalName: document.getElementById('modal-name'),
      modalSuit: document.getElementById('modal-suit'),
      modalDesc: document.getElementById('modal-desc')
    };
  }

  renderPlayers(players) {
    this.elements.playersGrid.innerHTML = '';
    players.forEach((player) => {
      const card = this.createPlayerCard(player);
      player.element = card;
      this.elements.playersGrid.appendChild(card);
    });
  }

  createPlayerCard(player) {
    const card = document.createElement('div');
    card.className = `player-card kingdom-${player.character.kingdom}`;
    card.id = `player-${player.index}`;
    
    const kingdom = KINGDOM_COLORS[player.character.kingdom];
    const initial = player.character.name.charAt(0);
    
    card.innerHTML = `
      <span class="hand-badge" id="badge-${player.index}">${player.handCards?.length || 0}张</span>
      
      <div class="player-header">
        <div class="player-avatar">${initial}</div>
        <div class="player-info">
          <div class="player-name-row">
            <span class="player-name">${player.character.name}</span>
            <span class="kingdom-tag">${kingdom.name}</span>
          </div>
          <div class="player-skill">【${player.character.skill}】</div>
        </div>
      </div>
      
      <div class="hp-display" id="hp-${player.index}">${this.renderHP(player.hp, player.maxHp)}</div>
      <div class="status-icons" id="status-${player.index}">${this.renderStatus(player)}</div>
      <div class="equipment-bar" id="equip-${player.index}">${this.renderEquipment(player)}</div>
      
      <div class="hand-section">
        <div class="hand-tabs" id="tabs-${player.index}">
          <span class="hand-tab active" onclick="game.filterHand('all', this)">全部</span>
          <span class="hand-tab" onclick="game.filterHand('basic', this)">基本</span>
          <span class="hand-tab" onclick="game.filterHand('scroll', this)">锦囊</span>
          <span class="hand-tab" onclick="game.filterHand('equip', this)">装备</span>
        </div>
        <div class="hand-cards" id="hand-${player.index}"></div>
      </div>
      
      <div class="quick-actions" id="actions-${player.index}">
        ${this.renderQuickActions(player)}
      </div>
    `;
    
    return card;
  }

  renderHP(current, max) {
    return `<span class="hp-number">${current}</span><span>❤️</span>`;
  }

  renderStatus(player) {
    const icons = [];
    if (player.judgeCards?.length > 0) {
      player.judgeCards.forEach(j => {
        if (j.key === 'lebusishu') icons.push('<span class="status-icon">🎭乐</span>');
        if (j.key === 'bingliangcunduan') icons.push('<span class="status-icon">🍚粮</span>');
        if (j.key === 'shandian') icons.push('<span class="status-icon">⚡闪</span>');
      });
    }
    return icons.join('');
  }

  renderEquipment(player) {
    const eq = player.equipment || {};
    const parts = [];
    if (eq.weapon) parts.push(`<span class="equip-tag">⚔${eq.weapon.name}</span>`);
    if (eq.armor) parts.push(`<span class="equip-tag">🛡${eq.armor.name}</span>`);
    if (eq.defenseHorse) parts.push(`<span class="equip-tag">🐴+</span>`);
    if (eq.offenseHorse) parts.push(`<span class="equip-tag">🐴-</span>`);
    return parts.join('');
  }

  renderQuickActions(player) {
    const hasSha = player.handCards?.some(c => c.key === 'sha');
    const hasTao = player.handCards?.some(c => c.key === 'tao');
    return `
      <button class="quick-btn sha" onclick="game.quickPlay('sha')" ${hasSha ? '' : 'disabled'}>⚔️杀</button>
      <button class="quick-btn tao" onclick="game.quickPlay('tao')" ${hasTao ? '' : 'disabled'}>💚桃</button>
      <button class="quick-btn discard" onclick="game.quickDiscard()">🧹弃</button>
      <button class="quick-btn end" onclick="game.quickEndTurn()">▶️结</button>
    `;
  }

  renderHandCards(player, filterType = 'all') {
    const container = document.getElementById(`hand-${player.index}`);
    if (!container || !player.handCards) return;
    
    let cards = player.handCards;
    if (filterType === 'equip') {
      cards = cards.filter(c => ['weapon', 'armor', 'defense_horse', 'offense_horse'].includes(c.type));
    } else if (filterType !== 'all') {
      cards = cards.filter(c => c.type === filterType);
    }
    
    container.innerHTML = cards.map((card) => {
      const suit = SUITS[card.suit];
      const disabled = this.isCardDisabled(player, card);
      return `
        <div class="mini-card ${disabled ? 'disabled' : ''}" 
             style="--card-color:${card.color}"
             onclick="game.showCardModal('${card.key}', event)">
          <span class="mini-card-suit">${suit.symbol}</span>
          <span class="mini-card-name">${card.name}</span>
        </div>
      `;
    }).join('');
  }

  isCardDisabled(player, card) {
    const hasLebu = player.judgeCards?.some(j => j.key === 'lebusishu');
    return hasLebu && card.type === 'scroll';
  }

  updatePlayer(player) {
    const hpEl = document.getElementById(`hp-${player.index}`);
    const badgeEl = document.getElementById(`badge-${player.index}`);
    const equipEl = document.getElementById(`equip-${player.index}`);
    const statusEl = document.getElementById(`status-${player.index}`);
    const actionsEl = document.getElementById(`actions-${player.index}`);
    const cardEl = document.getElementById(`player-${player.index}`);
    
    if (hpEl) hpEl.innerHTML = this.renderHP(player.hp, player.maxHp);
    if (badgeEl) badgeEl.textContent = `${player.handCards?.length || 0}张`;
    if (equipEl) equipEl.innerHTML = this.renderEquipment(player);
    if (statusEl) statusEl.innerHTML = this.renderStatus(player);
    if (actionsEl) actionsEl.innerHTML = this.renderQuickActions(player);
    
    this.renderHandCards(player);
    
    if (cardEl) {
      cardEl.classList.toggle('dead', !player.isAlive);
      cardEl.classList.toggle('dying', player.hp === 1 && player.isAlive);
    }
  }

  updateUI(game) {
    const { turnCount, currentPlayerIndex, deck, gameState, players } = game;
    const currentPlayer = players?.[currentPlayerIndex];
    
    if (deck && typeof deck.getRemaining === 'function') {
      this.elements.deckRemaining.textContent = deck.getRemaining();
      this.elements.discardPile.textContent = deck.getDiscardCount();
    }
    
    const statusEl = this.elements.gameStatus;
    statusEl.className = 'status-badge';
    
    if (gameState === 'playing' && currentPlayer) {
      this.elements.turnDisplay.textContent = `第${turnCount}回合 · ${currentPlayer.character.name}`;
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
      statusEl.textContent = '等待';
      statusEl.classList.add('status-waiting');
    }
  }

  highlightPlayer(player) {
    document.querySelectorAll('.player-card').forEach(el => el.classList.remove('active'));
    document.getElementById(`player-${player.index}`)?.classList.add('active');
  }

  // 弹窗显示
  showCardModal(cardKey, event) {
    const card = this.game.getCardData?.(cardKey);
    if (!card) return;
    
    const suit = SUITS[card.suit];
    
    this.elements.modalImage.src = getCardPlaceholder(cardKey);
    this.elements.modalName.textContent = card.name;
    this.elements.modalName.style.color = card.color;
    this.elements.modalSuit.textContent = `${suit.symbol} ${suit.name} · ${CARD_TYPES[card.type].name}`;
    this.elements.modalDesc.textContent = card.description;
    
    this.elements.modalOverlay.classList.add('show');
  }

  closeModal(event) {
    if (!event || event.target === this.elements.modalOverlay) {
      this.elements.modalOverlay.classList.remove('show');
    }
  }

  addLog(message, type = 'normal') {
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = `[${time}] ${message}`;
    
    this.elements.logContent.appendChild(entry);
    this.elements.logContent.scrollTop = this.elements.logContent.scrollHeight;
    
    while (this.elements.logContent.children.length > 50) {
      this.elements.logContent.removeChild(this.elements.logContent.firstChild);
    }
  }

  clearLog() {
    this.elements.logContent.innerHTML = '';
  }

  toggleLog() {
    this.logExpanded = !this.logExpanded;
    this.elements.logContent.classList.toggle('expanded', this.logExpanded);
    this.elements.logToggle.textContent = this.logExpanded ? '收起 ▲' : '展开 ▼';
  }

  showBuildTimestamp() {
    if (this.elements.buildTimestamp) {
      const now = new Date();
      this.elements.buildTimestamp.textContent = now.toLocaleString('zh-CN', {
        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
      });
    }
  }

  updateButtons(gameState) {
    const { btnStart, btnPause } = this.elements;
    
    if (gameState === 'playing' || gameState === 'paused') {
      btnStart.textContent = '🔄 重新开始';
      btnStart.className = 'btn btn-danger';
      btnPause.style.display = 'block';
      btnPause.textContent = gameState === 'paused' ? '▶️' : '⏸️';
    } else {
      btnStart.textContent = '🎲 开始游戏';
      btnStart.className = 'btn btn-primary';
      btnPause.style.display = 'none';
    }
  }

  toggleSettings() {
    this.elements.settingsPanel.classList.toggle('open');
  }

  setTheme(theme) {
    document.body.style.filter = theme === 'eye-care' ? 'sepia(30%)' : 'none';
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.includes(theme === 'dark' ? '深色' : theme === 'light' ? '浅色' : '护眼'));
    });
  }
}