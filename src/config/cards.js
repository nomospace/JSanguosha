// 三国杀标准包卡牌（108 张完整卡牌）
export const CARDS = {
  // ========== 基本牌 (56 张) ==========
  sha: {
    name: '杀',
    type: 'basic',
    suit: 'spade',
    count: 30,
    color: '#e74c3c',
    description: '对一名其他角色使用，令其选择一项：1.使用【闪】抵消之 2.受到 1 点伤害',
    image: 'sha.png'
  },
  shan: {
    name: '闪',
    type: 'basic',
    suit: 'diamond',
    count: 15,
    color: '#3498db',
    description: '抵消【杀】的效果',
    image: 'shan.png'
  },
  tao: {
    name: '桃',
    type: 'basic',
    suit: 'heart',
    count: 8,
    color: '#2ecc71',
    description: '出牌阶段使用，回复 1 点体力；或濒死时使用，回复 1 点体力',
    image: 'tao.png'
  },
  ji: {
    name: '酒',
    type: 'basic',
    suit: 'spade',
    count: 5,
    color: '#9b59b6',
    description: '出牌阶段使用，本回合你使用的下一张【杀】造成的伤害 +1；或濒死时使用，回复 1 点体力',
    image: 'jiu.png'
  },

  // ========== 普通锦囊 (36 张) ==========
  wuzhong: {
    name: '无中生有',
    type: 'scroll',
    suit: 'heart',
    count: 4,
    color: '#f39c12',
    description: '出牌阶段使用，摸两张牌',
    image: 'wuzhongshengyou.png'
  },
  juedou: {
    name: '决斗',
    type: 'scroll',
    suit: 'spade',
    count: 3,
    color: '#e67e22',
    description: '出牌阶段对一名其他角色使用，该角色选择一项：1.对你使用一张【杀】2.受到 1 点伤害',
    image: 'juedou.png'
  },
  shunshou: {
    name: '顺手牵羊',
    type: 'scroll',
    suit: 'spade',
    count: 5,
    color: '#1abc9c',
    description: '出牌阶段对距离为 1 的一名其他角色使用，获得其一张牌',
    image: 'shunshouqianyang.png'
  },
  guoheshuang: {
    name: '过河拆桥',
    type: 'scroll',
    suit: 'spade',
    count: 3,
    color: '#34495e',
    description: '出牌阶段对一名其他角色使用，弃置其一张牌',
    image: 'guohechaiqiao.png'
  },
  jiedao: {
    name: '借刀杀人',
    type: 'scroll',
    suit: 'spade',
    count: 2,
    color: '#95a5a6',
    description: '出牌阶段对装备武器的一名其他角色使用，令其对你指定的一名角色使用【杀】，否则弃置武器',
    image: 'jiedaosharen.png'
  },
  wanjian: {
    name: '万箭齐发',
    type: 'scroll',
    suit: 'spade',
    count: 1,
    color: '#e74c3c',
    description: '出牌阶段使用，所有其他角色选择一项：1.使用【闪】2.受到 1 点伤害',
    image: 'wanjianqifa.png'
  },
  nanman: {
    name: '南蛮入侵',
    type: 'scroll',
    suit: 'spade',
    count: 1,
    color: '#c0392b',
    description: '出牌阶段使用，所有其他角色选择一项：1.使用【杀】2.受到 1 点伤害',
    image: 'nanmanruqin.png'
  },
  taoyuan: {
    name: '桃园结义',
    type: 'scroll',
    suit: 'heart',
    count: 1,
    color: '#2ecc71',
    description: '出牌阶段使用，所有角色回复 1 点体力',
    image: 'taoyuanjieyi.png'
  },
  wuke: {
    name: '无懈可击',
    type: 'scroll',
    suit: 'spade',
    count: 3,
    color: '#8e44ad',
    description: '抵消一张普通锦囊牌的效果',
    image: 'wuxiekeji.png'
  },

  // ========== 延时锦囊 (7 张) ==========
  lebusishu: {
    name: '乐不思蜀',
    type: 'delay',
    suit: 'heart',
    count: 3,
    color: '#f39c12',
    description: '出牌阶段对一名其他角色使用，判定阶段进行判定，若结果不为红桃，跳过其出牌阶段',
    image: 'lebusishu.png'
  },
  bingliangcunduan: {
    name: '兵粮寸断',
    type: 'delay',
    suit: 'spade',
    count: 2,
    color: '#d35400',
    description: '出牌阶段对一名其他角色使用，判定阶段进行判定，若结果不为梅花，跳过其摸牌阶段',
    image: 'bingliangcunduan.png'
  },
  shandian: {
    name: '闪电',
    type: 'delay',
    suit: 'spade',
    count: 2,
    color: '#3498db',
    description: '出牌阶段使用，判定阶段进行判定，若结果为黑桃 2-9，受到 3 点雷电伤害，否则移动到下家',
    image: 'shandian.png'
  },

  // ========== 装备牌 (19 张) ==========
  // 武器 (9 张)
  zhugelian: {
    name: '诸葛连弩',
    type: 'weapon',
    suit: 'spade',
    count: 2,
    color: '#95a5a6',
    description: '攻击范围：1，你可以使用任意张【杀】',
    image: 'zhugelian.png',
    range: 1,
    ability: 'unlimited_sha'
  },
  qinggang: {
    name: '青釭剑',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: '#34495e',
    description: '攻击范围：2，你使用【杀】指定目标后，无视其防具',
    image: 'qinggangjian.png',
    range: 2,
    ability: 'ignore_armor'
  },
  cidao: {
    name: '雌雄双股剑',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: '#8e44ad',
    description: '攻击范围：2，你使用【杀】指定一名异性角色后，其选择一项：1.弃置一张手牌 2.令你摸一张牌',
    image: 'cixiongshuanggujian.png',
    range: 2,
    ability: 'gender_choice'
  },
  guandin: {
    name: '贯石斧',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: '#d35400',
    description: '攻击范围：3，你使用【杀】被抵消后，你可以弃置两张牌，令此【杀】依然造成伤害',
    image: 'guanshifu.png',
    range: 3,
    ability: 'force_hit'
  },
  fangtian: {
    name: '方天画戟',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: '#e74c3c',
    description: '攻击范围：4，你使用的【杀】是你的最后一张手牌时，你可以额外指定至多两个目标',
    image: 'fangtianhuaji.png',
    range: 4,
    ability: 'multi_target'
  },
  quehong: {
    name: '朱雀羽扇',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: '#2ecc71',
    description: '攻击范围：5，你使用【杀】的距离 -1',
    image: 'zhuqueyushan.png',
    range: 5,
    ability: 'distance_minus'
  },
  guanshi: {
    name: '贯石斧',
    type: 'weapon',
    suit: 'diamond',
    count: 1,
    color: '#d35400',
    description: '攻击范围：3，你使用【杀】被抵消后，你可以弃置两张牌，令此【杀】依然造成伤害',
    image: 'guanshifu.png',
    range: 3,
    ability: 'force_hit'
  },
  qilin: {
    name: '麒麟弓',
    type: 'weapon',
    suit: 'heart',
    count: 1,
    color: '#e74c3c',
    description: '攻击范围：5，你使用【杀】对目标角色造成伤害时，可以弃置其装备区里的一匹坐骑',
    image: 'qilingong.png',
    range: 5,
    ability: 'discard_mount'
  },
  hanbing: {
    name: '寒冰剑',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: '#3498db',
    description: '攻击范围：2，你使用【杀】造成伤害时，可以防止此伤害，然后弃置目标角色两张牌',
    image: 'hanbingjian.png',
    range: 2,
    ability: 'prevent_damage'
  },

  // 防具 (5 张)
  bagua: {
    name: '八卦阵',
    type: 'armor',
    suit: 'spade',
    count: 1,
    color: '#3498db',
    description: '锁定技，当你需要使用【闪】时，你可以进行判定，若结果为红色，你视为使用一张【闪】',
    image: 'baguazhen.png',
    ability: 'bagua_shield'
  },
  renwang: {
    name: '仁王盾',
    type: 'armor',
    suit: 'spade',
    count: 1,
    color: '#2c3e50',
    description: '锁定技，黑色的【杀】对你无效',
    image: 'renwangdun.png',
    ability: 'black_sha_immunity'
  },
  tengjia: {
    name: '藤甲',
    type: 'armor',
    suit: 'spade',
    count: 1,
    color: '#95a5a6',
    description: '锁定技，你的【闪】+1；你受到火焰伤害时，此伤害 +1',
    image: 'tengjia.png',
    ability: 'fire_weakness'
  },
  shiyan: {
    name: '白银狮子',
    type: 'armor',
    suit: 'spade',
    count: 1,
    color: '#bdc3c7',
    description: '锁定技，你每次最多受到 1 点伤害；当你失去此装备时，回复 1 点体力',
    image: 'baiyinshizi.png',
    ability: 'damage_limit'
  },
  huangjin: {
    name: '黄金狮子',
    type: 'armor',
    suit: 'heart',
    count: 1,
    color: '#f39c12',
    description: '锁定技，你每次最多受到 1 点伤害',
    image: 'huangjinjia.png',
    ability: 'damage_limit'
  },

  // +1 马 (3 张)
  horse_plus: {
    name: '+1 马',
    type: 'defense_horse',
    suit: 'spade',
    count: 2,
    color: '#8e44ad',
    description: '锁定技，其他角色计算与你的距离时 +1',
    image: 'jiamama.png',
    ability: 'defense_plus'
  },
  jueying: {
    name: '绝影',
    type: 'defense_horse',
    suit: 'spade',
    count: 1,
    color: '#8e44ad',
    description: '锁定技，其他角色计算与你的距离时 +1',
    image: 'jueying.png',
    ability: 'defense_plus'
  },

  // -1 马 (3 张)
  horse_minus: {
    name: '-1 马',
    type: 'offense_horse',
    suit: 'spade',
    count: 2,
    color: '#27ae60',
    description: '锁定技，你计算与其他角色的距离时 -1',
    image: 'jianmama.png',
    ability: 'offense_minus'
  },
  dawan: {
    name: '大宛马',
    type: 'offense_horse',
    suit: 'spade',
    count: 1,
    color: '#27ae60',
    description: '锁定技，你计算与其他角色的距离时 -1',
    image: 'dawanma.png',
    ability: 'offense_minus'
  }
};

// 花色
export const SUITS = {
  spade: { name: '黑桃', color: '#000000', symbol: '♠' },
  heart: { name: '红桃', color: '#e74c3c', symbol: '♥' },
  club: { name: '梅花', color: '#27ae60', symbol: '♣' },
  diamond: { name: '方片', color: '#3498db', symbol: '♦' }
};

// 卡牌类型
export const CARD_TYPES = {
  basic: { name: '基本牌', color: '#95a5a6' },
  scroll: { name: '锦囊牌', color: '#f39c12' },
  delay: { name: '延时锦囊', color: '#e67e22' },
  weapon: { name: '武器', color: '#34495e' },
  armor: { name: '防具', color: '#3498db' },
  defense_horse: { name: '+1 马', color: '#8e44ad' },
  offense_horse: { name: '-1 马', color: '#27ae60' }
};

// 卡牌图片 CDN 基础 URL（如果图片不存在，使用占位图）
export const CARD_IMAGE_BASE = 'https://raw.githubusercontent.com/nomospace/sanguosha-assets/main/cards/';

// 获取卡牌图片 URL
export function getCardImage(cardKey) {
  const card = CARDS[cardKey];
  if (!card) return null;
  return `${CARD_IMAGE_BASE}${card.image}`;
}

// 生成卡牌占位图（SVG Data URL）
export function getCardPlaceholder(cardKey) {
  const card = CARDS[cardKey];
  if (!card) return '';
  
  const suit = SUITS[card.suit];
  const bgColor = card.color.replace('#', '%23');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140">
      <defs>
        <linearGradient id="grad-${cardKey}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${card.color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect fill="url(#grad-${cardKey})" width="100" height="140" rx="8"/>
      <text x="50" y="35" text-anchor="middle" fill="#fff" font-size="24" font-weight="bold">${suit.symbol}</text>
      <text x="50" y="75" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">${card.name}</text>
      <text x="50" y="100" text-anchor="middle" fill="#f39c12" font-size="12">${CARD_TYPES[card.type].name}</text>
      <text x="50" y="125" text-anchor="middle" fill="#fff" font-size="20">${suit.symbol}</text>
    </svg>
  `.trim().replace(/\n/g, '');
  
  return `data:image/svg+xml,${svg}`;
}
