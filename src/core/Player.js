/**
 * 玩家类 - 封装玩家状态和行为
 */
export class Player {
  constructor(index, character) {
    this.index = index;
    this.character = character;
    this.hp = character.hp;
    this.maxHp = character.hp;
    this.handCards = [];
    this.equipment = {
      weapon: null,
      armor: null,
      defenseHorse: null,  // +1 马
      offenseHorse: null   // -1 马
    };
    this.judgeCards = [];  // 判定区的牌（乐不思蜀、闪电等）
    this.isAlive = true;
    this.hasUsedSha = false;
    this.hasUsedJiu = false;
    this.drunken = false;  // 是否喝酒了
  }

  // 获取攻击范围
  getAttackRange() {
    return this.equipment.weapon?.range || 1;
  }

  // 检查是否有诸葛连弩
  hasZhugeliannu() {
    return this.equipment.weapon?.key === 'zhugelian';
  }

  // 检查是否有八卦阵
  hasBagua() {
    return this.equipment.armor?.key === 'bagua';
  }

  // 检查是否有仁王盾
  hasRenwang() {
    return this.equipment.armor?.key === 'renwang';
  }

  // 获取手牌数
  getHandCount() {
    return this.handCards.length;
  }

  // 获取手牌上限
  getMaxCards() {
    return this.hp;  // 手牌上限等于体力值
  }

  // 是否需要弃牌
  needsDiscard() {
    return this.handCards.length > this.getMaxCards();
  }

  // 受到伤害
  takeDamage(amount = 1) {
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) {
      this.isAlive = false;
    }
    return this.hp <= 0;
  }

  // 回复体力
  heal(amount = 1) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    return this.hp;
  }

  // 摸牌
  drawCards(cards) {
    this.handCards.push(...cards);
  }

  // 弃牌
  discardCard(index) {
    return this.handCards.splice(index, 1)[0];
  }

  // 使用牌
  useCard(index) {
    const card = this.handCards[index];
    this.handCards.splice(index, 1);
    return card;
  }

  // 装备武器
  equipWeapon(weapon) {
    const oldWeapon = this.equipment.weapon;
    this.equipment.weapon = weapon;
    return oldWeapon;
  }

  // 装备防具
  equipArmor(armor) {
    const oldArmor = this.equipment.armor;
    this.equipment.armor = armor;
    return oldArmor;
  }

  // 装备 +1 马
  equipDefenseHorse(horse) {
    const oldHorse = this.equipment.defenseHorse;
    this.equipment.defenseHorse = horse;
    return oldHorse;
  }

  // 装备 -1 马
  equipOffenseHorse(horse) {
    const oldHorse = this.equipment.offenseHorse;
    this.equipment.offenseHorse = horse;
    return oldHorse;
  }

  // 检查是否有某种类型的牌
  hasCardType(type) {
    return this.handCards.some(card => card.type === type);
  }

  // 检查是否有某张牌
  hasCard(key) {
    return this.handCards.some(card => card.key === key);
  }

  // 获取某张牌的索引
  getCardIndex(key) {
    return this.handCards.findIndex(card => card.key === key);
  }

  // 获取所有某类型的牌
  getCardsByType(type) {
    return this.handCards.filter(card => card.type === type);
  }

  // 序列化（用于 UI 更新）
  toJSON() {
    return {
      index: this.index,
      character: this.character,
      hp: this.hp,
      maxHp: this.maxHp,
      handCount: this.handCards.length,
      equipment: this.equipment,
      isAlive: this.isAlive
    };
  }
}