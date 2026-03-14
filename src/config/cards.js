// 完整的卡牌数据库
export const CARDS = {
  // ========== 基本牌 ==========
  sha: {
    name: '杀',
    type: 'basic',
    suit: 'spade', // 黑桃
    count: 30,
    color: 0xe74c3c,
    description: '对一名其他角色使用，令其选择一项：1.使用【闪】抵消之 2.受到 1 点伤害',
    image: 'sha'
  },
  shan: {
    name: '闪',
    type: 'basic',
    suit: 'diamond', // 方片
    count: 15,
    color: 0x3498db,
    description: '抵消【杀】的效果',
    image: 'shan'
  },
  tao: {
    name: '桃',
    type: 'basic',
    suit: 'heart', // 红桃
    count: 8,
    color: 0x2ecc71,
    description: '出牌阶段使用，回复 1 点体力；或濒死时使用，回复 1 点体力',
    image: 'tao'
  },
  ji: {
    name: '酒',
    type: 'basic',
    suit: 'spade',
    count: 5,
    color: 0x9b59b6,
    description: '出牌阶段使用，本回合你使用的下一张【杀】造成的伤害 +1；或濒死时使用，回复 1 点体力',
    image: 'ji'
  },

  // ========== 普通锦囊 ==========
  wuzhong: {
    name: '无中生有',
    type: 'scroll',
    suit: 'heart',
    count: 4,
    color: 0xf39c12,
    description: '出牌阶段使用，摸两张牌',
    image: 'wuzhong'
  },
  juedou: {
    name: '决斗',
    type: 'scroll',
    suit: 'spade',
    count: 3,
    color: 0xe67e22,
    description: '出牌阶段对一名其他角色使用，该角色选择一项：1.对你使用一张【杀】2.受到 1 点伤害',
    image: 'juedou'
  },
  shunshou: {
    name: '顺手牵羊',
    type: 'scroll',
    suit: 'spade',
    count: 5,
    color: 0x1abc9c,
    description: '出牌阶段对距离为 1 的一名其他角色使用，获得其一张牌',
    image: 'shunshou'
  },
  guoheshuang: {
    name: '过河拆桥',
    type: 'scroll',
    suit: 'spade',
    count: 3,
    color: 0x34495e,
    description: '出牌阶段对一名其他角色使用，弃置其一张牌',
    image: 'guoheshuang'
  },
  jiedao: {
    name: '借刀杀人',
    type: 'scroll',
    suit: 'spade',
    count: 2,
    color: 0x95a5a6,
    description: '出牌阶段对装备武器的一名其他角色使用，令其对你指定的一名角色使用【杀】，否则弃置武器',
    image: 'jiedao'
  },
  wanjian: {
    name: '万箭齐发',
    type: 'scroll',
    suit: 'spade',
    count: 1,
    color: 0xe74c3c,
    description: '出牌阶段使用，所有其他角色选择一项：1.使用【闪】2.受到 1 点伤害',
    image: 'wanjian'
  },
  nanman: {
    name: '南蛮入侵',
    type: 'scroll',
    suit: 'spade',
    count: 1,
    color: 0xc0392b,
    description: '出牌阶段使用，所有其他角色选择一项：1.使用【杀】2.受到 1 点伤害',
    image: 'nanman'
  },
  taoyuan: {
    name: '桃园结义',
    type: 'scroll',
    suit: 'heart',
    count: 1,
    color: 0x2ecc71,
    description: '出牌阶段使用，所有角色回复 1 点体力',
    image: 'taoyuan'
  },
  wuke: {
    name: '无懈可击',
    type: 'scroll',
    suit: 'spade',
    count: 3,
    color: 0x8e44ad,
    description: '抵消一张普通锦囊牌的效果',
    image: 'wuke'
  },

  // ========== 延时锦囊 ==========
  lebusishu: {
    name: '乐不思蜀',
    type: 'delay',
    suit: 'heart',
    count: 3,
    color: 0xf39c12,
    description: '出牌阶段对一名其他角色使用，判定阶段进行判定，若结果不为红桃，跳过其出牌阶段',
    image: 'lebusishu'
  },
  bingliangcunduan: {
    name: '兵粮寸断',
    type: 'delay',
    suit: 'spade',
    count: 2,
    color: 0xd35400,
    description: '出牌阶段对一名其他角色使用，判定阶段进行判定，若结果不为梅花，跳过其摸牌阶段',
    image: 'bingliang'
  },
  shandian: {
    name: '闪电',
    type: 'delay',
    suit: 'spade',
    count: 2,
    color: 0x3498db,
    description: '出牌阶段使用，判定阶段进行判定，若结果为黑桃 2-9，受到 3 点雷电伤害，否则移动到下家',
    image: 'shandian'
  },

  // ========== 装备牌 ==========
  // 武器
  zhugelian: {
    name: '诸葛连弩',
    type: 'weapon',
    suit: 'spade',
    count: 2,
    color: 0x95a5a6,
    description: '攻击范围：1，你可以使用任意张【杀】',
    image: 'zhugelian',
    range: 1,
    ability: 'unlimited_sha'
  },
  qinggang: {
    name: '青釭剑',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: 0x34495e,
    description: '攻击范围：2，你使用【杀】指定目标后，无视其防具',
    image: 'qinggang',
    range: 2,
    ability: 'ignore_armor'
  },
  cidao: {
    name: '雌雄双股剑',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: 0x8e44ad,
    description: '攻击范围：2，你使用【杀】指定一名异性角色后，其选择一项：1.弃置一张手牌 2.令你摸一张牌',
    image: 'cidao',
    range: 2,
    ability: 'gender_choice'
  },
  guandin: {
    name: '贯石斧',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: 0xd35400,
    description: '攻击范围：3，你使用【杀】被抵消后，你可以弃置两张牌，令此【杀】依然造成伤害',
    image: 'guandin',
    range: 3,
    ability: 'force_hit'
  },
  fangtian: {
    name: '方天画戟',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: 0xe74c3c,
    description: '攻击范围：4，你使用的【杀】是你的最后一张手牌时，你可以额外指定至多两个目标',
    image: 'fangtian',
    range: 4,
    ability: 'multi_target'
  },
  quehong: {
    name: '雀羽',
    type: 'weapon',
    suit: 'spade',
    count: 1,
    color: 0x2ecc71,
    description: '攻击范围：5，你使用【杀】的距离 -1',
    image: 'quehong',
    range: 5,
    ability: 'distance_minus'
  },

  // 防具
  bagua: {
    name: '八卦阵',
    type: 'armor',
    suit: 'spade',
    count: 1,
    color: 0x3498db,
    description: '锁定技，当你需要使用【闪】时，你可以进行判定，若结果为红色，你视为使用一张【闪】',
    image: 'bagua',
    ability: 'bagua_shield'
  },
  renwang: {
    name: '仁王盾',
    type: 'armor',
    suit: 'spade',
    count: 1,
    color: 0x2c3e50,
    description: '锁定技，黑色的【杀】对你无效',
    image: 'renwang',
    ability: 'black_sha_immunity'
  },
  tengjia: {
    name: '藤甲',
    type: 'armor',
    suit: 'spade',
    count: 1,
    color: 0x95a5a6,
    description: '锁定技，你的【闪】+1；你受到火焰伤害时，此伤害 +1',
    image: 'tengjia',
    ability: 'fire_weakness'
  },
  shiyan: {
    name: '白银狮子',
    type: 'armor',
    suit: 'spade',
    count: 1,
    color: 0xbdc3c7,
    description: '锁定技，你每次最多受到 1 点伤害；当你失去此装备时，回复 1 点体力',
    image: 'shiyan',
    ability: 'damage_limit'
  },

  // +1 马
  horse_plus: {
    name: '+1 马',
    type: 'defense_horse',
    suit: 'spade',
    count: 2,
    color: 0x8e44ad,
    description: '锁定技，其他角色计算与你的距离时 +1',
    image: 'horse_plus',
    ability: 'defense_plus'
  },

  // -1 马
  horse_minus: {
    name: '-1 马',
    type: 'offense_horse',
    suit: 'spade',
    count: 2,
    color: 0x27ae60,
    description: '锁定技，你计算与其他角色的距离时 -1',
    image: 'horse_minus',
    ability: 'offense_minus'
  }
};

// 花色
export const SUITS = {
  spade: { name: '黑桃', color: 0x000000, symbol: '♠' },
  heart: { name: '红桃', color: 0xe74c3c, symbol: '♥' },
  club: { name: '梅花', color: 0x27ae60, symbol: '♣' },
  diamond: { name: '方片', color: 0x3498db, symbol: '♦' }
};

// 卡牌类型
export const CARD_TYPES = {
  basic: { name: '基本牌', color: 0x95a5a6 },
  scroll: { name: '锦囊牌', color: 0xf39c12 },
  delay: { name: '延时锦囊', color: 0xe67e22 },
  weapon: { name: '武器', color: 0x34495e },
  armor: { name: '防具', color: 0x3498db },
  defense_horse: { name: '+1 马', color: 0x8e44ad },
  offense_horse: { name: '-1 马', color: 0x27ae60 }
};
