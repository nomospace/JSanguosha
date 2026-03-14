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
    this.currentPhase = '';
    this.globalFilter = 'all';
    this.guideStep = 0;
    this.guideSteps = [
      '游戏开始时，每位玩家会获得 4 张初始手牌',
      '每个回合分为：摸牌阶段 → 出牌阶段 → 弃牌阶段',
      '摸牌阶段：自动摸 2 张牌',
      '出牌阶段：可以使用手牌进行攻击或装备',
      '弃牌阶段：手牌数不能超过体力值，多余的需要弃置'
    ];
  }

  cacheElements() {
    this.elements = {
      playersGrid: document.getElementById('players-grid'),
      turnDisplay: document.getElementById('turn-display'),
      phaseTag: document.getElementById('phase-tag'),
      gameStatus: document.getElementById('game-status'),
      deckRemaining: document.getElementById('deck-remaining'),
      discardPile: document.getElementById('discard-pile'),
      btnStart: document.getElementById('btn-start'),
      btnPause: document.getElementById('btn-pause'),
      logContent: document.getElementById('log-content'),
      logInner: document.getElementById('log-inner'),
      logToggle: document.getElementById('log-toggle'),
      logCount: document.getElementById('log-count'),
      buildTimestamp: document.getElementById('build-timestamp'),
      settingsPanel: document.getElementById('settings-panel'),
      pauseOverlay: document.getElementById('pause-overlay'),
      // 弹窗
      cardModal: document.getElementById('card-modal'),
      modalImage: document.getElementById('modal-image'),
      modalName: document.getElementById('modal-name'),
      modalSuit: document.getElementById('modal-suit'),
      modalDesc: document.getElementById('modal-desc'),
      confirmModal: document.getElementById('confirm-modal'),
      confirmTitle: document.getElementById('confirm-title'),
      confirmDesc: document.getElementById('confirm-desc'),
      confirmBtn: document.getElementById('confirm-btn'),
      // 引导
      guideOverlay: document.getElementById('guide-overlay'),
      guideText: document.getElementById('guide-text'),
      guideDots: document.getElementById('guide-dots'),
      guideNextBtn: document.getElementById('guide-next-btn')
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
    
    // 状态图标
    let statusHtml = '';
    if (player.judgeCards?.length > 0) {
      player.judgeCards.forEach(j => {
        if (j.key === 'lebusishu') statusHtml += '<span class="status-icon" title="乐不思蜀">🎭</span>';
        if (j.key === 'bingliangcunduan') statusHtml += '<span class="status-icon" title="兵粮寸断">🍚</span>';
        if (j.key === 'shandian') statusHtml += '<span class="status-icon" title="闪电">⚡</span>';
      });
    }
    
    card.innerHTML = `
      <span class="hand-badge" id="badge-${player.index}">${player.handCards?.length || 0}张</span>
      <div class="status-area">${statusHtml}</div>
      
      <div class="player-header">
        <div class="player-avatar">${initial}</div>
        <div class="player-info">
          <div class="player-name-row">
            <span class="player-name">${player.character.name}</span>
            <span class="kingdom-tag">${kingdom.name}</span>
          </div>
          <div class="player-skill" onclick="game.showSkillModal('${player.character.key}')">【${player.character.skill}】</div>
        </div>
      </div>
      
      <div class="hp-display" id="hp-${player.index}">${this.renderHP(player.hp, player.maxHp)}</div>
      <div class="equipment-bar" id="equip-${player.index}">${this.renderEquipment(player)}</div>
      
      <div class="hand-section">
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
    const isDiscardPhase = this.currentPhase === 'discard';
    
    return `
      <button class="quick-btn sha ${player.hasUsedSha ? '' : ''}" onclick="game.quickPlay('sha')" ${hasSha && !player.hasUsedSha ? '' : 'disabled'}>⚔️杀</button>
      <button class="quick-btn tao" onclick="game.quickPlay('tao')" ${hasTao && player.hp < player.maxHp ? '' : 'disabled'}>💚桃</button>
      <button class="quick-btn discard ${isDiscardPhase ? 'highlight' : ''}" onclick="game.quickDiscard()">🧹弃</button>
      <button class="quick-btn end" onclick="game.quickEndTurn()">▶️结</button>
    `;
  }

  renderHandCards(player, filterType = null) {
    const container = document.getElementById(`hand-${player.index}`);
    if (!container || !player.handCards) return;
    
    const filter = filterType || this.globalFilter;
    let cards = player.handCards;
    
    if (filter === 'equip') {
      cards = cards.filter(c => ['weapon', 'armor', 'defense_horse', 'offense_horse'].includes(c.type));
    } else if (filter !== 'all') {
      cards = cards.filter(c => c.type === filter);
    }
    
    container.innerHTML = cards.map((card, i) => {
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
    const actionsEl = document.getElementById(`actions-${player.index}`);
    const cardEl = document.getElementById(`player-${player.index}`);
    
    if (hpEl) hpEl.innerHTML = this.renderHP(player.hp, player.maxHp);
    if (badgeEl) badgeEl.textContent = `${player.handCards?.length || 0}张`;
    if (equipEl) equipEl.innerHTML = this.renderEquipment(player);
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

  setPhase(phase) {
    this.currentPhase = phase;
    const phaseNames = {
      'prepare': '准备阶段',
      'draw': '摸牌阶段',
      'play': '出牌阶段',
      'discard': '弃牌阶段',
      'end': '结束阶段'
    };
    
    if (phase && phaseNames[phase]) {
      this.elements.phaseTag.textContent = phaseNames[phase];
      this.elements.phaseTag.style.display = 'inline';
      this.elements.phaseTag.className = `phase-tag ${phase === 'discard' ? 'discard' : ''}`;
    } else {
      this.elements.phaseTag.style.display = 'none';
    }
    
    // 更新当前玩家的操作按钮
    const currentPlayer = this.game.players?.[this.game.currentPlayerIndex];
    if (currentPlayer) {
      this.updatePlayer(currentPlayer);
    }
  }

  highlightPlayer(player) {
    document.querySelectorAll('.player-card').forEach(el => el.classList.remove('active'));
    document.getElementById(`player-${player.index}`)?.classList.add('active');
  }

  // 弹窗
  showCardModal(cardKey, event) {
    const card = this.game.getCardData?.(cardKey);
    if (!card) return;
    
    const suit = SUITS[card.suit];
    
    this.elements.modalImage.src = getCardPlaceholder(cardKey);
    this.elements.modalName.textContent = card.name;
    this.elements.modalName.style.color = card.color;
    this.elements.modalSuit.textContent = `${suit.symbol} ${suit.name} · ${CARD_TYPES[card.type].name}`;
    this.elements.modalDesc.textContent = card.description;
    
    this.elements.cardModal.classList.add('show');
  }

  showSkillModal(characterKey) {
    const character = this.game.players?.find(p => p.character.key === characterKey)?.character;
    if (!character) return;
    
    this.elements.modalImage.src = '';
    this.elements.modalImage.style.background = KINGDOM_COLORS[character.kingdom].primary;
    this.elements.modalImage.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:48px;">${character.name.charAt(0)}</div>`;
    this.elements.modalName.textContent = `${character.name} · 【${character.skill}】`;
    this.elements.modalName.style.color = KINGDOM_COLORS[character.kingdom].primary;
    this.elements.modalSuit.textContent = KINGDOM_COLORS[character.kingdom].name;
    this.elements.modalDesc.textContent = character.description;
    
    this.elements.cardModal.classList.add('show');
  }

  closeModal(event) {
    if (!event || event.target === this.elements.cardModal) {
      this.elements.cardModal.classList.remove('show');
      this.elements.modalImage.innerHTML = '';
      this.elements.modalImage.style.background = '';
    }
  }

  // 确认弹窗
  showConfirm(title, desc, onConfirm) {
    this.elements.confirmTitle.textContent = title;
    this.elements.confirmDesc.textContent = desc;
    this.elements.confirmModal.classList.add('show');
    this._confirmCallback = onConfirm;
  }

  confirmAction() {
    this.elements.confirmModal.classList.remove('show');
    if (this._confirmCallback) {
      this._confirmCallback();
      this._confirmCallback = null;
    }
  }

  cancelConfirm() {
    this.elements.confirmModal.classList.remove('show');
    this._confirmCallback = null;
  }

  // 暂停
  showPauseOverlay() {
    this.elements.pauseOverlay.classList.add('show');
  }

  hidePauseOverlay() {
    this.elements.pauseOverlay.classList.remove('show');
  }

  // 日志
  addLog(message, type = 'normal') {
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = `[${time}] ${message}`;
    entry.title = `[${time}] ${message}`;
    
    this.elements.logInner.appendChild(entry);
    this.elements.logInner.scrollTop = this.elements.logInner.scrollHeight;
    
    while (this.elements.logInner.children.length > 50) {
      this.elements.logInner.removeChild(this.elements.logInner.firstChild);
    }
    
    // 更新日志数量
    this.elements.logCount.textContent = `(${this.elements.logInner.children.length})`;
  }

  clearLog() {
    this.elements.logInner.innerHTML = '';
    this.elements.logCount.textContent = '';
  }

  toggleLog() {
    this.logExpanded = !this.logExpanded;
    this.elements.logContent.classList.toggle('show', this.logExpanded);
    this.elements.logToggle.textContent = this.logExpanded ? '收起 ▲' : '展开 ▼';
  }

  // 全局筛选
  filterAllHands(type, element) {
    this.globalFilter = type;
    
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');
    
    this.game.players?.forEach(player => {
      this.renderHandCards(player, type);
    });
  }

  // 引导
  showGuide() {
    this.guideStep = 0;
    this.updateGuide();
    this.elements.guideOverlay.classList.add('show');
  }

  updateGuide() {
    this.elements.guideText.textContent = this.guideSteps[this.guideStep];
    
    // 更新进度点
    let dotsHtml = '';
    for (let i = 0; i < this.guideSteps.length; i++) {
      dotsHtml += `<span class="guide-dot ${i === this.guideStep ? 'active' : ''}"></span>`;
    }
    this.elements.guideDots.innerHTML = dotsHtml;
    
    // 更新按钮文字
    this.elements.guideNextBtn.textContent = this.guideStep === this.guideSteps.length - 1 ? '开始游戏' : '下一步';
  }

  nextGuide() {
    this.guideStep++;
    if (this.guideStep >= this.guideSteps.length) {
      this.skipGuide();
    } else {
      this.updateGuide();
    }
  }

  skipGuide() {
    this.elements.guideOverlay.classList.remove('show');
    localStorage.setItem('sanguosha_guide_shown', 'true');
  }

  shouldShowGuide() {
    return !localStorage.getItem('sanguosha_guide_shown');
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
}