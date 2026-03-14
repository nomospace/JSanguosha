/**
 * 游戏主控制器 - 协调游戏流程
 */
import { CHARACTERS } from '../config/characters';
import { CARDS } from '../config/cards';
import { Player } from './Player';
import { Deck } from './Deck';
import { SkillSystem } from './Skills';
import { Renderer } from '../ui/Renderer';
import {
  calculateDistance, canAttack, getShaDamage, getRequiredShanCount,
  checkGameOver, getAlivePlayers, getNextAlivePlayer,
  aiDecideCard, aiDecideShan, aiDecideTao
} from './Logic';

export class Game {
  constructor() {
    this.players = [];
    this.deck = null;
    this.skills = null;
    this.renderer = null;
    
    this.playerCount = 4;
    this.currentPlayerIndex = 0;
    this.turnCount = 0;
    this.gameState = 'waiting';  // waiting, playing, paused, ended
    this.isPaused = false;
    
    this.playQueue = [];
    this.playInterval = null;
  }

  // ========== 初始化 ==========

  init() {
    // 初始化牌堆
    this.deck = new Deck();
    
    // 初始化技能系统
    this.skills = new SkillSystem(this);
    
    // 初始化渲染器
    this.renderer = new Renderer(this);
    
    // 创建玩家
    this.createPlayers();
    
    // 渲染界面
    this.renderer.renderPlayers(this.players);
    this.renderer.updateUI(this);
    this.renderer.showBuildTimestamp();
    this.initTooltipEvents();
    
    // 显示欢迎信息
    this.renderer.addLog('🎮 欢迎来到三国杀 Mini！', 'system');
    this.renderer.addLog('点击"开始游戏"开始对战', 'system');
  }

  createPlayers() {
    this.players = [];
    const shuffledCharacters = [...CHARACTERS].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < this.playerCount; i++) {
      const character = shuffledCharacters[i % shuffledCharacters.length];
      const player = new Player(i, character);
      this.players.push(player);
    }
  }

  // ========== 工具方法 ==========

  getAlivePlayers() {
    return getAlivePlayers(this.players);
  }

  getCardData(cardKey) {
    return CARDS[cardKey];
  }

  // ========== 卡牌提示 ==========

  initTooltipEvents() {
    document.addEventListener('mousemove', (e) => {
      if (this.renderer.elements.cardTooltip.classList.contains('show')) {
        this.renderer.updateTooltipPosition(e);
      }
    });
  }

  showCardTooltip(cardKey, event) {
    this.renderer.showCardTooltip(cardKey, event);
  }

  hideCardTooltip() {
    this.renderer.hideCardTooltip();
  }

  // ========== 游戏流程 ==========

  startGame() {
    if (this.gameState === 'playing') {
      this.resetGame();
      return;
    }
    
    // 重新初始化
    this.deck = new Deck();
    this.createPlayers();
    this.renderer.renderPlayers(this.players);
    
    // 发初始手牌
    this.players.forEach(player => {
      const cards = this.deck.drawMultiple(4);
      player.drawCards(cards);
      this.renderer.updatePlayer(player);
    });
    
    this.gameState = 'playing';
    this.isPaused = false;
    this.turnCount = 0;
    this.currentPlayerIndex = 0;
    
    this.renderer.updateButtons('playing');
    this.renderer.updateUI(this);
    
    this.renderer.addLog('🎲 游戏开始！', 'system');
    
    // 开始第一个回合
    setTimeout(() => this.startTurn(), 500);
  }

  resetGame() {
    this.stopPlayQueue();
    this.gameState = 'waiting';
    this.renderer.clearLog();
    this.init();
  }

  togglePause() {
    if (this.gameState !== 'playing' && this.gameState !== 'paused') return;
    
    this.isPaused = !this.isPaused;
    this.gameState = this.isPaused ? 'paused' : 'playing';
    
    this.renderer.updateButtons(this.gameState);
    this.renderer.updateUI(this);
    
    if (this.isPaused) {
      this.stopPlayQueue();
      this.renderer.addLog('⏸️ 游戏暂停', 'system');
    } else {
      this.renderer.addLog('▶️ 游戏继续', 'system');
      this.continueTurn();
    }
  }

  backToMenu() {
    if (confirm('确定要退出吗？当前游戏将丢失。')) {
      this.resetGame();
    }
  }

  // ========== 回合系统 ==========

  startTurn() {
    if (this.isPaused || this.gameState !== 'playing') return;
    
    const player = this.players[this.currentPlayerIndex];
    if (!player.isAlive) {
      this.nextTurn();
      return;
    }
    
    this.turnCount++;
    player.hasUsedSha = false;
    player.drunken = false;
    
    this.renderer.highlightPlayer(player);
    this.renderer.updateUI(this);
    
    this.renderer.addLog(`═══ 第 ${this.turnCount} 回合 - ${player.character.name} ═══`, 'turn');
    
    // 准备阶段
    this.preparePhase(player);
  }

  preparePhase(player) {
    this.renderer.addLog('🌅 准备阶段', 'phase');
    
    // 检查技能触发
    const skillResult = this.skills.checkTrigger(player, 'prepare_phase', {});
    if (skillResult && skillResult.effect === 'judge_loop') {
      this.handleLuoshen(player);
      return;
    }
    
    // 进入摸牌阶段
    this.drawPhase(player);
  }

  // 甄姬洛神
  handleLuoshen(player) {
    this.renderer.addLog(`🌙 ${player.character.name} 发动【洛神】`, 'skill');
    
    const handleJudge = () => {
      if (this.isPaused) return;
      
      const card = this.deck.judge();
      if (!card) return;
      
      const suit = CARDS[card.key]?.suit || card.suit;
      const isBlack = suit === 'spade' || suit === 'club';
      
      this.renderer.addLog(`判定：${isBlack ? '黑' : '红'}色`, 'normal');
      
      if (isBlack) {
        player.drawCards([card]);
        this.renderer.updatePlayer(player);
        this.renderer.addLog(`获得判定牌`, 'skill');
        
        // 70% 概率继续
        if (Math.random() < 0.7) {
          setTimeout(handleJudge, 300);
          return;
        }
      }
      
      this.drawPhase(player);
    };
    
    setTimeout(handleJudge, 300);
  }

  drawPhase(player) {
    this.renderer.addLog('📦 摸牌阶段', 'phase');
    
    // 检查兵粮寸断
    const bingliang = player.judgeCards.find(j => j.key === 'bingliang');
    if (bingliang) {
      const card = this.deck.judge();
      const isClub = card && card.suit === 'club';
      this.renderer.addLog(`兵粮寸断判定：${isClub ? '梅花' : '非梅花'}`, 'normal');
      
      if (!isClub) {
        this.renderer.addLog('跳过摸牌阶段', 'skill');
        player.judgeCards = player.judgeCards.filter(j => j !== bingliang);
        this.playPhase(player);
        return;
      }
      player.judgeCards = player.judgeCards.filter(j => j !== bingliang);
    }
    
    // 正常摸牌
    const count = 2;
    const cards = this.deck.drawMultiple(count);
    player.drawCards(cards);
    this.renderer.updatePlayer(player);
    this.renderer.updateUI(this);
    this.renderer.addLog(`摸了 ${count} 张牌`, 'draw');
    
    this.playPhase(player);
  }

  playPhase(player) {
    this.renderer.addLog('🎯 出牌阶段', 'phase');
    
    // 检查乐不思蜀
    const lebu = player.judgeCards.find(j => j.key === 'lebusishu');
    if (lebu) {
      const card = this.deck.judge();
      const isHeart = card && card.suit === 'heart';
      this.renderer.addLog(`乐不思蜀判定：${isHeart ? '红桃' : '非红桃'}`, 'normal');
      
      if (!isHeart) {
        this.renderer.addLog('跳过出牌阶段', 'skill');
        player.judgeCards = player.judgeCards.filter(j => j !== lebu);
        this.discardPhase(player);
        return;
      }
      player.judgeCards = player.judgeCards.filter(j => j !== lebu);
    }
    
    // AI 自动出牌
    this.aiPlayCards(player);
  }

  aiPlayCards(player) {
    this.playQueue = [];
    
    // 生成出牌队列
    for (let i = 0; i < 10; i++) {  // 最多 10 次出牌
      const decision = aiDecideCard(player, this.players);
      if (!decision) break;
      this.playQueue.push(decision);
    }
    
    this.executePlayQueue(player);
  }

  executePlayQueue(player) {
    if (this.isPaused || this.playQueue.length === 0) {
      this.discardPhase(player);
      return;
    }
    
    const decision = this.playQueue.shift();
    this.executeDecision(player, decision);
  }

  executeDecision(player, decision) {
    const { card, action, target } = decision;
    
    // 找到牌的索引
    const cardIndex = player.handCards.findIndex(c => c.id === card.id);
    if (cardIndex === -1) {
      this.executePlayQueue(player);
      return;
    }
    
    switch (action) {
      case 'equip':
        this.handleEquip(player, card, cardIndex);
        break;
      case 'use':
        this.handleUseCard(player, card, cardIndex, target);
        break;
      default:
        this.executePlayQueue(player);
    }
  }

  handleEquip(player, card, cardIndex) {
    let oldEquip = null;
    
    switch (card.type) {
      case 'weapon':
        oldEquip = player.equipWeapon(card);
        break;
      case 'armor':
        oldEquip = player.equipArmor(card);
        break;
      case 'defense_horse':
        oldEquip = player.equipDefenseHorse(card);
        break;
      case 'offense_horse':
        oldEquip = player.equipOffenseHorse(card);
        break;
    }
    
    player.handCards.splice(cardIndex, 1);
    
    if (oldEquip) {
      this.deck.discard(oldEquip);
    }
    
    this.renderer.updatePlayer(player);
    this.renderer.updateUI(this);
    this.renderer.addLog(`装备【${card.name}】`, 'play');
    
    setTimeout(() => this.executePlayQueue(player), 400);
  }

  handleUseCard(player, card, cardIndex, target) {
    player.handCards.splice(cardIndex, 1);
    
    switch (card.key) {
      case 'sha':
        this.handleSha(player, target, card);
        break;
      case 'tao':
        this.handleTao(player, player);
        break;
      case 'ji':
        this.handleJiu(player);
        break;
      case 'wuzhong':
        this.handleWuzhong(player);
        break;
      case 'juedou':
        this.handleJuedou(player, target, card);
        break;
      case 'shunshou':
        this.handleShunshou(player, target);
        break;
      case 'guoheshuang':
        this.handleGuohe(player, target);
        break;
      case 'nanman':
        this.handleNanman(player, card);
        break;
      case 'wanjian':
        this.handleWanjian(player, card);
        break;
      case 'lebusishu':
        this.handleLebu(player, target, card);
        break;
      default:
        this.renderer.addLog(`使用【${card.name}】`, 'play');
        if (target) {
          target.takeDamage(1);
          this.renderer.updatePlayer(target);
          this.checkDeath(target, player);
        }
    }
    
    this.deck.discard(card);
    this.renderer.updateUI(this);
  }

  handleSha(player, target, card) {
    this.renderer.addLog(`⚔️ 对 ${target.character.name} 使用【杀】`, 'play');
    
    const needShan = getRequiredShanCount(player, target);
    const decision = aiDecideShan(target, card, player);
    
    setTimeout(() => {
      if (decision.useBagua) {
        const judgeCard = this.deck.judge();
        const isRed = judgeCard && (judgeCard.suit === 'heart' || judgeCard.suit === 'diamond');
        this.renderer.addLog(`八卦阵判定：${isRed ? '红' : '黑'}`, 'normal');
        
        if (isRed) {
          this.renderer.addLog(`${target.character.name} 八卦阵生效`, 'skill');
          player.hasUsedSha = true;
          setTimeout(() => this.executePlayQueue(player), 400);
          return;
        }
      }
      
      if (decision.useShan) {
        const shanCount = Math.min(decision.count, target.handCards.filter(c => c.key === 'shan').length);
        for (let i = 0; i < shanCount; i++) {
          const idx = target.handCards.findIndex(c => c.key === 'shan');
          if (idx !== -1) {
            const shan = target.handCards.splice(idx, 1)[0];
            this.deck.discard(shan);
          }
        }
        this.renderer.addLog(`${target.character.name} 使用【闪】`, 'normal');
        this.renderer.updatePlayer(target);
      } else {
        // 造成伤害
        const damage = getShaDamage(player, target);
        target.takeDamage(damage);
        this.renderer.updatePlayer(target);
        this.renderer.addLog(`💥 造成 ${damage} 点伤害`, 'play');
        
        this.handleDamageSkills(player, target, card);
        this.checkDeath(target, player);
      }
      
      player.hasUsedSha = true;
      setTimeout(() => this.executePlayQueue(player), 400);
    }, 300);
  }

  handleTao(player, target) {
    target.heal(1);
    this.renderer.updatePlayer(target);
    this.renderer.addLog(`❤️ 使用【桃】回复 1 点体力`, 'heal');
    setTimeout(() => this.executePlayQueue(player), 400);
  }

  handleJiu(player) {
    player.drunken = true;
    this.renderer.addLog(`🍶 使用【酒】`, 'play');
    setTimeout(() => this.executePlayQueue(player), 400);
  }

  handleWuzhong(player) {
    this.renderer.addLog(`📜 使用【无中生有】`, 'play');
    const cards = this.deck.drawMultiple(2);
    player.drawCards(cards);
    this.renderer.updatePlayer(player);
    this.renderer.addLog(`摸了 2 张牌`, 'draw');
    setTimeout(() => this.executePlayQueue(player), 400);
  }

  handleJuedou(player, target, card) {
    this.renderer.addLog(`⚔️ 对 ${target.character.name} 使用【决斗】`, 'play');
    
    // 简化决斗：各出一张杀
    const playerHasSha = player.handCards.some(c => c.key === 'sha');
    const targetHasSha = target.handCards.some(c => c.key === 'sha');
    
    setTimeout(() => {
      if (playerHasSha && targetHasSha) {
        // 双方都有杀，平局
        const pIdx = player.handCards.findIndex(c => c.key === 'sha');
        const tIdx = target.handCards.findIndex(c => c.key === 'sha');
        if (pIdx !== -1) {
          const sha = player.handCards.splice(pIdx, 1)[0];
          this.deck.discard(sha);
        }
        if (tIdx !== -1) {
          const sha = target.handCards.splice(tIdx, 1)[0];
          this.deck.discard(sha);
        }
        this.renderer.addLog('双方各出一张【杀】，平局', 'normal');
      } else if (playerHasSha) {
        target.takeDamage(1);
        this.renderer.updatePlayer(target);
        this.renderer.addLog(`${target.character.name} 受到 1 点伤害`, 'play');
        this.checkDeath(target, player);
      } else if (targetHasSha) {
        player.takeDamage(1);
        this.renderer.updatePlayer(player);
        this.renderer.addLog(`${player.character.name} 受到 1 点伤害`, 'play');
        this.checkDeath(player, target);
      } else {
        target.takeDamage(1);
        this.renderer.updatePlayer(target);
        this.renderer.addLog(`${target.character.name} 受到 1 点伤害`, 'play');
        this.checkDeath(target, player);
      }
      
      this.renderer.updatePlayer(player);
      this.renderer.updatePlayer(target);
      setTimeout(() => this.executePlayQueue(player), 400);
    }, 300);
  }

  handleShunshou(player, target) {
    if (target.handCards.length > 0) {
      const idx = Math.floor(Math.random() * target.handCards.length);
      const card = target.handCards.splice(idx, 1)[0];
      player.handCards.push(card);
      this.renderer.updatePlayer(player);
      this.renderer.updatePlayer(target);
      this.renderer.addLog(`📜 顺手牵羊获得【${card.name}】`, 'play');
    }
    setTimeout(() => this.executePlayQueue(player), 400);
  }

  handleGuohe(player, target) {
    if (target.handCards.length > 0) {
      const idx = Math.floor(Math.random() * target.handCards.length);
      const card = target.handCards.splice(idx, 1)[0];
      this.deck.discard(card);
      this.renderer.updatePlayer(target);
      this.renderer.addLog(`📜 过河拆桥弃置【${card.name}】`, 'play');
    }
    setTimeout(() => this.executePlayQueue(player), 400);
  }

  handleNanman(player, card) {
    this.renderer.addLog(`📜 使用【南蛮入侵】`, 'play');
    
    this.players.forEach(p => {
      if (p !== player && p.isAlive) {
        const hasSha = p.handCards.some(c => c.key === 'sha');
        if (hasSha) {
          const idx = p.handCards.findIndex(c => c.key === 'sha');
          const sha = p.handCards.splice(idx, 1)[0];
          this.deck.discard(sha);
          this.renderer.addLog(`${p.character.name} 打出【杀】`, 'normal');
        } else {
          p.takeDamage(1);
          this.renderer.addLog(`${p.character.name} 受到 1 点伤害`, 'play');
          this.checkDeath(p, player);
        }
        this.renderer.updatePlayer(p);
      }
    });
    
    setTimeout(() => this.executePlayQueue(player), 400);
  }

  handleWanjian(player, card) {
    this.renderer.addLog(`📜 使用【万箭齐发】`, 'play');
    
    this.players.forEach(p => {
      if (p !== player && p.isAlive) {
        const hasShan = p.handCards.some(c => c.key === 'shan');
        if (hasShan) {
          const idx = p.handCards.findIndex(c => c.key === 'shan');
          const shan = p.handCards.splice(idx, 1)[0];
          this.deck.discard(shan);
          this.renderer.addLog(`${p.character.name} 打出【闪】`, 'normal');
        } else {
          p.takeDamage(1);
          this.renderer.addLog(`${p.character.name} 受到 1 点伤害`, 'play');
          this.checkDeath(p, player);
        }
        this.renderer.updatePlayer(p);
      }
    });
    
    setTimeout(() => this.executePlayQueue(player), 400);
  }

  handleLebu(player, target, card) {
    target.judgeCards.push(card);
    this.renderer.addLog(`🎭 对 ${target.character.name} 使用【乐不思蜀】`, 'play');
    setTimeout(() => this.executePlayQueue(player), 400);
  }

  handleDamageSkills(source, target, card) {
    // 曹操奸雄
    if (source.character.key === 'caocao') {
      this.renderer.addLog(`✨ ${source.character.name} 发动【奸雄】获得伤害牌`, 'skill');
      source.handCards.push(card);
    }
    
    // 司马懿反馈
    if (target.character.key === 'simayi' && target.isAlive && source.handCards.length > 0) {
      const idx = Math.floor(Math.random() * source.handCards.length);
      const stolenCard = source.handCards.splice(idx, 1)[0];
      target.handCards.push(stolenCard);
      this.renderer.addLog(`✨ ${target.character.name} 发动【反馈】`, 'skill');
      this.renderer.updatePlayer(source);
      this.renderer.updatePlayer(target);
    }
    
    // 郭嘉遗计
    if (target.character.key === 'guojia' && target.isAlive) {
      const cards = this.deck.drawMultiple(2);
      target.drawCards(cards);
      this.renderer.addLog(`✨ ${target.character.name} 发动【遗计】摸 2 张牌`, 'skill');
      this.renderer.updatePlayer(target);
    }
  }

  checkDeath(player, killer) {
    if (!player.isAlive) {
      this.renderer.addLog(`💀 ${player.character.name} 阵亡！`, 'death');
      
      // 击杀奖励
      if (killer && player.character.kingdom !== killer.character.kingdom) {
        const cards = this.deck.drawMultiple(3);
        killer.drawCards(cards);
        this.renderer.addLog(`🎁 ${killer.character.name} 击杀敌人，摸 3 张牌`, 'skill');
        this.renderer.updatePlayer(killer);
      }
    }
  }

  discardPhase(player) {
    this.renderer.addLog('🗑️ 弃牌阶段', 'phase');
    
    const maxCards = player.getMaxCards();
    while (player.handCards.length > maxCards) {
      const card = player.handCards.pop();
      this.deck.discard(card);
    }
    
    if (player.handCards.length < maxCards + 1) {
      this.renderer.addLog(`弃置至 ${player.handCards.length} 张牌`, 'normal');
    }
    
    this.renderer.updatePlayer(player);
    
    // 结束阶段
    this.endPhase(player);
  }

  endPhase(player) {
    // 貂蝉闭月
    if (player.character.key === 'diaochan' && player.isAlive) {
      const cards = this.deck.drawMultiple(1);
      player.drawCards(cards);
      this.renderer.addLog(`🌙 ${player.character.name} 发动【闭月】摸 1 张牌`, 'skill');
      this.renderer.updatePlayer(player);
    }
    
    this.renderer.addLog('✅ 回合结束', 'system');
    
    // 检查游戏结束
    const result = checkGameOver(this.players);
    if (result.over) {
      this.gameOver(result);
      return;
    }
    
    // 下一个玩家
    this.nextTurn();
  }

  nextTurn() {
    this.currentPlayerIndex = getNextAlivePlayer(this.players, this.currentPlayerIndex);
    setTimeout(() => this.startTurn(), 500);
  }

  continueTurn() {
    // 继续当前回合
    const player = this.players[this.currentPlayerIndex];
    if (player && this.playQueue.length > 0) {
      this.executePlayQueue(player);
    } else {
      this.nextTurn();
    }
  }

  stopPlayQueue() {
    this.playQueue = [];
  }

  gameOver(result) {
    this.gameState = 'ended';
    this.stopPlayQueue();
    
    this.renderer.updateButtons('ended');
    this.renderer.updateUI(this);
    
    if (result.winner) {
      this.renderer.addLog(`🏆 游戏结束！${result.winner.character.name} 获胜！`, 'system');
    } else {
      this.renderer.addLog('🏆 游戏结束！平局！', 'system');
    }
  }
}