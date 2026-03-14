import Phaser from 'phaser';
import { CHARACTERS, KINGDOM_COLORS } from '../config/characters';
import { CARDS, SUITS, CARD_TYPES } from '../config/cards';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.playerCount = data.playerCount || 4;
    this.players = [];
    this.deck = [];
    this.discardPile = [];
    this.currentPlayerIndex = 0;
    this.turnCount = 0;
    this.gameState = 'waiting'; // waiting, playing, paused, ended
    this.selectedCard = null;
    this.isPaused = false;
  }

  create() {
    const { width, height } = this.scale;

    // ========== 背景 ==========
    this.createBackground(width, height);

    // ========== UI 层 ==========
    this.createUI(width, height);
    this.createControlButtons(width, height);

    // ========== 初始化游戏 ==========
    this.initGame();

    // ========== 创建玩家 ==========
    this.createPlayers();

    // ========== 发初始手牌 ==========
    this.dealInitialCards();

    // ========== 游戏日志 ==========
    this.logSystem = this.createLogSystem();
    this.log('🎮 欢迎来到 JSanguosha！', 'system');
    this.log('点击"开始游戏"按钮开始对战', 'system');
  }

  createBackground(width, height) {
    // 游戏桌背景
    const bg = this.add.rectangle(0, 0, width, height, 0x16213e);
    bg.setOrigin(0);

    // 桌面纹理（渐变）
    const table = this.add.rectangle(width / 2, height / 2, width * 0.9, height * 0.7, 0x1a1a2e);
    table.setStrokeStyle(4, 0xf39c12);

    // 装饰性光晕
    const glow = this.add.circle(width / 2, height / 2, 300, 0xf39c12, 0.1);
  }

  createUI(width, height) {
    // 顶部信息栏
    const infoBar = this.add.rectangle(width / 2, 40, width, 60, 0x000000, 0.5);
    infoBar.setOrigin(0.5);

    // 游戏标题
    this.titleText = this.add.text(20, 40, '🦞 JSanguosha', {
      font: 'bold 28px Microsoft YaHei',
      color: '#f39c12'
    }).setOrigin(0, 0.5);

    // 回合显示
    this.turnText = this.add.text(250, 40, '准备开始', {
      font: 'bold 22px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0, 0.5);

    // 牌堆信息
    this.deckText = this.add.text(width - 300, 40, '牌堆：0', {
      font: '20px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(1, 0.5);

    // 弃牌堆信息
    this.discardText = this.add.text(width - 150, 40, '弃牌：0', {
      font: '20px Microsoft YaHei',
      color: '#95a5a6'
    }).setOrigin(1, 0.5);

    // 游戏状态显示
    this.statusText = this.add.text(width / 2, 80, '等待开始', {
      font: 'bold 20px Microsoft YaHei',
      color: '#2ecc71',
      backgroundColor: '#00000080',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
  }

  createControlButtons(width, height) {
    const buttonY = height - 40;
    const buttonSpacing = 180;
    const startX = width / 2 - buttonSpacing;

    // 开始游戏按钮
    this.startButton = this.createButton(
      startX,
      buttonY,
      '🎲 开始游戏',
      0xf39c12,
      () => this.startGame()
    );

    // 暂停/继续按钮
    this.pauseButton = this.createButton(
      startX + buttonSpacing,
      buttonY,
      '⏸️ 暂停',
      0xe67e22,
      () => this.togglePause()
    );
    this.pauseButton.setVisible(false);

    // 返回按钮
    this.backButton = this.createButton(
      startX + buttonSpacing * 2,
      buttonY,
      '↩️ 返回',
      0x95a5a6,
      () => this.backToMenu()
    );
  }

  createButton(x, y, text, color, callback) {
    const button = this.add.container(x, y);

    // 按钮背景
    const bg = this.add.roundRect(-75, -25, 150, 50, 8, color);
    bg.setInteractive({ useHandCursor: true });
    bg.setStrokeStyle(2, 0xffffff);

    // 按钮文字
    const label = this.add.text(0, 0, text, {
      font: 'bold 20px Microsoft YaHei',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    button.add([bg, label]);

    // 悬停效果
    bg.on('pointerover', () => {
      bg.setFillStyle(Phaser.Display.Color.GetColor(
        Phaser.Display.Color.RgbToComponent(color, 'r') + 30,
        Phaser.Display.Color.RgbToComponent(color, 'g') + 30,
        Phaser.Display.Color.RgbToComponent(color, 'b') + 30
      ));
      this.tweens.add({
        targets: button,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100
      });
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(color);
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });

    // 点击事件
    bg.on('pointerdown', () => {
      this.tweens.add({
        targets: button,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        onComplete: () => {
          if (this.gameState !== 'paused' || callback.toString().includes('togglePause')) {
            callback();
          }
        }
      });
    });

    return button;
  }

  createPlayers() {
    const { width, height } = this.scale;
    const positions = this.calculatePlayerPositions(this.playerCount, width, height);

    positions.forEach((pos, index) => {
      const player = this.createPlayerAvatar(pos.x, pos.y, index);
      this.players.push(player);
    });
  }

  calculatePlayerPositions(count, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    const positions = [];
    const angleStep = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2;
      positions.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      });
    }

    return positions;
  }

  createPlayerAvatar(x, y, index) {
    const container = this.add.container(x, y);

    // 随机分配武将
    const character = CHARACTERS[index % CHARACTERS.length];
    const kingdom = KINGDOM_COLORS[character.kingdom];

    // 头像框（势力颜色）
    const frame = this.add.circle(0, 0, 65, kingdom.primary);
    frame.setStrokeStyle(4, 0xffffff);

    // 武将头像（使用 DiceBear API）
    const avatarBg = this.add.circle(0, 0, 60, 0xffffff);
    
    // 加载头像图片
    const avatarImage = this.add.image(0, 0, 'avatar_default');
    avatarImage.setDisplaySize(110, 110);

    // 势力标识
    const kingdomText = this.add.text(-50, -50, kingdom.name, {
      font: 'bold 16px Microsoft YaHei',
      color: '#ffffff',
      backgroundColor: kingdom.primary,
      padding: { x: 8, y: 4 }
    }).setOrigin(0);

    // 武将名称
    const nameText = this.add.text(0, 75, character.name, {
      font: 'bold 18px Microsoft YaHei',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // 技能描述
    const skillText = this.add.text(0, 95, `[${character.skill}] ${character.description}`, {
      font: '12px Microsoft YaHei',
      color: '#f39c12',
      wordWrap: { width: 140 },
      align: 'center',
      backgroundColor: '#00000080',
      padding: { x: 5, y: 3 }
    }).setOrigin(0.5);

    // 体力值
    const hpContainer = this.add.container(0, 120);
    this.updateHPDisplay(hpContainer, character.hp, character.hp);

    // 手牌数
    const cardCount = this.add.text(0, -75, '📦 0', {
      font: 'bold 16px Microsoft YaHei',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // 身份标识（预留）
    const role = this.add.text(-70, 0, '', {
      font: 'bold 14px Microsoft YaHei',
      color: '#f39c12'
    }).setOrigin(0.5);

    container.add([frame, avatarBg, avatarImage, kingdomText, nameText, skillText, hpContainer, cardCount, role]);

    // 选中效果（初始隐藏）
    const selectFrame = this.add.circle(0, 0, 70, 0xffff00, 0);
    selectFrame.setStrokeStyle(4, 0xffff00);
    container.add(selectFrame);

    return {
      container,
      index,
      character,
      hp: character.hp,
      maxHp: character.hp,
      handCards: [],
      hpContainer,
      cardCountText: cardCount,
      selectFrame,
      isAlive: true,
      nameText,
      skillText
    };
  }

  updateHPDisplay(container, current, max) {
    container.removeAll(true);

    const hpText = this.add.text(0, 0, '❤️'.repeat(current) + '🖤'.repeat(max - current), {
      font: 'bold 18px Microsoft YaHei'
    }).setOrigin(0.5);

    container.add(hpText);
  }

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
          color: card.color,
          description: card.description,
          suit: card.suit
        });
      }
    });

    this.shuffleDeck();
    this.updateDeckDisplay();
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
        this.animateDrawCard(player, card);
      }
    }
    this.updatePlayerCards(player);
    this.updateDeckDisplay();
  }

  animateDrawCard(player, card) {
    const { width, height } = this.scale;
    
    const cardRect = this.add.rectangle(width - 150, 40, 60, 80, card.color);
    cardRect.setStrokeStyle(2, 0xffffff);

    this.tweens.add({
      targets: cardRect,
      x: player.container.x,
      y: player.container.y - 100,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        cardRect.destroy();
        this.createParticleEffect(player.container.x, player.container.y - 100, 0xf39c12);
      }
    });
  }

  updatePlayerCards(player) {
    player.cardCountText.setText(`📦 ${player.handCards.length}`);
  }

  updateDeckDisplay() {
    this.deckText.setText(`牌堆：${this.deck.length}`);
    this.discardText.setText(`弃牌：${this.discardPile.length}`);
  }

  startGame() {
    if (this.gameState === 'playing') return;
    
    this.gameState = 'playing';
    this.isPaused = false;
    this.log('🎲 游戏开始！', 'system');
    
    // 更新按钮状态
    this.startButton.setText('🔄 重新开始');
    this.startButton.getAt(0).setFillStyle(0xe74c3c);
    this.pauseButton.setVisible(true);
    this.pauseButton.getAt(0).setFillStyle(0xe67e22);
    this.pauseButton.getAt(1).setText('⏸️ 暂停');
    
    this.statusText.setText('游戏中');
    this.statusText.setColor('#2ecc71');
    
    this.startTurn();
  }

  togglePause() {
    if (this.gameState !== 'playing') return;
    
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      this.gameState = 'paused';
      this.pauseButton.getAt(1).setText('▶️ 继续');
      this.pauseButton.getAt(0).setFillStyle(0x2ecc71);
      this.statusText.setText('已暂停');
      this.statusText.setColor('#f39c12');
      this.log('⏸️ 游戏已暂停', 'system');
    } else {
      this.gameState = 'playing';
      this.pauseButton.getAt(1).setText('⏸️ 暂停');
      this.pauseButton.getAt(0).setFillStyle(0xe67e22);
      this.statusText.setText('游戏中');
      this.statusText.setColor('#2ecc71');
      this.log('▶️ 游戏继续', 'system');
      this.startTurn();
    }
  }

  backToMenu() {
    this.scene.start('MenuScene');
  }

  startTurn() {
    if (this.isPaused) return;
    
    const player = this.players[this.currentPlayerIndex];
    
    if (!player.isAlive) {
      this.nextTurn();
      return;
    }

    this.turnCount++;
    this.turnText.setText(`第 ${this.turnCount} 回合 | ${player.character.name}`);
    this.turnText.setColor('#f39c12');

    this.highlightPlayer(player);
    this.log(`========== 第 ${this.turnCount} 回合 - ${player.character.name} ==========`, 'turn');
    this.log(`📦 摸牌阶段`, 'phase');

    setTimeout(() => {
      this.drawCard(player, 2);
      this.log(`🃏 摸了 2 张牌`, 'draw');

      setTimeout(() => {
        this.log(`🎯 出牌阶段`, 'phase');
        this.aiPlayCard(player);
      }, 1000);
    }, 500);
  }

  highlightPlayer(player) {
    this.players.forEach(p => {
      p.selectFrame.setStrokeStyle(0, 0xffff00);
      p.selectFrame.setAlpha(0);
    });

    player.selectFrame.setAlpha(1);
    player.selectFrame.setStrokeStyle(4, 0xffff00);

    this.tweens.add({
      targets: player.container,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 200,
      yoyo: true,
      repeat: 1
    });
  }

  aiPlayCard(player) {
    if (player.handCards.length === 0 || !player.isAlive) {
      this.endTurn();
      return;
    }

    const cardIndex = Math.floor(Math.random() * player.handCards.length);
    const card = player.handCards[cardIndex];

    this.log(`🃏 使用【${card.name}】`, 'play');
    this.animatePlayCard(player, card, cardIndex);
  }

  animatePlayCard(player, card, cardIndex) {
    const targetPlayer = this.getRandomTarget(player);

    const playingCard = this.add.rectangle(
      player.container.x,
      player.container.y - 50,
      80, 100,
      card.color
    );
    playingCard.setStrokeStyle(3, 0xffffff);

    const cardText = this.add.text(
      player.container.x,
      player.container.y - 50,
      card.name,
      {
        font: 'bold 20px Microsoft YaHei',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: [playingCard, cardText],
      x: targetPlayer.container.x,
      y: targetPlayer.container.y,
      duration: 600,
      ease: 'Power2',
      onComplete: () => {
        this.createHitEffect(targetPlayer, card);
        playingCard.destroy();
        cardText.destroy();

        player.handCards.splice(cardIndex, 1);
        this.updatePlayerCards(player);
        this.discardPile.push(card);

        setTimeout(() => {
          this.endTurn();
        }, 1000);
      }
    });
  }

  getRandomTarget(sourcePlayer) {
    const alivePlayers = this.players.filter(p => p !== sourcePlayer && p.isAlive);
    if (alivePlayers.length === 0) return sourcePlayer;
    return alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
  }

  createHitEffect(player, card) {
    const x = player.container.x;
    const y = player.container.y;

    let damage = 1;
    if (card.key === 'juedou') damage = 2;

    const damageText = this.add.text(x, y - 80, `-${damage}`, {
      font: 'bold 64px Microsoft YaHei',
      color: '#e74c3c',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.tweens.add({
      targets: damageText,
      y: y - 150,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => damageText.destroy()
    });

    this.createParticleEffect(x, y, 0xe74c3c, 20);

    player.hp = Math.max(0, player.hp - damage);
    this.updateHPDisplay(player.hpContainer, player.hp, player.maxHp);

    if (player.hp === 0) {
      player.isAlive = false;
      player.container.setAlpha(0.5);
      this.log(`💀 ${player.character.name} 阵亡！`, 'death');
      this.createDeathEffect(player);
    } else {
      const taoIndex = player.handCards.findIndex(c => c.key === 'tao');
      if (taoIndex !== -1 && player.hp < player.maxHp) {
        setTimeout(() => {
          player.handCards.splice(taoIndex, 1);
          player.hp = Math.min(player.maxHp, player.hp + 1);
          this.updateHPDisplay(player.hpContainer, player.hp, player.maxHp);
          this.log(`❤️ ${player.character.name} 使用【桃】回复 1 点体力`, 'heal');
          this.createHealEffect(player);
        }, 500);
      }
    }
  }

  createParticleEffect(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const particle = this.add.circle(x, y, 5, color);
      const angle = (Math.PI * 2 / count) * i;
      const velocity = 50 + Math.random() * 50;

      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * velocity,
        y: y + Math.sin(angle) * velocity,
        alpha: 0,
        duration: 500 + Math.random() * 300,
        onComplete: () => particle.destroy()
      });
    }
  }

  createDeathEffect(player) {
    const x = player.container.x;
    const y = player.container.y;

    this.createParticleEffect(x, y, 0x95a5a6, 30);
    this.cameras.main.shake(200, 0.01);
  }

  createHealEffect(player) {
    const x = player.container.x;
    const y = player.container.y;

    const healText = this.add.text(x, y - 80, '+1', {
      font: 'bold 64px Microsoft YaHei',
      color: '#2ecc71',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.tweens.add({
      targets: healText,
      y: y - 150,
      alpha: 0,
      duration: 1000,
      onComplete: () => healText.destroy()
    });

    this.createParticleEffect(x, y, 0x2ecc71, 15);
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
    }, 1000);
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
      
      this.startButton.setText('🔄 重新开始');
      this.startButton.getAt(0).setFillStyle(0xf39c12);
      this.pauseButton.setVisible(false);
      
      this.statusText.setText('游戏结束');
      this.statusText.setColor('#e74c3c');
      
      if (winner) {
        this.createVictoryEffect(winner);
      }
      
      return true;
    }
    
    return false;
  }

  createVictoryEffect(winner) {
    const { width, height } = this.scale;
    
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const x = Math.random() * width;
        const color = [0xf39c12, 0xe74c3c, 0x2ecc71, 0x3498db][Math.floor(Math.random() * 4)];
        this.createParticleEffect(x, 0, color, 3);
      }, i * 100);
    }

    const victoryText = this.add.text(width / 2, height / 2, '🏆 胜利！', {
      font: 'bold 96px Microsoft YaHei',
      color: '#f39c12',
      stroke: '#ffffff',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.tweens.add({
      targets: victoryText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      yoyo: true,
      repeat: 3
    });
  }

  createLogSystem() {
    const { width, height } = this.scale;
    
    const logBox = this.add.rectangle(width - 200, height - 200, 350, 300, 0x000000, 0.7);
    logBox.setOrigin(1);
    logBox.setStrokeStyle(2, 0xf39c12);

    const logTitle = this.add.text(width - 210, height - 360, '📜 游戏日志', {
      font: 'bold 18px Microsoft YaHei',
      color: '#f39c12'
    }).setOrigin(1, 0);

    return {
      box: logBox,
      title: logTitle,
      entries: [],
      text: null
    };
  }

  log(message, type = 'normal') {
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const colors = {
      system: '#f39c12',
      turn: '#e74c3c',
      phase: '#3498db',
      draw: '#2ecc71',
      play: '#9b59b6',
      skill: '#e67e22',
      heal: '#2ecc71',
      death: '#95a5a6',
      normal: '#ffffff'
    };

    const entry = `[${time}] ${message}`;
    this.logSystem.entries.push({ text: entry, color: colors[type] || colors.normal });

    if (this.logSystem.entries.length > 10) {
      this.logSystem.entries.shift();
    }

    this.renderLog();
  }

  renderLog() {
    const { width, height } = this.scale;
    
    if (this.logSystem.text) {
      this.logSystem.text.destroy();
    }

    const text = this.logSystem.entries.map(e => 
      `<text color="${e.color}">${e.text}</text>`
    ).join('\n');

    this.logSystem.text = this.add.text(width - 210, height - 330, text, {
      font: '14px Microsoft YaHei',
      lineSpacing: 6
    }).setOrigin(0, 0);
  }
}
