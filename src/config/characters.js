// 完整的武将数据库（25 位武将）
export const CHARACTERS = [
  // ========== 魏国 ==========
  {
    key: 'caocao',
    name: '曹操',
    kingdom: 'wei',
    hp: 4,
    skill: '奸雄',
    description: '你可以获得对你造成伤害的牌',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=caocao&backgroundColor=b6e3f4'
  },
  {
    key: 'simayi',
    name: '司马懿',
    kingdom: 'wei',
    hp: 3,
    skill: '反馈',
    description: '当你受到伤害后，你可以获得伤害来源的一张牌',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=simayi&backgroundColor=c0aede'
  },
  {
    key: 'xiahoudun',
    name: '夏侯惇',
    kingdom: 'wei',
    hp: 4,
    skill: '刚烈',
    description: '当你受到伤害后，你可以进行判定，若结果为黑色，伤害来源选择一项：1.弃置两张手牌 2.受到你造成的 1 点伤害',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiahoudun&backgroundColor=d1d4f9'
  },
  {
    key: 'xuzhu',
    name: '许褚',
    kingdom: 'wei',
    hp: 4,
    skill: '裸衣',
    description: '摸牌阶段，你可以少摸一张牌，然后你使用【杀】或【决斗】造成伤害时，此伤害 +1',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xuzhu&backgroundColor=ffdfbf'
  },
  {
    key: 'guojia',
    name: '郭嘉',
    kingdom: 'wei',
    hp: 3,
    skill: '遗计',
    description: '当你受到伤害后，你可以摸两张牌，然后将这些牌交给其他角色',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guojia&backgroundColor=c0aede'
  },
  {
    key: 'zhenji',
    name: '甄姬',
    kingdom: 'wei',
    hp: 3,
    skill: '洛神',
    description: '准备阶段，你可以进行判定，若结果为黑色，你获得此牌，然后你可以重复此流程',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhenji&backgroundColor=ffb6c1'
  },
  
  // ========== 蜀国 ==========
  {
    key: 'liubei',
    name: '刘备',
    kingdom: 'shu',
    hp: 4,
    skill: '仁德',
    description: '出牌阶段，你可以将任意张手牌交给其他角色，然后你每给出两张手牌，回复 1 点体力',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liubei&backgroundColor=d1d4f9'
  },
  {
    key: 'guanYu',
    name: '关羽',
    kingdom: 'shu',
    hp: 4,
    skill: '武圣',
    description: '你可以将红色牌当【杀】使用或打出',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guanyu&backgroundColor=ffb6c1'
  },
  {
    key: 'zhangfei',
    name: '张飞',
    kingdom: 'shu',
    hp: 4,
    skill: '咆哮',
    description: '你使用【杀】无次数限制',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangfei&backgroundColor=ffdfbf'
  },
  {
    key: 'zhugeliang',
    name: '诸葛亮',
    kingdom: 'shu',
    hp: 3,
    skill: '观星',
    description: '准备阶段，你可以观看牌堆顶的 X 张牌（X 为存活角色数），然后以任意顺序放回或置于牌堆底',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhugeliang&backgroundColor=c0aede'
  },
  {
    key: 'zhaoyun',
    name: '赵云',
    kingdom: 'shu',
    hp: 4,
    skill: '龙胆',
    description: '你可以将【杀】当【闪】、【闪】当【杀】使用或打出',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoyun&backgroundColor=b6e3f4'
  },
  {
    key: 'huangzhong',
    name: '黄忠',
    kingdom: 'shu',
    hp: 4,
    skill: '烈弓',
    description: '你使用【杀】指定目标后，若目标的体力值不小于你的体力值，则此【杀】不可被响应；若目标的体力值不大于你的攻击范围，则此【杀】伤害 +1',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=huangzhong&backgroundColor=ffdfbf'
  },
  {
    key: 'menghuo',
    name: '孟获',
    kingdom: 'shu',
    hp: 4,
    skill: '再起',
    description: '摸牌阶段，你可以改为展示牌堆顶的 X 张牌（X 为你的已损失体力值 +1），然后你获得其中的红色牌',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=menghuo&backgroundColor=ffdfbf'
  },

  // ========== 吴国 ==========
  {
    key: 'sunquan',
    name: '孙权',
    kingdom: 'wu',
    hp: 4,
    skill: '制衡',
    description: '出牌阶段限一次，你可以弃置任意张牌，然后摸等量的牌',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunquan&backgroundColor=ffb6c1'
  },
  {
    key: 'zhouyu',
    name: '周瑜',
    kingdom: 'wu',
    hp: 3,
    skill: '反间',
    description: '出牌阶段限一次，你可以令一名其他角色选择一种花色，然后该角色获得你的一张手牌并展示之，若此牌的花色与其选择的花色不同，则其受到 1 点伤害',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhouyu&backgroundColor=d1d4f9'
  },
  {
    key: 'luxun',
    name: '陆逊',
    kingdom: 'wu',
    hp: 3,
    skill: '连营',
    description: '当你失去最后的手牌时，你可以摸一张牌',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luxun&backgroundColor=b6e3f4'
  },
  {
    key: 'huanggai',
    name: '黄盖',
    kingdom: 'wu',
    hp: 4,
    skill: '苦肉',
    description: '出牌阶段，你可以失去 1 点体力，然后摸两张牌',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=huanggai&backgroundColor=ffdfbf'
  },
  {
    key: 'daqiao',
    name: '大乔',
    kingdom: 'wu',
    hp: 3,
    skill: '国色',
    description: '出牌阶段，你可以将一张【方片】牌当【乐不思蜀】使用',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=daqiao&backgroundColor=ffb6c1'
  },
  {
    key: 'xiaqiao',
    name: '小乔',
    kingdom: 'wu',
    hp: 3,
    skill: '天香',
    description: '当你受到伤害时，你可以弃置一张红桃手牌，防止此次伤害，然后你选择一名其他角色，其受到此伤害',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoqiao&backgroundColor=ffb6c1'
  },

  // ========== 群雄 ==========
  {
    key: 'lvbu',
    name: '吕布',
    kingdom: 'qun',
    hp: 5,
    skill: '无双',
    description: '你使用【杀】指定一个目标后，该角色需使用两张【闪】才能抵消；你成为【决斗】的目标后，你需出两张【杀】',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lvbu&backgroundColor=ffdfbf'
  },
  {
    key: 'diaochan',
    name: '貂蝉',
    kingdom: 'qun',
    hp: 3,
    skill: '闭月',
    description: '结束阶段，你可以摸一张牌',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diaochan&backgroundColor=ffb6c1'
  },
  {
    key: 'huatuo',
    name: '华佗',
    kingdom: 'qun',
    hp: 3,
    skill: '急救',
    description: '你的回合外，你可以将一张红色牌当【桃】使用',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=huatuo&backgroundColor=c0aede'
  },
  {
    key: 'zhangjiao',
    name: '张角',
    kingdom: 'qun',
    hp: 3,
    skill: '雷击',
    description: '当你使用或打出【闪】时，你可以进行判定，若结果为黑桃，你对一名其他角色造成 2 点雷电伤害',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangjiao&backgroundColor=d1d4f9'
  },
  {
    key: 'yuji',
    name: '于吉',
    kingdom: 'qun',
    hp: 3,
    skill: '蛊惑',
    description: '你可以将一张手牌扣置，并声明一种基本牌或普通锦囊牌，然后其他角色可以选择是否质疑，若质疑，你展示此牌',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yuji&backgroundColor=c0aede'
  },
  {
    key: 'dongzhuo',
    name: '董卓',
    kingdom: 'qun',
    hp: 8,
    skill: '暴虐',
    description: '主公技，其他群雄角色造成伤害时，你可以进行判定，若结果为黑桃，你回复 1 点体力',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dongzhuo&backgroundColor=ffdfbf'
  },
  {
    key: 'yuanhao',
    name: '袁术',
    kingdom: 'qun',
    hp: 4,
    skill: '妄尊',
    description: '准备阶段，你可以摸一张牌，然后你本回合使用牌无距离限制',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yuanhao&backgroundColor=ffdfbf'
  }
];

// 势力颜色
export const KINGDOM_COLORS = {
  wei: { primary: 0x3498db, name: '魏', gradient: [0x2980b9, 0x3498db] },
  shu: { primary: 0x2ecc71, name: '蜀', gradient: [0x27ae60, 0x2ecc71] },
  wu: { primary: 0xe74c3c, name: '吴', gradient: [0xc0392b, 0xe74c3c] },
  qun: { primary: 0xf39c12, name: '群', gradient: [0xd68910, 0xf39c12] }
};
