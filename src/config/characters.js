// 三国杀标准包武将（32 位完整武将）
export const CHARACTERS = [
  // ========== 魏国 (8 位) ==========
  {
    key: 'caocao',
    name: '曹操',
    kingdom: 'wei',
    hp: 4,
    skill: '奸雄',
    description: '你可以获得对你造成伤害的牌'
  },
  {
    key: 'simayi',
    name: '司马懿',
    kingdom: 'wei',
    hp: 3,
    skill: '反馈',
    description: '当你受到伤害后，你可以获得伤害来源的一张牌'
  },
  {
    key: 'xiahoudun',
    name: '夏侯惇',
    kingdom: 'wei',
    hp: 4,
    skill: '刚烈',
    description: '当你受到伤害后，你可以进行判定，若结果为黑色，伤害来源选择一项：1.弃置两张手牌 2.受到你造成的 1 点伤害'
  },
  {
    key: 'xuzhu',
    name: '许褚',
    kingdom: 'wei',
    hp: 4,
    skill: '裸衣',
    description: '摸牌阶段，你可以少摸一张牌，然后你使用【杀】或【决斗】造成伤害时，此伤害 +1'
  },
  {
    key: 'guojia',
    name: '郭嘉',
    kingdom: 'wei',
    hp: 3,
    skill: '遗计',
    description: '当你受到伤害后，你可以摸两张牌，然后将这些牌交给其他角色'
  },
  {
    key: 'zhenji',
    name: '甄姬',
    kingdom: 'wei',
    hp: 3,
    skill: '洛神',
    description: '准备阶段，你可以进行判定，若结果为黑色，你获得此牌，然后你可以重复此流程'
  },
  {
    key: 'lixidian',
    name: '李典',
    kingdom: 'wei',
    hp: 3,
    skill: '深谋',
    description: '出牌阶段，你可以弃置一张牌，然后摸两张牌'
  },
  {
    key: 'yuejin',
    name: '乐进',
    kingdom: 'wei',
    hp: 4,
    skill: '骁果',
    description: '出牌阶段，你可以弃置一张牌，令一名其他角色选择一项：1.弃置一张装备牌 2.受到你造成的 1 点伤害'
  },
  
  // ========== 蜀国 (8 位) ==========
  {
    key: 'liubei',
    name: '刘备',
    kingdom: 'shu',
    hp: 4,
    skill: '仁德',
    description: '出牌阶段，你可以将任意张手牌交给其他角色，然后你每给出两张手牌，回复 1 点体力'
  },
  {
    key: 'guanyu',
    name: '关羽',
    kingdom: 'shu',
    hp: 4,
    skill: '武圣',
    description: '你可以将红色牌当【杀】使用或打出'
  },
  {
    key: 'zhangfei',
    name: '张飞',
    kingdom: 'shu',
    hp: 4,
    skill: '咆哮',
    description: '你使用【杀】无次数限制'
  },
  {
    key: 'zhugeliang',
    name: '诸葛亮',
    kingdom: 'shu',
    hp: 3,
    skill: '观星',
    description: '准备阶段，你可以观看牌堆顶的 X 张牌（X 为存活角色数），然后以任意顺序放回或置于牌堆底'
  },
  {
    key: 'zhaoyun',
    name: '赵云',
    kingdom: 'shu',
    hp: 4,
    skill: '龙胆',
    description: '你可以将【杀】当【闪】、【闪】当【杀】使用或打出'
  },
  {
    key: 'huangzhong',
    name: '黄忠',
    kingdom: 'shu',
    hp: 4,
    skill: '烈弓',
    description: '你使用【杀】指定目标后，若目标的体力值不小于你的体力值，则此【杀】不可被响应；若目标的体力值不大于你的攻击范围，则此【杀】伤害 +1'
  },
  {
    key: 'menghuo',
    name: '孟获',
    kingdom: 'shu',
    hp: 4,
    skill: '再起',
    description: '摸牌阶段，你可以改为展示牌堆顶的 X 张牌（X 为你的已损失体力值 +1），然后你获得其中的红色牌'
  },
  {
    key: 'zhurong',
    name: '祝融',
    kingdom: 'shu',
    hp: 4,
    skill: '巨象',
    description: '锁定技，【南蛮入侵】对你无效；当其他角色使用的【南蛮入侵】结算完毕时，你可以获得之'
  },

  // ========== 吴国 (8 位) ==========
  {
    key: 'sunquan',
    name: '孙权',
    kingdom: 'wu',
    hp: 4,
    skill: '制衡',
    description: '出牌阶段限一次，你可以弃置任意张牌，然后摸等量的牌'
  },
  {
    key: 'zhouyu',
    name: '周瑜',
    kingdom: 'wu',
    hp: 3,
    skill: '反间',
    description: '出牌阶段限一次，你可以令一名其他角色选择一种花色，然后该角色获得你的一张手牌并展示之，若此牌的花色与其选择的花色不同，则其受到 1 点伤害'
  },
  {
    key: 'luxun',
    name: '陆逊',
    kingdom: 'wu',
    hp: 3,
    skill: '连营',
    description: '当你失去最后的手牌时，你可以摸一张牌'
  },
  {
    key: 'huanggai',
    name: '黄盖',
    kingdom: 'wu',
    hp: 4,
    skill: '苦肉',
    description: '出牌阶段，你可以失去 1 点体力，然后摸两张牌'
  },
  {
    key: 'daqiao',
    name: '大乔',
    kingdom: 'wu',
    hp: 3,
    skill: '国色',
    description: '出牌阶段，你可以将一张【方片】牌当【乐不思蜀】使用'
  },
  {
    key: 'xiaoqiao',
    name: '小乔',
    kingdom: 'wu',
    hp: 3,
    skill: '天香',
    description: '当你受到伤害时，你可以弃置一张红桃手牌，防止此次伤害，然后你选择一名其他角色，其受到此伤害'
  },
  {
    key: 'ganning',
    name: '甘宁',
    kingdom: 'wu',
    hp: 4,
    skill: '奇袭',
    description: '出牌阶段，你可以将一张黑色牌当【过河拆桥】使用'
  },
  {
    key: 'taishici',
    name: '太史慈',
    kingdom: 'wu',
    hp: 4,
    skill: '天义',
    description: '出牌阶段，你可以与一名角色拼点，若你赢，你本回合额外使用一张【杀】且使用【杀】无距离限制；若你没赢，你本回合不能使用【杀】'
  },

  // ========== 群雄 (8 位) ==========
  {
    key: 'lvbu',
    name: '吕布',
    kingdom: 'qun',
    hp: 5,
    skill: '无双',
    description: '你使用【杀】指定一个目标后，该角色需使用两张【闪】才能抵消；你成为【决斗】的目标后，你需出两张【杀】'
  },
  {
    key: 'diaochan',
    name: '貂蝉',
    kingdom: 'qun',
    hp: 3,
    skill: '闭月',
    description: '结束阶段，你可以摸一张牌'
  },
  {
    key: 'huatuo',
    name: '华佗',
    kingdom: 'qun',
    hp: 3,
    skill: '急救',
    description: '你的回合外，你可以将一张红色牌当【桃】使用'
  },
  {
    key: 'zhangjiao',
    name: '张角',
    kingdom: 'qun',
    hp: 3,
    skill: '雷击',
    description: '当你使用或打出【闪】时，你可以进行判定，若结果为黑桃，你对一名其他角色造成 2 点雷电伤害'
  },
  {
    key: 'yuji',
    name: '于吉',
    kingdom: 'qun',
    hp: 3,
    skill: '蛊惑',
    description: '你可以将一张手牌扣置，并声明一种基本牌或普通锦囊牌，然后其他角色可以选择是否质疑，若质疑，你展示此牌'
  },
  {
    key: 'dongzhuo',
    name: '董卓',
    kingdom: 'qun',
    hp: 8,
    skill: '暴虐',
    description: '主公技，其他群雄角色造成伤害时，你可以进行判定，若结果为黑桃，你回复 1 点体力'
  },
  {
    key: 'yuanhao',
    name: '袁术',
    kingdom: 'qun',
    hp: 4,
    skill: '妄尊',
    description: '准备阶段，你可以摸一张牌，然后你本回合使用牌无距离限制'
  },
  {
    key: 'liubiao',
    name: '刘表',
    kingdom: 'qun',
    hp: 3,
    skill: '自守',
    description: '出牌阶段，你可以展示一张手牌，然后本回合其他角色不能使用牌响应你'
  }
];

// 势力颜色
export const KINGDOM_COLORS = {
  wei: { primary: '#3498db', name: '魏', gradient: ['#2980b9', '#3498db'] },
  shu: { primary: '#2ecc71', name: '蜀', gradient: ['#27ae60', '#2ecc71'] },
  wu: { primary: '#e74c3c', name: '吴', gradient: ['#c0392b', '#e74c3c'] },
  qun: { primary: '#f39c12', name: '群', gradient: ['#d68910', '#f39c12'] }
};

// 武将头像映射（使用 DiceBear API）
export function getCharacterAvatar(key) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${key}&backgroundColor=transparent`;
}
