import Phaser from 'phaser';

// 武将数据库
const CHARACTERS = [
  { key: 'caocao', name: '曹操', kingdom: 'wei', hp: 4, skill: '奸雄' },
  { key: 'liubei', name: '刘备', kingdom: 'shu', hp: 4, skill: '仁德' },
  { key: 'sunquan', name: '孙权', kingdom: 'wu', hp: 4, skill: '制衡' },
  { key: 'zhugeliang', name: '诸葛亮', kingdom: 'shu', hp: 3, skill: '观星' },
  { key: 'simayi', name: '司马懿', kingdom: 'wei', hp: 3, skill: '反馈' },
  { key: 'xiahoudun', name: '夏侯惇', kingdom: 'wei', hp: 4, skill: '刚烈' },
  { key: 'guanYu', name: '关羽', kingdom: 'shu', hp: 4, skill: '武圣' },
  { key: 'zhangfei', name: '张飞', kingdom: 'shu', hp: 4, skill: '咆哮' },
  { key: 'zhaoyun', name: '赵云', kingdom: 'shu', hp: 4, skill: '龙胆' },
  { key: 'zhouyu', name: '周瑜', kingdom: 'wu', hp: 3, skill: '反间' },
  { key: 'luxun', name: '陆逊', kingdom: 'wu', hp: 3, skill: '连营' },
  { key: 'diaochan', name: '貂蝉', kingdom: 'qun', hp: 3, skill: '闭月' },
  { key: 'lvbu', name: '吕布', kingdom: 'qun', hp: 5, skill: '无双' },
  { key: 'huatuo', name: '华佗', kingdom: 'qun', hp: 3, skill: '急救' }
];

// 卡牌数据
const CARDS = {
  sha: { name: '杀', type: 'basic', count: 30, color: 0xe74c3c },
  shan: { name: '闪', type: 'basic', count: 15, color: 0x3498db },
  tao: { name: '桃', type: 'basic', count: 8, color: 0x2ecc71 },
  ji: { name: '酒', type: 'basic', count: 5, color: 0x9b59b6 },
  wuzhong: { name: '无中生有', type: 'scroll', count: 4, color: 0xf39c12 },
  juedou: { name: '决斗', type: 'scroll', count: 3, color: 0xe67e22 },
  shunshou: { name: '顺手牵羊', type: 'scroll', count: 5, color: 0x1abc9c },
  guoheshuang: { name: '过河拆桥', type: 'scroll', count: 3, color: 0x34495e }
};

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
    this.gameState = 'waiting';
    this.selectedCard = null;
  }

  create() {
    const { width, height } = this.scale;

    // ========== 背景 ==========
    this.createBackground(width, height);

    // ========== UI 层 ==========
    this.createUI(width, height);

    // ========== 初始化游戏 ==========
    this.initGame();

    // ========== 创建玩家 ==========
    this.createPlayers();

    // ========== 发初始手牌 ==========
    this.dealInitialCards();

    // ========== 游戏日志 ==========
    this.logSystem = this.createLogSystem();
    this.log('🎮 欢迎来到微杀杀 Online！', 'system');
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

    // 回合显示
    this.turnText = this.add.text(100, 40, '准备开始', {
      font: 'bold 24px Microsoft YaHei',
      color: '#f39c12'
    }).setOrigin(0, 0.5);

    // 牌堆信息
    this.deckText = this.add.text(width - 100, 40, '牌堆：0', {
      font: '20px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(1, 0.5);

    // 开始游戏按钮
    const startBtn = this.add.rectangle(width / 2, height - 50, 200, 60, 0xf39c12)
      .setInteractive({ useHandCursor: true });
    
    const startText = this.add.text(width / 2, height - 50, '🎲 开始游戏', {
      font: 'bold 24px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);

    startBtn.on('pointerdown', () => {
      if (this.gameState === 'waiting' || this.gameState === 'ended') {
        this.startGame();
      } else {
        this.nextTurn();
      }
    });

    // 按钮悬停效果
    startBtn.on('pointerover', () => startBtn.setFillStyle(0xe74c3c));
    startBtn.on('pointerout', () => startBtn.setFillStyle(0xf39c12));

    this.startButton = { rect: startBtn, text: startText };
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

    // 头像框
    const frame = this.add.circle(0, 0, 60, 0xf39c12, 1);
    frame.setStrokeStyle(4, 0xe74c3c);

    // 武将头像（使用颜色块 + 文字代替图片）
    const avatarBg = this.add.circle(0, 0, 55, this.getKingdomColor(character.kingdom));
    const avatarText = this.add.text(0, 0, character.name[0], {
      font: 'bold 48px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 武将名称
    const nameText = this.add.text(0, 75, character.name, {
      font: 'bold 18px Microsoft YaHei',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // 体力值
    const hpContainer = this.add.container(0, 95);
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

    container.add([frame, avatarBg, avatarText, nameText, hpContainer, cardCount, role]);

    // 选中效果（初始隐藏）
    const selectFrame = this.add.circle(0, 0, 65, 0xffffff, 0);
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
      isAlive: true
    };
  }

  updateHPDisplay(container, current, max) {
    container.removeAll(true);

    const hpText = this.add.text(0, 0, '❤️'.repeat(current) + '🖤'.repeat(max - current), {
      font: 'bold 20px Microsoft YaHei'
    }).setOrigin(0.5);

    container.add(hpText);
  }

  getKingdomColor(kingdom) {
    const colors = {
      wei: 0x3498db,   // 魏 - 蓝
      shu: 0x2ecc71,   // 蜀 - 绿
      wu: 0xe74c3c,    // 吴 - 红
      qun: 0xf39c12    // 群 - 橙
    };
    return colors[kingdom] || 0x95a5a6;
  }

  initGame() {
    // 初始化牌堆
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
          color: card.color
        });
      }
    });

    // 洗牌
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
        
        // 摸牌动画
        this.animateDrawCard(player);
      }
    }
    this.updatePlayerCards(player);
    this.updateDeckDisplay();
  }

  animateDrawCard(player) {
    const { width, height } = this.scale;
    
    // 从牌堆位置创建卡牌
    const card = this.add.rectangle(width - 150, 40, 60, 80, 0x34495e);
    card.setStrokeStyle(2, 0xf39c12);

    // 飞行动画到玩家
    this.tweens.add({
      targets: card,
      x: player.container.x,
      y: player.container.y - 100,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        card.destroy();
        // 摸牌特效
        this.createParticleEffect(player.container.x, player.container.y - 100, 0xf39c12);
      }
    });
  }

  updatePlayerCards(player) {
    player.cardCountText.setText(`📦 ${player.handCards.length}`);
  }

  updateDeckDisplay() {
    this.deckText.setText(`牌堆：${this.deck.length}`);
  }

  startGame() {
    this.gameState = 'playing';
    this.log('🎲 游戏开始！', 'system');
    
    // 更新按钮文字
    this.startButton.text.setText('⏭️ 下一回合');
    this.startButton.rect.setFillStyle(0x2ecc71);

    // 开始第一回合
    this.startTurn();
  }

  startTurn() {
    const player = this.players[this.currentPlayerIndex];
    
    if (!player.isAlive) {
      this.nextTurn();
      return;
    }

    this.turnCount++;
    this.turnText.setText(`第 ${this.turnCount} 回合 | ${player.character.name}`);

    // 高亮当前玩家
    this.highlightPlayer(player);

    this.log(`========== 第 ${this.turnCount} 回合 - ${player.character.name} ==========`, 'turn');
    this.log(`📦 摸牌阶段`, 'phase');

    // 摸 2 张牌
    setTimeout(() => {
      this.drawCard(player, 2);
      this.log(`🃏 摸了 2 张牌`, 'draw');

      // 出牌阶段（AI 自动）
      setTimeout(() => {
        this.aiPlayCard(player);
      }, 1000);
    }, 500);
  }

  highlightPlayer(player) {
    // 清除所有高亮
    this.players.forEach(p => {
      p.selectFrame.setStrokeStyle(0, 0xffff00);
      p.selectFrame.setAlpha(0);
    });

    // 高亮当前玩家
    player.selectFrame.setAlpha(1);
    player.selectFrame.setStrokeStyle(4, 0xffff00);

    // 缩放动画
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

    // 简单 AI：随机使用一张牌
    const cardIndex = Math.floor(Math.random() * player.handCards.length);
    const card = player.handCards[cardIndex];

    this.log(`🎯 出牌阶段`, 'phase');
    this.log(`🃏 使用【${card.name}】`, 'play');

    // 出牌动画
    this.animatePlayCard(player, card, cardIndex);
  }

  animatePlayCard(player, card, cardIndex) {
    const { width, height } = this.scale;
    const targetPlayer = this.getRandomTarget(player);

    // 创建卡牌
    const playingCard = this.add.rectangle(
      player.container.x,
      player.container.y - 50,
      80, 100,
      card.color
    );
    playingCard.setStrokeStyle(3, 0xffffff);

    // 卡牌文字
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

    // 飞行动画
    this.tweens.add({
      targets: [playingCard, cardText],
      x: targetPlayer.container.x,
      y: targetPlayer.container.y,
      duration: 600,
      ease: 'Power2',
      onComplete: () => {
        // 命中效果
        this.createHitEffect(targetPlayer, card);
        
        // 清理
        playingCard.destroy();
        cardText.destroy();

        // 从手牌移除
        player.handCards.splice(cardIndex, 1);
        this.updatePlayerCards(player);
        this.discardPile.push(card);

        // 结束回合
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

    // 伤害数字
    let damage = 1;
    if (card.key === 'juedou') damage = 2;

    const damageText = this.add.text(x, y - 80, `-${damage}`, {
      font: 'bold 64px Microsoft YaHei',
      color: '#e74c3c',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // 伤害动画
    this.tweens.add({
      targets: damageText,
      y: y - 150,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => damageText.destroy()
    });

    // 粒子效果
    this.createParticleEffect(x, y, 0xe74c3c, 20);

    // 扣血
    player.hp = Math.max(0, player.hp - damage);
    this.updateHPDisplay(player.hpContainer, player.hp, player.maxHp);

    if (player.hp === 0) {
      player.isAlive = false;
      player.container.setAlpha(0.5);
      this.log(`💀 ${player.character.name} 阵亡！`, 'death');
      this.createDeathEffect(player);
    } else {
      // 尝试求桃（简化：自动使用桃）
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
    const particles = [];

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

      particles.push(particle);
    }
  }

  createDeathEffect(player) {
    const x = player.container.x;
    const y = player.container.y;

    // 灰色粒子爆发
    this.createParticleEffect(x, y, 0x95a5a6, 30);

    // 屏幕震动
    this.cameras.main.shake(200, 0.01);
  }

  createHealEffect(player) {
    const x = player.container.x;
    const y = player.container.y;

    // 回复数字
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

    // 绿色粒子
    this.createParticleEffect(x, y, 0x2ecc71, 15);
  }

  endTurn() {
    this.log(`✅ 回合结束`, 'system');

    // 貂蝉闭月技能（摸 1 牌）
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
    // 检查游戏结束
    if (this.checkGameOver()) {
      return;
    }

    // 下一个玩家
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
      
      this.startButton.text.setText('🔄 重新开始');
      this.startButton.rect.setFillStyle(0xf39c12);
      
      // 胜利特效
      if (winner) {
        this.createVictoryEffect(winner);
      }
      
      return true;
    }
    
    return false;
  }

  createVictoryEffect(winner) {
    const { width, height } = this.scale;
    
    // 彩带粒子
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const x = Math.random() * width;
        const color = [0xf39c12, 0xe74c3c, 0x2ecc71, 0x3498db][Math.floor(Math.random() * 4)];
        this.createParticleEffect(x, 0, color, 3);
      }, i * 100);
    }

    // 胜利文字
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

    // 保持最新 10 条
    if (this.logSystem.entries.length > 10) {
      this.logSystem.entries.shift();
    }

    // 重新渲染日志
    this.renderLog();
  }

  renderLog() {
    const { width, height } = this.scale;
    
    // 清除旧日志文字
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
