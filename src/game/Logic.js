/**
 * 三国杀核心游戏逻辑
 * 包含：距离计算、装备系统、响应机制、技能触发
 */

import { CHARACTERS, KINGDOM_COLORS } from '../config/characters';
import { CARDS, SUITS, CARD_TYPES } from '../config/cards';

// ========== 距离计算 ==========

/**
 * 计算两名角色之间的距离
 * @param {Object} source - 源角色
 * @param {Object} target - 目标角色
 * @param {Array} players - 所有玩家
 * @returns {number} 距离
 */
export function calculateDistance(source, target, players) {
  if (source === target) return 0;
  
  const sourceIndex = players.indexOf(source);
  const targetIndex = players.indexOf(target);
  
  // 计算座位距离（顺时针和逆时针取最小值）
  const clockwise = (targetIndex - sourceIndex + players.length) % players.length;
  const counterClockwise = (sourceIndex - targetIndex + players.length) % players.length;
  let baseDistance = Math.min(clockwise, counterClockwise);
  
  // +1 马效果
  if (target.equipment?.defenseHorse) {
    baseDistance += 1;
  }
  
  // -1 马效果
  if (source.equipment?.offenseHorse) {
    baseDistance -= 1;
  }
  
  // 朱雀羽扇效果（攻击距离 +1）
  if (source.equipment?.weapon?.key === 'quehong') {
    // 已经在武器攻击范围中体现
  }
  
  return Math.max(1, baseDistance);
}

/**
 * 检查是否可以攻击目标
 * @param {Object} source - 攻击者
 * @param {Object} target - 目标
 * @param {Array} players - 所有玩家
 * @returns {boolean}
 */
export function canAttack(source, target, players) {
  if (!target.isAlive) return false;
  if (source === target) return false;
  
  const distance = calculateDistance(source, target, players);
  const attackRange = getAttackRange(source);
  
  return distance <= attackRange;
}

/**
 * 获取攻击范围
 * @param {Object} player - 玩家
 * @returns {number} 攻击范围
 */
export function getAttackRange(player) {
  if (player.equipment?.weapon) {
    return player.equipment.weapon.range || 1;
  }
  return 1; // 默认攻击范围
}

// ========== 装备系统 ==========

/**
 * 装备武器
 * @param {Object} player - 玩家
 * @param {Object} weapon - 武器牌
 * @returns {Object|null} 被替换的武器
 */
export function equipWeapon(player, weapon) {
  if (weapon.type !== 'weapon') return null;
  
  const oldWeapon = player.equipment?.weapon || null;
  player.equipment = player.equipment || {};
  player.equipment.weapon = weapon;
  
  return oldWeapon;
}

/**
 * 装备防具
 * @param {Object} player - 玩家
 * @param {Object} armor - 防具牌
 * @returns {Object|null} 被替换的防具
 */
export function equipArmor(player, armor) {
  if (armor.type !== 'armor') return null;
  
  const oldArmor = player.equipment?.armor || null;
  player.equipment = player.equipment || {};
  player.equipment.armor = armor;
  
  return oldArmor;
}

/**
 * 装备 +1 马
 * @param {Object} player - 玩家
 * @param {Object} horse - 马牌
 * @returns {Object|null} 被替换的马
 */
export function equipDefenseHorse(player, horse) {
  if (horse.type !== 'defense_horse') return null;
  
  const oldHorse = player.equipment?.defenseHorse || null;
  player.equipment = player.equipment || {};
  player.equipment.defenseHorse = horse;
  
  return oldHorse;
}

/**
 * 装备 -1 马
 * @param {Object} player - 玩家
 * @param {Object} horse - 马牌
 * @returns {Object|null} 被替换的马
 */
export function equipOffenseHorse(player, horse) {
  if (horse.type !== 'offense_horse') return null;
  
  const oldHorse = player.equipment?.offenseHorse || null;
  player.equipment = player.equipment || {};
  player.equipment.offenseHorse = horse;
  
  return oldHorse;
}

// ========== 响应机制 ==========

/**
 * 检查是否可以出闪
 * @param {Object} player - 玩家
 * @returns {boolean}
 */
export function canUseShan(player) {
  // 八卦阵判定
  if (player.equipment?.armor?.key === 'bagua') {
    return true; // 可以判定
  }
  
  // 检查手牌
  return player.handCards.some(card => card.key === 'shan');
}

/**
 * 使用闪
 * @param {Object} player - 玩家
 * @returns {Object|null} 使用的闪
 */
export function useShan(player) {
  // 先检查手牌
  const shanIndex = player.handCards.findIndex(card => card.key === 'shan');
  if (shanIndex !== -1) {
    return player.handCards.splice(shanIndex, 1)[0];
  }
  
  // 八卦阵判定（简化处理，50% 成功率）
  if (player.equipment?.armor?.key === 'bagua') {
    const isRed = Math.random() > 0.5;
    if (isRed) {
      return { key: 'bagua_shan', name: '八卦阵·闪' };
    }
  }
  
  return null;
}

/**
 * 检查是否可以使用桃
 * @param {Object} player - 玩家
 * @returns {boolean}
 */
export function canUseTao(player) {
  // 检查手牌
  if (player.handCards.some(card => card.key === 'tao')) {
    return true;
  }
  
  // 华佗急救（红色牌当桃）
  if (player.character?.key === 'huatuo') {
    return player.handCards.some(card => {
      const suit = SUITS[card.suit];
      return suit && (suit.name === '红桃' || suit.name === '方片');
    });
  }
  
  return false;
}

/**
 * 使用桃
 * @param {Object} player - 玩家
 * @returns {Object|null} 使用的桃
 */
export function useTao(player) {
  // 先检查手牌
  const taoIndex = player.handCards.findIndex(card => card.key === 'tao');
  if (taoIndex !== -1) {
    return player.handCards.splice(taoIndex, 1)[0];
  }
  
  // 华佗急救
  if (player.character?.key === 'huatuo') {
    const redCardIndex = player.handCards.findIndex(card => {
      const suit = SUITS[card.suit];
      return suit && (suit.name === '红桃' || suit.name === '方片');
    });
    if (redCardIndex !== -1) {
      return player.handCards.splice(redCardIndex, 1)[0];
    }
  }
  
  return null;
}

// ========== 技能系统 ==========

/**
 * 检查武将技能是否触发
 * @param {Object} player - 玩家
 * @param {string} trigger - 触发时机
 * @param {Object} context - 上下文
 * @returns {Object} 技能效果
 */
export function checkSkillTrigger(player, trigger, context = {}) {
  const character = player.character;
  if (!character) return { triggered: false };
  
  switch (character.key) {
    // ========== 魏国 ==========
    case 'caocao':
      if (trigger === 'damaged' && context.card) {
        return { triggered: true, skill: '奸雄', effect: 'gain_card', card: context.card };
      }
      break;
    
    case 'simayi':
      if (trigger === 'damaged' && context.source) {
        return { triggered: true, skill: '反馈', effect: 'gain_card_from_source', source: context.source };
      }
      break;
    
    case 'xiahoudun':
      if (trigger === 'damaged') {
        const isBlack = Math.random() > 0.5; // 简化判定
        if (isBlack) {
          return { triggered: true, skill: '刚烈', effect: 'force_choice', source: context.source };
        }
      }
      break;
    
    case 'xuzhu':
      if (trigger === 'mopai') {
        return { triggered: true, skill: '裸衣', effect: 'draw_less', count: -1 };
      }
      break;
    
    case 'guojia':
      if (trigger === 'damaged') {
        return { triggered: true, skill: '遗计', effect: 'draw_cards', count: 2 };
      }
      break;
    
    case 'zhenji':
      if (trigger === 'prepare') {
        // 洛神判定
        return { triggered: true, skill: '洛神', effect: 'judge_loop' };
      }
      break;
    
    // ========== 蜀国 ==========
    case 'guanyu':
      if (trigger === 'use_card' && context.card) {
        const suit = SUITS[context.card.suit];
        if (suit && (suit.name === '红桃' || suit.name === '方片')) {
          return { triggered: true, skill: '武圣', effect: 'can_use_sha' };
        }
      }
      break;
    
    case 'zhangfei':
      if (trigger === 'use_sha') {
        return { triggered: true, skill: '咆哮', effect: 'unlimited_sha' };
      }
      break;
    
    case 'zhaoyun':
      if (trigger === 'need_shan') {
        return { triggered: true, skill: '龙胆', effect: 'sha_as_shan' };
      }
      if (trigger === 'need_sha' && !context.hasSha) {
        return { triggered: true, skill: '龙胆', effect: 'shan_as_sha' };
      }
      break;
    
    // ========== 吴国 ==========
    case 'sunquan':
      if (trigger === 'play_phase') {
        return { triggered: true, skill: '制衡', effect: 'discard_and_draw', used: false };
      }
      break;
    
    case 'luxun':
      if (trigger === 'no_cards') {
        return { triggered: true, skill: '连营', effect: 'draw_one' };
      }
      break;
    
    case 'huanggai':
      if (trigger === 'play_phase') {
        return { triggered: true, skill: '苦肉', effect: 'lose_hp_draw_cards', hp: -1, cards: 2 };
      }
      break;
    
    case 'ganning':
      if (trigger === 'use_card' && context.card) {
        if (context.card.color === '#000000') {
          return { triggered: true, skill: '奇袭', effect: 'card_as_guoheshuang' };
        }
      }
      break;
    
    // ========== 群雄 ==========
    case 'diaochan':
      if (trigger === 'end_phase') {
        return { triggered: true, skill: '闭月', effect: 'draw_one' };
      }
      break;
    
    case 'lvbu':
      if (trigger === 'use_sha' || trigger === 'use_juedou') {
        return { triggered: true, skill: '无双', effect: 'force_double_response' };
      }
      break;
    
    case 'huatuo':
      if (trigger === 'need_tao' && context.target !== player) {
        return { triggered: true, skill: '急救', effect: 'red_card_as_tao' };
      }
      break;
    
    case 'zhangjiao':
      if (trigger === 'use_shan') {
        const isHeitao = Math.random() > 0.5; // 简化判定
        if (isHeitao) {
          return { triggered: true, skill: '雷击', effect: 'lightning_damage', damage: 2 };
        }
      }
      break;
  }
  
  return { triggered: false };
}

// ========== 判定系统 ==========

/**
 * 进行判定
 * @returns {Object} 判定结果
 */
export function judge() {
  const suits = ['spade', 'heart', 'club', 'diamond'];
  const suitIndex = Math.floor(Math.random() * suits.length);
  const number = Math.floor(Math.random() * 13) + 1;
  
  const suit = SUITS[suits[suitIndex]];
  const isRed = suit.name === '红桃' || suit.name === '方片';
  const isBlack = !isRed;
  
  return {
    suit: suits[suitIndex],
    suitName: suit.name,
    suitSymbol: suit.symbol,
    number,
    isRed,
    isBlack,
    isHeitao: suits[suitIndex] === 'spade' && number >= 2 && number <= 9
  };
}

/**
 * 检查判定结果
 * @param {string} condition - 条件（red/black/heart/spade 等）
 * @param {Object} result - 判定结果
 * @returns {boolean}
 */
export function checkJudgeResult(condition, result) {
  switch (condition) {
    case 'red': return result.isRed;
    case 'black': return result.isBlack;
    case 'heart': return result.suit === 'heart';
    case 'spade': return result.suit === 'spade';
    case 'club': return result.suit === 'club';
    case 'diamond': return result.suit === 'diamond';
    case 'heitao_2_9': return result.isHeitao;
    default: return false;
  }
}

// ========== 游戏状态工具 ==========

/**
 * 检查玩家是否濒死
 * @param {Object} player - 玩家
 * @returns {boolean}
 */
export function isDying(player) {
  return player.hp <= 0 && player.isAlive;
}

/**
 * 检查游戏是否结束
 * @param {Array} players - 所有玩家
 * @returns {Object} 游戏结束信息
 */
export function checkGameOver(players) {
  const alivePlayers = players.filter(p => p.isAlive);
  
  if (alivePlayers.length <= 1) {
    return {
      over: true,
      winner: alivePlayers[0] || null,
      reason: alivePlayers.length === 0 ? '全员阵亡' : '只剩一名玩家'
    };
  }
  
  return { over: false };
}
