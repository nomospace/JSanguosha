/**
 * 牌堆类 - 管理牌堆和弃牌堆
 */
import { CARDS, SUITS } from '../config/cards';

export class Deck {
  constructor() {
    this.cards = [];
    this.discardPile = [];
    this.init();
  }

  // 初始化牌堆
  init() {
    this.cards = [];
    this.discardPile = [];
    let id = 0;

    Object.entries(CARDS).forEach(([key, card]) => {
      for (let i = 0; i < card.count; i++) {
        this.cards.push({
          id: id++,
          key,
          name: card.name,
          type: card.type,
          suit: card.suit,
          color: card.color,
          description: card.description,
          range: card.range,
          ability: card.ability
        });
      }
    });

    this.shuffle();
  }

  // 洗牌
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  // 摸一张牌
  draw() {
    if (this.cards.length === 0) {
      this.reshuffleDiscard();
    }
    return this.cards.pop();
  }

  // 摸多张牌
  drawMultiple(count) {
    const cards = [];
    for (let i = 0; i < count; i++) {
      const card = this.draw();
      if (card) {
        cards.push(card);
      }
    }
    return cards;
  }

  // 将弃牌堆洗入牌堆
  reshuffleDiscard() {
    if (this.discardPile.length === 0) {
      return false;
    }
    this.cards = [...this.discardPile];
    this.discardPile = [];
    this.shuffle();
    return true;
  }

  // 弃牌
  discard(card) {
    this.discardPile.push(card);
  }

  // 弃置多张牌
  discardMultiple(cards) {
    this.discardPile.push(...cards);
  }

  // 获取牌堆剩余数量
  getRemaining() {
    return this.cards.length;
  }

  // 获取弃牌堆数量
  getDiscardCount() {
    return this.discardPile.length;
  }

  // 判定（摸一张判定牌并弃置）
  judge() {
    const card = this.draw();
    if (card) {
      this.discard(card);
    }
    return card;
  }

  // 获取判定结果
  getJudgeResult(card) {
    if (!card) return null;
    
    const suit = SUITS[card.suit];
    const isRed = suit.name === '红桃' || suit.name === '方片';
    const isBlack = !isRed;
    const isHeitao = card.suit === 'spade' && card.number >= 2 && card.number <= 9;

    return {
      card,
      suitName: suit.name,
      suitSymbol: suit.symbol,
      isRed,
      isBlack,
      isHeitao,
      isHeart: card.suit === 'heart',
      isSpade: card.suit === 'spade',
      isClub: card.suit === 'club',
      isDiamond: card.suit === 'diamond'
    };
  }
}