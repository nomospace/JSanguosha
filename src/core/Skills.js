/**
 * 技能系统 - 处理武将技能触发和效果
 */
import { SUITS } from '../config/cards';

export class SkillSystem {
  constructor(game) {
    this.game = game;
  }

  // 检查技能触发
  checkTrigger(player, trigger, context = {}) {
    const characterKey = player.character.key;
    const skillHandler = this[characterKey];
    
    if (skillHandler && typeof skillHandler === 'function') {
      return skillHandler.call(this, player, trigger, context);
    }
    
    return null;
  }

  // ========== 魏国武将 ==========

  // 曹操 - 奸雄
  caocao(player, trigger, context) {
    if (trigger === 'damaged' && context.card) {
      return {
        name: '奸雄',
        effect: 'gain_card',
        description: '获得造成伤害的牌',
        card: context.card
      };
    }
    return null;
  }

  // 司马懿 - 反馈
  simayi(player, trigger, context) {
    if (trigger === 'damaged' && context.source) {
      return {
        name: '反馈',
        effect: 'steal_card',
        description: '获得伤害来源的一张牌',
        source: context.source
      };
    }
    return null;
  }

  // 夏侯惇 - 刚烈
  xiahoudun(player, trigger, context) {
    if (trigger === 'damaged' && context.source) {
      const judge = this.game.deck.judge();
      const result = this.game.deck.getJudgeResult(judge);
      if (result.isBlack) {
        return {
          name: '刚烈',
          effect: 'force_choice',
          description: '判定为黑，伤害来源选择弃两张牌或受1点伤害',
          source: context.source,
          choices: ['discard_2', 'take_damage']
        };
      }
    }
    return null;
  }

  // 许褚 - 裸衣
  xuzhu(player, trigger, context) {
    if (trigger === 'draw_phase') {
      return {
        name: '裸衣',
        effect: 'draw_less',
        description: '少摸一张牌，杀或决斗伤害+1',
        canChoose: true
      };
    }
    if (trigger === 'calculate_damage' && context.isNaked) {
      return {
        name: '裸衣',
        effect: 'damage_plus_1',
        value: 1
      };
    }
    return null;
  }

  // 郭嘉 - 遗计
  guojia(player, trigger, context) {
    if (trigger === 'damaged') {
      return {
        name: '遗计',
        effect: 'draw_and_distribute',
        description: '摸两张牌，分配给任意角色',
        count: 2
      };
    }
    return null;
  }

  // 甄姬 - 洛神
  zhenji(player, trigger, context) {
    if (trigger === 'prepare_phase') {
      return {
        name: '洛神',
        effect: 'judge_loop',
        description: '判定直到出现红色牌，获得所有黑色牌'
      };
    }
    return null;
  }

  // ========== 蜀国武将 ==========

  // 刘备 - 仁德
  liubei(player, trigger, context) {
    if (trigger === 'play_phase') {
      return {
        name: '仁德',
        effect: 'give_cards',
        description: '给出任意张牌，每两张回复1点体力',
        canUse: true
      };
    }
    return null;
  }

  // 关羽 - 武圣
  guanyu(player, trigger, context) {
    if (trigger === 'need_sha') {
      const redCards = player.handCards.filter(c => {
        const suit = SUITS[c.suit];
        return suit && (suit.name === '红桃' || suit.name === '方片');
      });
      if (redCards.length > 0) {
        return {
          name: '武圣',
          effect: 'red_as_sha',
          description: '红色牌可以当杀使用',
          cards: redCards
        };
      }
    }
    return null;
  }

  // 张飞 - 咆哮
  zhangfei(player, trigger, context) {
    if (trigger === 'use_sha_limit') {
      return {
        name: '咆哮',
        effect: 'no_sha_limit',
        description: '使用杀无次数限制'
      };
    }
    return null;
  }

  // 诸葛亮 - 观星
  zhugeliang(player, trigger, context) {
    if (trigger === 'prepare_phase') {
      return {
        name: '观星',
        effect: 'view_and_rearrange',
        description: '观看牌堆顶X张牌并调整顺序',
        count: this.game.getAlivePlayers().length
      };
    }
    return null;
  }

  // 赵云 - 龙胆
  zhaoyun(player, trigger, context) {
    if (trigger === 'need_sha' && player.hasCard('shan')) {
      return {
        name: '龙胆',
        effect: 'shan_as_sha',
        description: '闪可以当杀使用'
      };
    }
    if (trigger === 'need_shan' && player.hasCard('sha')) {
      return {
        name: '龙胆',
        effect: 'sha_as_shan',
        description: '杀可以当闪使用'
      };
    }
    return null;
  }

  // 黄忠 - 烈弓
  huangzhong(player, trigger, context) {
    if (trigger === 'use_sha' && context.target) {
      const targetHp = context.target.hp;
      const myHp = player.hp;
      const range = player.getAttackRange();
      
      const effects = [];
      if (targetHp >= myHp) {
        effects.push('cannot_dodge');
      }
      if (targetHp <= range) {
        effects.push('damage_plus_1');
      }
      
      if (effects.length > 0) {
        return {
          name: '烈弓',
          effect: effects,
          description: '目标体力>=你则不可闪避，<=攻击范围则伤害+1'
        };
      }
    }
    return null;
  }

  // ========== 吴国武将 ==========

  // 孙权 - 制衡
  sunquan(player, trigger, context) {
    if (trigger === 'play_phase') {
      return {
        name: '制衡',
        effect: 'discard_and_draw',
        description: '弃置任意张牌，摸等量的牌',
        canUse: true,
        used: false
      };
    }
    return null;
  }

  // 周瑜 - 反间
  zhouyu(player, trigger, context) {
    if (trigger === 'play_phase') {
      return {
        name: '反间',
        effect: 'guess_suit',
        description: '令一名角色猜花色，猜错受1点伤害',
        canUse: true,
        used: false
      };
    }
    return null;
  }

  // 陆逊 - 连营
  luxun(player, trigger, context) {
    if (trigger === 'last_card_lost') {
      return {
        name: '连营',
        effect: 'draw_one',
        description: '失去最后手牌时摸一张牌'
      };
    }
    return null;
  }

  // 黄盖 - 苦肉
  huanggai(player, trigger, context) {
    if (trigger === 'play_phase') {
      return {
        name: '苦肉',
        effect: 'lose_hp_draw',
        description: '失去1点体力，摸两张牌',
        canUse: true
      };
    }
    return null;
  }

  // 大乔 - 国色
  daqiao(player, trigger, context) {
    if (trigger === 'play_phase') {
      const diamondCards = player.handCards.filter(c => c.suit === 'diamond');
      if (diamondCards.length > 0) {
        return {
          name: '国色',
          effect: 'diamond_as_lebu',
          description: '方片牌可以当乐不思蜀使用',
          cards: diamondCards
        };
      }
    }
    return null;
  }

  // 小乔 - 天香
  xiaoqiao(player, trigger, context) {
    if (trigger === 'about_to_damage') {
      const heartCards = player.handCards.filter(c => c.suit === 'heart');
      if (heartCards.length > 0) {
        return {
          name: '天香',
          effect: 'redirect_damage',
          description: '弃置红桃牌转移伤害',
          cards: heartCards
        };
      }
    }
    return null;
  }

  // 甘宁 - 奇袭
  ganning(player, trigger, context) {
    if (trigger === 'play_phase') {
      const blackCards = player.handCards.filter(c => {
        const suit = SUITS[c.suit];
        return suit && (suit.name === '黑桃' || suit.name === '梅花');
      });
      if (blackCards.length > 0) {
        return {
          name: '奇袭',
          effect: 'black_as_guohe',
          description: '黑色牌可以当过河拆桥使用',
          cards: blackCards
        };
      }
    }
    return null;
  }

  // ========== 群雄武将 ==========

  // 吕布 - 无双
  lvbu(player, trigger, context) {
    if (trigger === 'use_sha') {
      return {
        name: '无双',
        effect: 'require_double_shan',
        description: '目标需要两张闪才能抵消'
      };
    }
    if (trigger === 'be_juedou') {
      return {
        name: '无双',
        effect: 'require_double_sha',
        description: '决斗时需要两张杀'
      };
    }
    return null;
  }

  // 貂蝉 - 闭月
  diaochan(player, trigger, context) {
    if (trigger === 'end_phase') {
      return {
        name: '闭月',
        effect: 'draw_one',
        description: '结束阶段摸一张牌'
      };
    }
    return null;
  }

  // 华佗 - 急救
  huatuo(player, trigger, context) {
    if (trigger === 'need_tao' && context.isOtherPlayer) {
      const redCards = player.handCards.filter(c => {
        const suit = SUITS[c.suit];
        return suit && (suit.name === '红桃' || suit.name === '方片');
      });
      if (redCards.length > 0) {
        return {
          name: '急救',
          effect: 'red_as_tao',
          description: '红色牌可以当桃使用',
          cards: redCards
        };
      }
    }
    return null;
  }

  // 张角 - 雷击
  zhangjiao(player, trigger, context) {
    if (trigger === 'use_shan') {
      return {
        name: '雷击',
        effect: 'lightning_strike',
        description: '使用闪时可进行判定，黑桃则造成雷电伤害'
      };
    }
    return null;
  }
}