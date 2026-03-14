/**
 * 核心游戏逻辑
 */
import { SUITS } from '../config/cards';

// ========== 距离计算 ==========

/**
 * 计算两名角色之间的距离
 */
export function calculateDistance(source, target, players) {
  if (source === target) return 0;
  
  const alivePlayers = players.filter(p => p.isAlive);
  const sourceIndex = alivePlayers.indexOf(source);
  const targetIndex = alivePlayers.indexOf(target);
  
  if (sourceIndex === -1 || targetIndex === -1) return Infinity;
  
  // 座位距离
  const total = alivePlayers.length;
  const clockwise = (targetIndex - sourceIndex + total) % total;
  const counterClockwise = (sourceIndex - targetIndex + total) % total;
  let distance = Math.min(clockwise, counterClockwise);
  
  // +1 马
  if (target.equipment.defenseHorse) {
    distance += 1;
  }
  
  // -1 马
  if (source.equipment.offenseHorse) {
    distance = Math.max(1, distance - 1);
  }
  
  return distance;
}

/**
 * 检查是否可以攻击
 */
export function canAttack(source, target, players) {
  if (!target.isAlive || source === target) return false;
  
  const distance = calculateDistance(source, target, players);
  const range = source.getAttackRange();
  
  return distance <= range;
}

// ========== 卡牌效果 ==========

/**
 * 获取杀的伤害值
 */
export function getShaDamage(player, target) {
  let damage = 1;
  
  // 酒
  if (player.drunken) {
    damage += 1;
    player.drunken = false;
  }
  
  // 裸衣（简化处理）
  // 烈弓等技能在技能系统中处理
  
  return damage;
}

/**
 * 检查杀是否可以被闪避
 */
export function canDodgeSha(player, target) {
  // 检查烈弓等技能
  // 这里简化处理
  return true;
}

/**
 * 需要几张闪
 */
export function getRequiredShanCount(attacker, target) {
  // 无双
  if (attacker.character.key === 'lvbu') {
    return 2;
  }
  return 1;
}

// ========== 判定相关 ==========

/**
 * 检查判定结果
 */
export function checkJudgeResult(card, condition) {
  const suit = SUITS[card.suit];
  const isRed = suit.name === '红桃' || suit.name === '方片';
  const number = Math.floor(Math.random() * 13) + 1;  // 简化，实际应该有牌面点数
  
  switch (condition) {
    case 'red':
      return isRed;
    case 'black':
      return !isRed;
    case 'heart':
      return card.suit === 'heart';
    case 'spade':
      return card.suit === 'spade';
    case 'club':
      return card.suit === 'club';
    case 'diamond':
      return card.suit === 'diamond';
    case 'spade_2_9':
      return card.suit === 'spade' && number >= 2 && number <= 9;
    default:
      return false;
  }
}

// ========== 游戏状态检查 ==========

/**
 * 检查游戏是否结束
 */
export function checkGameOver(players) {
  const alive = players.filter(p => p.isAlive);
  
  if (alive.length <= 1) {
    return {
      over: true,
      winner: alive[0] || null,
      reason: alive.length === 0 ? '全员阵亡' : '最后存活'
    };
  }
  
  return { over: false };
}

/**
 * 获取存活玩家
 */
export function getAlivePlayers(players) {
  return players.filter(p => p.isAlive);
}

/**
 * 获取下一个存活玩家
 */
export function getNextAlivePlayer(players, currentIndex) {
  let nextIndex = (currentIndex + 1) % players.length;
  let count = 0;
  
  while (!players[nextIndex].isAlive && count < players.length) {
    nextIndex = (nextIndex + 1) % players.length;
    count++;
  }
  
  return nextIndex;
}

// ========== AI 相关 ==========

/**
 * AI 选择目标
 */
export function aiSelectTarget(source, players, filter = () => true) {
  const targets = players.filter(p => 
    p !== source && 
    p.isAlive && 
    filter(p)
  );
  
  if (targets.length === 0) return null;
  
  // 优先攻击体力低的
  targets.sort((a, b) => a.hp - b.hp);
  return targets[0];
}

/**
 * AI 决定出牌
 */
export function aiDecideCard(player, players) {
  const handCards = player.handCards;
  
  // 优先级：装备 > 桃(血少) > 杀 > 锦囊 > 其他
  const priority = {
    'weapon': 100,
    'armor': 95,
    'defense_horse': 90,
    'offense_horse': 85,
    'basic': 50,
    'scroll': 40,
    'delay': 30
  };
  
  // 找装备
  const equips = handCards.filter(c => priority[c.type] >= 85);
  if (equips.length > 0) {
    return { card: equips[0], action: 'equip' };
  }
  
  // 血少用桃
  if (player.hp < player.maxHp) {
    const tao = handCards.find(c => c.key === 'tao');
    if (tao) {
      return { card: tao, action: 'use', target: player };
    }
  }
  
  // 用杀（如果有目标）
  if (!player.hasUsedSha || player.hasZhugeliannu()) {
    const sha = handCards.find(c => c.key === 'sha');
    if (sha) {
      const target = aiSelectTarget(player, players, t => canAttack(player, t, players));
      if (target) {
        return { card: sha, action: 'use', target };
      }
    }
  }
  
  // 用锦囊（排除无懈可击，因为它是响应牌）
  const scrolls = handCards.filter(c => c.type === 'scroll' && c.key !== 'wuke');
  if (scrolls.length > 0) {
    // 优先使用非延时锦囊
    const normalScrolls = scrolls.filter(c => !['lebusishu', 'bingliangcunduan', 'shandian'].includes(c.key));
    if (normalScrolls.length > 0) {
      const target = aiSelectTarget(player, players);
      if (target) {
        return { card: normalScrolls[0], action: 'use', target };
      }
    }
    // 延时锦囊
    const delayScrolls = scrolls.filter(c => ['lebusishu', 'bingliangcunduan', 'shandian'].includes(c.key));
    if (delayScrolls.length > 0) {
      const target = aiSelectTarget(player, players);
      if (target) {
        return { card: delayScrolls[0], action: 'use', target };
      }
    }
  }
  
  return null;
}

/**
 * AI 决定是否出闪
 */
export function aiDecideShan(player, shaCard, attacker) {
  // 如果有无双需要两张闪
  const needCount = getRequiredShanCount(attacker, player);
  const shanCount = player.handCards.filter(c => c.key === 'shan').length;
  
  // 如果有八卦阵，50% 概率判定
  if (player.hasBagua() && Math.random() > 0.5) {
    return { useBagua: true };
  }
  
  if (shanCount >= needCount) {
    return { useShan: true, count: needCount };
  }
  
  return { useShan: false };
}

/**
 * AI 决定是否出桃救人
 */
export function aiDecideTao(player, dyingPlayer) {
  // 如果是队友（简化：同势力）
  const isAlly = player.character.kingdom === dyingPlayer.character.kingdom;
  
  // 有桃且是队友，或者自己就是濒死者
  if (player.hasCard('tao') && (isAlly || player === dyingPlayer)) {
    return true;
  }
  
  // 华佗急救
  if (player.character.key === 'huatuo') {
    const redCards = player.handCards.filter(c => {
      const suit = SUITS[c.suit];
      return suit && (suit.name === '红桃' || suit.name === '方片');
    });
    if (redCards.length > 0) {
      return true;
    }
  }
  
  return false;
}