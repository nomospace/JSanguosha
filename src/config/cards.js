// 三国杀标准包卡牌（108 张）
export const CARDS = {
  // ========== 基本牌 (56 张) ==========
  sha: {
    name: '杀',
    type: 'basic',
    suit: 'spade',
    count: 30,
    color: '#e74c3c',
    description: '对一名其他角色使用，令其选择一项：1.使用【闪】抵消之 2.受到 1 点伤害',
    image: 'sha'
  },
  shan: {
    name: '闪',
    type: 'basic',
    suit: 'diamond',
    count: 15,
    color: '#3498db',
    description: '抵消【杀】的效果',
    image: 'shan'
  },
  tao: {
    name: '桃',
    type: 'basic',
    suit: 'heart',
    count: 8,
    color: '#2ecc71',
    description: '出牌阶段使用，回复 1 点体力；或濒死时使用，回复 1 点体力',
    image: 'tao'
  },
  ji: {
    name: '酒',
    type: 'basic',
    suit: 'spade',
    count: 5,
    color: '#9b59b6',
    description: '出牌阶段使用，本回合你使用的下一张【杀】造成的伤害 +1；或濒死时使用，回复 1 点体力',
    image: 'jiu'
  },

  // ========== 普通锦囊 (36 张) ==========
  wuzhong: {
    name: '无中生有',
    type: 'scroll',
    suit: 'heart',
    count: 4,
    color: '#f39c12',
    description: '出牌阶段使用，摸两张牌',
    image: 'wuzhongshengyou'
  },
  juedou: {
    name: '决斗',
    type: 'scroll',
    suit: 'spade',
    count: 3,
    color: '#e67e22',
    description: '出牌阶段对一名其他角色使用，该角色选择一项：1.对你使用一张【杀】2.受到 1 点伤害',
    image: 'juedou'
  },
  shunshou: {
    name: '顺手牵羊',
    type: 'scroll',
    suit: 'spade',
    count: 5,
    color: '#1abc9c',
    description: '出牌阶段对距离为 1 的一名其他角色使用，获得其一张牌',
    image: 'shunshouqianyang'
  },
  guoheshuang: {
    name: '过河拆桥',
    type: 'scroll',
    suit: 'spade',
    count: 3,
    color: '#34495e',
    description: '出牌阶段对一名其他角色使用，弃置其一张牌',
    image: 'guohechaiqiao'
  },
  jiedao: {
    name: '借刀杀人',
    type: 'scroll',
    suit: 'spade',
    count: 2,
    color: '#95a5a6',
    description: '出牌阶段对装备武器的一名其他角色使用，令其对你指定的一名角色使用【杀】，否则弃置武器',
    image: 'jiedaosharen'
  },
  wanjian: {
    name: '万箭齐发',
    type: 'scroll',
    suit: 'spade',
    count: 1,
    color: '#e74c3c',
    description: '出牌阶段使用，所有其他角色选择一项：1.使用【闪】2.受到 1 点伤害',
    image: 'wanjianqifa'
  },
  nanman: {
    name: '南蛮入侵',
    type: 'scroll',
    suit: 'spade',
    count: 1,
    color: '#c0392b',
    description: '出牌阶段使用，所有其他角色选择一项：1.使用【杀】2.受到 1 点伤害',
    image: 'nanmanruqin'
  },
  taoyuan: {
    name: '桃园结义',
    type: 'scroll',
    suit: 'heart',
    count: 1,
    color: '#2ecc71',
    description: '出牌阶段使用，所有角色回复 1 点体力',
    image: 'taoyuanjieyi'
  },
  wuke: {
    name: '无懈可击',
    type: 'scroll',
    suit: 'spade',
    count: 3,
    color: '#8e44ad',
    description: '抵消一张普通锦囊牌的效果',
    image: 'wuxiekeji'
  },

  // ========== 延时锦囊 (7 张) ==========
  lebusishu: {
    name: '乐不思蜀',
    type: 'delay',
    suit: 'heart',
    count: 3,
    color: '#f39c12',
    description: '出牌阶段对一名其他角色使用，判定阶段进行判定，若结果不为红桃，跳过其出牌阶段',
    image: 'lebusishu'
  },
  bingliangcunduan: {
    name: '兵粮寸断',
    type: 'delay',
    suit: 'spade',
    count: 2,
    color: '#d35400',
    description: '出牌阶段对一名其他角色使用，判定阶段进行判定，若结果不为梅花，跳过其摸牌阶段',
    image: 'bingliangcunduan'
  },
  shandian: {
    name: '闪电',
    type: 'delay',
    suit: 'spade',
    count: 2,
    color: '#3498db',
    description: '出牌阶段使用，判定阶段进行判定，若结果为黑桃 2-9，受到 3 点雷电伤害，否则移动到下家',
    image: 'shandian'
  },

  // ========== 装备牌 (19 张) ==========
  zhugelian: {
    name: '诸葛连弩',
    type: 'weapon',
    suit: 'spade',
    count: 2,
    color: '#95a5a6',
    description: '攻击范围：1，你可以使用任意张【杀】',
    image: 'zhugelian',
    range: 1
  },
  qinggang: {
    name: '青釭剑',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: '#34495e',
    description: '攻击范围：2，你使用【杀】指定目标后，无视其防具',
    image: 'qinggangjian',
    range: 2
  },
  cidao: {
    name: '雌雄双股剑',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: '#8e44ad',
    description: '攻击范围：2，你使用【杀】指定一名异性角色后，其选择一项：1.弃置一张手牌 2.令你摸一张牌',
    image: 'cixiongshuanggujian',
    range: 2
  },
  guandin: {
    name: '贯石斧',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: '#d35400',
    description: '攻击范围：3，你使用【杀】被抵消后，你可以弃置两张牌，令此【杀】依然造成伤害',
    image: 'guanshifu',
    range: 3
  },
  fangtian: {
    name: '方天画戟',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: '#e74c3c',
    description: '攻击范围：4，你使用的【杀】是你的最后一张手牌时，你可以额外指定至多两个目标',
    image: 'fangtianhuaji',
    range: 4
  },
  qilin: {
    name: '麒麟弓',
    type: 'weapon',
    suit: 'heart',
    count: 1,
    color: '#e74c3c',
    description: '攻击范围：5，你使用【杀】对目标角色造成伤害时，可以弃置其装备区里的一匹坐骑',
    image: 'qilingong',
    range: 5
  },

  // 防具
  bagua: {
    name: '八卦阵',
    type: 'armor',
    suit: 'spade',
    count: 1,
    color: '#3498db',
    description: '锁定技，当你需要使用【闪】时，你可以进行判定，若结果为红色，你视为使用一张【闪】',
    image: 'baguazhen'
  },
  renwang: {
    name: '仁王盾',
    type: 'armor',
    suit: 'spade',
    count: 1,
    color: '#2c3e50',
    description: '锁定技，黑色的【杀】对你无效',
    image: 'renwangdun'
  },

  // +1 马
  horse_plus: {
    name: '+1 马',
    type: 'defense_horse',
    suit: 'spade',
    count: 2,
    color: '#8e44ad',
    description: '锁定技，其他角色计算与你的距离时 +1',
    image: 'dawanma'
  },

  // -1 马
  horse_minus: {
    name: '-1 马',
    type: 'offense_horse',
    suit: 'spade',
    count: 2,
    color: '#27ae60',
    description: '锁定技，你计算与其他角色的距离时 -1',
    image: 'chitu'
  }
};

// 花色
export const SUITS = {
  spade: { name: '黑桃', color: '#2c3e50', symbol: '♠' },
  heart: { name: '红桃', color: '#e74c3c', symbol: '♥' },
  club: { name: '梅花', color: '#27ae60', symbol: '♣' },
  diamond: { name: '方片', color: '#3498db', symbol: '♦' }
};

// 卡牌类型
export const CARD_TYPES = {
  basic: { name: '基本牌', color: '#95a5a6' },
  scroll: { name: '锦囊牌', color: '#f39c12' },
  delay: { name: '延时锦囊', color: '#e67e22' },
  weapon: { name: '武器', color: '#e74c3c' },
  armor: { name: '防具', color: '#3498db' },
  defense_horse: { name: '+1马', color: '#9b59b6' },
  offense_horse: { name: '-1马', color: '#27ae60' }
};

// 卡牌图片 URL（使用 BWIKI 资源）
export const CARD_IMAGE_BASE = 'https://patchwiki.biligame.com/images/msgs/';

// 卡牌图片映射
const CARD_IMAGE_MAP = {
  sha: '杀',
  shan: '闪', 
  tao: '桃',
  ji: '酒',
  wuzhong: '无中生有',
  juedou: '决斗',
  shunshou: '顺手牵羊',
  guoheshuang: '过河拆桥',
  nanman: '南蛮入侵',
  wanjian: '万箭齐发',
  lebusishu: '乐不思蜀',
  bingliangcunduan: '兵粮寸断',
  shandian: '闪电',
  zhugelian: '诸葛连弩',
  bagua: '八卦阵'
};

// 获取卡牌图片 URL
export function getCardImage(cardKey) {
  // 使用本地 SVG 占位图
  return null;
}

// 生成卡牌 SVG 占位图
export function getCardPlaceholder(cardKey) {
  const card = CARDS[cardKey];
  if (!card) return '';
  
  const suit = SUITS[card.suit];
  const suitColor = suit.color;
  const bgColor = card.color;
  
  // 使用 CardUID 生成更精美的卡牌
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 110">
    <defs>
      <linearGradient id="bg-${cardKey}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
      </linearGradient>
      <filter id="shadow-${cardKey}">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
      </filter>
    </defs>
    <rect fill="url(#bg-${cardKey})" width="80" height="110" rx="6"/>
    <rect fill="none" stroke="rgba(255,255,255,0.3)" width="76" height="106" rx="4" x="2" y="2"/>
    <text x="12" y="22" fill="${suitColor}" font-size="20" font-weight="bold">${suit.symbol}</text>
    <text x="68" y="22" fill="${suitColor}" font-size="16" text-anchor="end">${suit.symbol}</text>
    <text x="40" y="60" fill="#fff" font-size="16" font-weight="bold" text-anchor="middle">${card.name}</text>
    <text x="40" y="78" fill="rgba(255,255,255,0.7)" font-size="9" text-anchor="middle">${CARD_TYPES[card.type].name}</text>
    <text x="40" y="98" fill="${suitColor}" font-size="14" text-anchor="middle">${suit.symbol}</text>
  </svg>`;
  
  return `data:image/svg+xml,${encodeURIComponent(svg.trim())}`;
}