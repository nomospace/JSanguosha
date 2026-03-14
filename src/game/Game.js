import { CHARACTERS, KINGDOM_COLORS, getCharacterAvatar } from '../config/characters';
import { CARDS, SUITS, CARD_TYPES, getCardImage, getCardPlaceholder } from '../config/cards';
import { 
  calculateDistance, canAttack, getAttackRange,
  equipWeapon, equipArmor, equipDefenseHorse, equipOffenseHorse,
  canUseShan, useShan, canUseTao, useTao,
  checkSkillTrigger, judge, checkJudgeResult,
  isDying, checkGameOver
} from './Logic';

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
    this.delayedTraps = []; // 延时锦囊
    this.judgeDeck = []; // 判定牌堆
  }

  init() {
    this.renderPlayers();
    this.updateUI();
    this.initTooltip();
    this.showBuildTimestamp();
    this.log('🎮 欢迎来到三国杀 Mini！', 'system');
    this.log('点击"开始游戏"按钮开始对战', 'system');
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

    document.addEventListener('mousemove', (e) => {
      if (this.tooltip.el.classList.contains('show')) {
        const x = e.clientX + 15;
        const y = e.clientY + 15;
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
        element: null,
        equipment: {},
        hasUsedSha: false,
        isZhiji: false
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
      <div class="player-equipment" id="equip-${player.index}" style="margin-top:8px;font-size:12px;color:#95a5a6;"></div>
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
    const equipEl = document.getElementById(`equip-${player.index}`);

    if (hpEl) hpEl.innerHTML = this.renderHP(player.hp, player.maxHp);
    if (cardsEl) cardsEl.textContent = `📦 ${player.handCards.length} 张手牌`;

    // 显示装备
    if (equipEl) {
      const equip = player.equipment || {};
      const parts = [];
      if (equip.weapon) parts.push(`⚔️${equip.weapon.name}`);
      if (equip.armor) parts.push(`🛡️${equip.armor.name}`);
      if (equip.defenseHorse) parts.push(`🐴+1 马`);
      if (equip.offenseHorse) parts.push(`🐴-1 马`);
      equipEl.textContent = parts.length > 0 ? parts.join(' ') : '';
    }

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
    this.delayedTraps = [];
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
      } else if (this.discardPile.length > 0) {
        // 牌堆空了，洗入弃牌堆
        this.log('🔄 牌堆已空，洗入弃牌堆', 'system');
        this.deck = [...this.discardPile];
        this.discardPile = [];
        this.shuffleDeck();
        const card = this.deck.pop();
        player.handCards.push(card);
      }
    }
    this.updatePlayerDisplay(player);
    this.updateUI();
  }

  startGame() {
    if (this.gameState === 'playing') {
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
    this.delayedTraps = [];
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

    // 处理延时锦囊
    this.processDelayedTraps(player);

    this.turnCount++;
    this.log(`========== 第 ${this.turnCount} 回合 - ${player.character.name} ==========`, 'turn');
    
    player.hasUsedSha = false;
    player.isZhiji = false;

    // 准备阶段
    this.log(`🌅 准备阶段`, 'phase');
    this.checkPrepareSkills(player);

    // 摸牌阶段
    this.log(`📦 摸牌阶段`, 'phase');
    this.drawCardsPhase(player);

    setTimeout(() => {
      this.log(`🎯 出牌阶段`, 'phase');
      this.playPhase(player);
    }, 800);
  }

  // 准备阶段技能
  checkPrepareSkills(player) {
    const result = checkSkillTrigger(player, 'prepare', {});
    if (result.triggered && result.skill === '洛神') {
      this.log(`🌙 ${player.character.name} 发动【洛神】`, 'skill');
      let blackCount = 0;
      while (this.deck.length > 0) {
        const result = judge();
        this.log(`判定：${result.suitSymbol}${result.suitName} ${result.number}`, 'normal');
        if (result.isBlack) {
          blackCount++;
          this.drawCard(player, 1);
          this.log(`黑色，获得此牌（共${blackCount}张）`, 'skill');
          if (Math.random() > 0.7) break; // 简化：70% 概率继续
        } else {
          this.log(`红色，洛神结束`, 'skill');
          break;
        }
      }
    }
  }

  // 摸牌阶段
  drawCardsPhase(player) {
    // 检查兵粮寸断
    const bingliang = this.delayedTraps.find(t => t.target === player && t.type === 'bingliang');
    if (bingliang) {
      const result = judge();
      this.log(`🍚 兵粮寸断判定：${result.suitSymbol}${result.suitName} ${result.number}`, 'normal');
      if (result.suit === 'club') {
        this.log(`梅花，跳过摸牌阶段`, 'skill');
        return;
      }
      this.removeDelayedTrap(player, 'bingliang');
    }

    // 正常摸牌
    const skillResult = checkSkillTrigger(player, 'mopai', {});
    let drawCount = 2;
    if (skillResult.triggered && skillResult.effect === 'draw_less') {
      drawCount = 1; // 裸衣
    }
    this.drawCard(player, drawCount);
    this.log(`摸了 ${drawCount} 张牌`, 'draw');
  }

  // 出牌阶段
  playPhase(player) {
    if (player.handCards.length === 0 || !player.isAlive) {
      this.endTurn();
      return;
    }

    // AI 出牌逻辑
    this.aiPlayCards(player);
  }

  aiPlayCards(player) {
    const maxPlays = 10; // 防止无限循环
    let plays = 0;

    const playInterval = setInterval(() => {
      if (plays >= maxPlays || !player.isAlive || player.handCards.length === 0) {
        clearInterval(playInterval);
        this.endTurn();
        return;
      }

      const played = this.aiPlayOneCard(player);
      if (!played) {
        clearInterval(playInterval);
        this.endTurn();
      }
      plays++;
    }, 600);
  }

  aiPlayOneCard(player) {
    // 1. 优先使用装备
    const equipCardIndex = player.handCards.findIndex(card => 
      ['weapon', 'armor', 'defense_horse', 'offense_horse'].includes(card.type)
    );
    if (equipCardIndex !== -1) {
      const card = player.handCards[equipCardIndex];
      this.equipCard(player, card, equipCardIndex);
      return true;
    }

    // 2. 使用桃
    if (player.hp < player.maxHp) {
      const taoIndex = player.handCards.findIndex(card => card.key === 'tao');
      if (taoIndex !== -1) {
        this.useTaoCard(player, taoIndex);
        return true;
      }
    }

    // 3. 使用杀
    if (!player.hasUsedSha) {
      const shaIndex = player.handCards.findIndex(card => card.key === 'sha');
      if (shaIndex !== -1) {
        const target = this.findValidTarget(player);
        if (target) {
          this.useShaCard(player, target, shaIndex);
          return true;
        }
      }
    }

    // 4. 使用锦囊
    const scrollCardIndex = player.handCards.findIndex(card => card.type === 'scroll');
    if (scrollCardIndex !== -1) {
      const card = player.handCards[scrollCardIndex];
      this.useScrollCard(player, card, scrollCardIndex);
      return true;
    }

    return false;
  }

  findValidTarget(source) {
    for (const player of this.players) {
      if (player !== source && player.isAlive && canAttack(source, player, this.players)) {
        return player;
      }
    }
    return null;
  }

  equipCard(player, card, cardIndex) {
    let oldEquip = null;
    
    switch (card.type) {
      case 'weapon':
        oldEquip = equipWeapon(player, card);
        this.log(`⚔️ ${player.character.name} 装备【${card.name}】`, 'play');
        break;
      case 'armor':
        oldEquip = equipArmor(player, card);
        this.log(`🛡️ ${player.character.name} 装备【${card.name}】`, 'play');
        break;
      case 'defense_horse':
        oldEquip = equipDefenseHorse(player, card);
        this.log(`🐴 ${player.character.name} 装备【${card.name}】`, 'play');
        break;
      case 'offense_horse':
        oldEquip = equipOffenseHorse(player, card);
        this.log(`🐴 ${player.character.name} 装备【${card.name}】`, 'play');
        break;
    }

    player.handCards.splice(cardIndex, 1);
    this.discardPile.push(card);
    
    if (oldEquip) {
      this.discardPile.push(oldEquip);
    }

    this.updatePlayerDisplay(player);
    this.updateUI();
  }

  useTaoCard(player, cardIndex) {
    player.handCards.splice(cardIndex, 1);
    player.hp = Math.min(player.maxHp, player.hp + 1);
    this.discardPile.push({ key: 'tao', name: '桃' });
    this.log(`❤️ ${player.character.name} 使用【桃】回复 1 点体力`, 'heal');
    this.updatePlayerDisplay(player);
    this.updateUI();
  }

  useShaCard(player, target, cardIndex) {
    const card = player.handCards[cardIndex];
    player.handCards.splice(cardIndex, 1);
    player.hasUsedSha = true;

    this.log(`⚔️ ${player.character.name} 对 ${target.character.name} 使用【杀】`, 'play');

    // 检查无双
    const wushuang = checkSkillTrigger(target, 'use_juedou', {});
    const needShanCount = wushuang.triggered ? 2 : 1;

    setTimeout(() => {
      // 目标出闪
      let shanUsed = 0;
      for (let i = 0; i < needShanCount; i++) {
        if (canUseShan(target)) {
          const shan = useShan(target);
          if (shan) {
            shanUsed++;
            target.discardPile = target.discardPile || [];
            target.discardPile.push(shan);
            this.log(`🛡️ ${target.character.name} 使用【闪】`, 'normal');
          }
        }
      }

      if (shanUsed < needShanCount) {
        // 造成伤害
        let damage = 1;
        
        // 酒
        if (player.isZhiji) damage++;
        
        // 古锭刀 + 酒 + 藤甲
        if (player.equipment?.weapon?.key === 'hanbing' && target.equipment?.armor?.key === 'tengjia') {
          damage++;
        }

        target.hp = Math.max(0, target.hp - damage);
        this.log(`💥 造成 ${damage} 点伤害`, 'play');
        this.updatePlayerDisplay(target);

        if (target.hp <= 0) {
          this.handleDeath(target, player);
        }

        // 技能触发
        const skillResult = checkSkillTrigger(player, 'damaged', { card, target });
        if (skillResult.triggered) {
          this.log(`✨ ${player.character.name} 发动【${skillResult.skill}】`, 'skill');
        }
      }

      this.discardPile.push(card);
      this.updateUI();
    }, 500);
  }

  useScrollCard(player, card, cardIndex) {
    // 简化处理：大部分锦囊造成伤害
    const target = this.findValidTarget(player);
    if (!target) {
      player.handCards.splice(cardIndex, 1);
      this.discardPile.push(card);
      this.updatePlayerDisplay(player);
      return;
    }

    player.handCards.splice(cardIndex, 1);
    this.discardPile.push(card);

    switch (card.key) {
      case 'wuzhong':
        this.log(`📜 ${player.character.name} 使用【无中生有】`, 'play');
        this.drawCard(player, 2);
        this.log(`摸了 2 张牌`, 'draw');
        break;
      
      case 'juedou':
        this.log(`⚔️ ${player.character.name} 对 ${target.character.name} 使用【决斗】`, 'play');
        this.resolveJuedou(player, target);
        break;
      
      case 'shunshou':
      case 'guoheshuang':
        if (target.handCards.length > 0) {
          const stealIndex = Math.floor(Math.random() * target.handCards.length);
          const stolenCard = target.handCards.splice(stealIndex, 1)[0];
          player.handCards.push(stolenCard);
          this.log(`📜 ${player.character.name} 使用【${card.name}】获得 ${target.character.name} 的【${stolenCard.name}】`, 'play');
          this.updatePlayerDisplay(player);
          this.updatePlayerDisplay(target);
        }
        break;
      
      case 'nanman':
      case 'wanjian':
        this.log(`📜 ${player.character.name} 使用【${card.name}】`, 'play');
        this.resolveAOE(player, card);
        break;
      
      default:
        // 其他锦囊简化为造成 1 点伤害
        this.log(`📜 ${player.character.name} 使用【${card.name}】对 ${target.character.name}`, 'play');
        target.hp = Math.max(0, target.hp - 1);
        this.updatePlayerDisplay(target);
        if (target.hp <= 0) {
          this.handleDeath(target, player);
        }
    }

    this.updateUI();
  }

  resolveJuedou(source, target) {
    // 简化决斗逻辑
    const sourceSha = source.handCards.some(c => c.key === 'sha');
    const targetSha = target.handCards.some(c => c.key === 'sha');

    if (sourceSha && !targetSha) {
      target.hp = Math.max(0, target.hp - 1);
      this.log(`💥 ${target.character.name} 没有【杀】，受到 1 点伤害`, 'play');
      this.updatePlayerDisplay(target);
      if (target.hp <= 0) this.handleDeath(target, source);
    } else if (!sourceSha && targetSha) {
      source.hp = Math.max(0, source.hp - 1);
      this.log(`💥 ${source.character.name} 没有【杀】，受到 1 点伤害`, 'play');
      this.updatePlayerDisplay(source);
      if (source.hp <= 0) this.handleDeath(source, target);
    } else {
      this.log(`🤝 双方都有【杀】，平局`, 'normal');
    }

    this.updateUI();
  }

  resolveAOE(source, card) {
    const isNanman = card.key === 'nanman';
    const requiredCard = isNanman ? 'sha' : 'shan';
    const cardName = isNanman ? '杀' : '闪';

    this.players.forEach(player => {
      if (player !== source && player.isAlive) {
        const hasCard = player.handCards.some(c => c.key === requiredCard);
        if (hasCard) {
          const index = player.handCards.findIndex(c => c.key === requiredCard);
          player.handCards.splice(index, 1);
          this.discardPile.push({ key: requiredCard, name: cardName });
          this.log(`🛡️ ${player.character.name} 打出【${cardName}】`, 'normal');
        } else {
          player.hp = Math.max(0, player.hp - 1);
          this.log(`💥 ${player.character.name} 受到 1 点伤害`, 'play');
          this.updatePlayerDisplay(player);
          if (player.hp <= 0) this.handleDeath(player, source);
        }
      }
    });

    this.updateUI();
  }

  handleDeath(player, killer) {
    player.isAlive = false;
    this.log(`💀 ${player.character.name} 阵亡！`, 'death');

    // 奖惩
    if (killer && player.character.kingdom !== killer.character.kingdom) {
      this.log(`🎁 ${killer.character.name} 击杀 ${player.character.name}，摸 3 张牌`, 'skill');
      this.drawCard(killer, 3);
    }

    this.updatePlayerDisplay(player);
  }

  processDelayedTraps(player) {
    // 乐不思蜀
    const lebusishu = this.delayedTraps.find(t => t.target === player && t.type === 'lebusishu');
    if (lebusishu) {
      const result = judge();
      this.log(`🎭 乐不思蜀判定：${result.suitSymbol}${result.suitName} ${result.number}`, 'normal');
      if (result.suit === 'heart') {
        this.log(`红桃，乐不思蜀无效`, 'skill');
      } else {
        this.log(`非红桃，跳过出牌阶段`, 'skill');
        player.skipPlayPhase = true;
      }
      this.removeDelayedTrap(player, 'lebusishu');
    }

    // 闪电
    const shandian = this.delayedTraps.find(t => t.target === player && t.type === 'shandian');
    if (shandian) {
      const result = judge();
      this.log(`⚡ 闪电判定：${result.suitSymbol}${result.suitName} ${result.number}`, 'normal');
      if (result.suit === 'spade' && result.number >= 2 && result.number <= 9) {
        player.hp = Math.max(0, player.hp - 3);
        this.log(`⚡ 黑桃 2-9，受到 3 点雷电伤害！`, 'death');
        this.updatePlayerDisplay(player);
        if (player.hp <= 0) this.handleDeath(player, null);
      } else {
        // 移动到下家
        const nextIndex = (player.index + 1) % this.players.length;
        const nextPlayer = this.players[nextIndex];
        shandian.target = nextPlayer;
        this.log(`⚡ 闪电移动到 ${nextPlayer.character.name}`, 'normal');
      }
      this.removeDelayedTrap(player, 'shandian');
    }
  }

  removeDelayedTrap(player, type) {
    this.delayedTraps = this.delayedTraps.filter(t => !(t.target === player && t.type === type));
  }

  endTurn() {
    const player = this.players[this.currentPlayerIndex];
    this.log(`✅ 回合结束`, 'system');

    // 结束阶段技能
    const skillResult = checkSkillTrigger(player, 'end_phase', {});
    if (skillResult.triggered && skillResult.effect === 'draw_one') {
      this.log(`🌙 ${player.character.name} 发动【${skillResult.skill}】摸 1 张牌`, 'skill');
      this.drawCard(player, 1);
    }

    // 弃牌阶段
    const maxCards = player.hp * 2;
    if (player.handCards.length > maxCards) {
      const discardCount = player.handCards.length - maxCards;
      this.log(`🗑️ 弃牌阶段，弃置 ${discardCount} 张牌`, 'phase');
      player.handCards.splice(0, discardCount); // 简化：弃置前几张
      this.updatePlayerDisplay(player);
    }

    this.updateUI();

    setTimeout(() => {
      this.nextTurn();
    }, 800);
  }

  nextTurn() {
    const gameOver = checkGameOver(this.players);
    if (gameOver.over) {
      this.gameState = 'ended';
      this.log(`🏆 游戏结束！${gameOver.winner ? gameOver.winner.character.name : '无人'} 获胜！`, 'system');

      const btnStart = document.getElementById('btn-start');
      const btnPause = document.getElementById('btn-pause');

      if (btnStart) {
        btnStart.textContent = '🔄 重新开始';
        btnStart.classList.remove('btn-danger');
        btnStart.classList.add('btn-primary');
      }
      if (btnPause) btnPause.style.display = 'none';

      const gameStatus = document.getElementById('game-status');
      if (gameStatus) {
        gameStatus.textContent = '游戏结束';
        gameStatus.style.background = '#e74c3c';
      }
      return;
    }

    do {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    } while (!this.players[this.currentPlayerIndex].isAlive);

    this.startTurn();
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

  calculatePlayerPositions(count) {
    return Array.from({ length: count }, (_, i) => ({ x: i, y: 0 }));
  }
}
