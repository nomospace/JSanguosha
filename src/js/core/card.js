/**
 * 卡牌模块
 * @author: nomospace
 * @date: 2012-5-9
 */
define(function(require, exports, module) {
    var Class = require('class'),
        $ = require('jquery'),
        cardGuid = 0;
    var Card = Class.create({
        initialize: function(suit, number) {
            this.suit = suit;
            this.number = number;
        },
        isRed: function() {
            return this.suit == Card.suit.Heart || this.suit == Card.suit.Diamond;
        },
        isBlack: function() {
            return this.suit == Card.suit.Spade || this.suit == Card.suit.Club;
        },
        getNumber: function() {
            return this.number;
        },
        getSkillName: function() {
            return this.skillName;
        },
        getName: function() {
            return this.name;
        },
        getDescription: function() {
            return this.description;
        },
        getId: function() {
            return id;
        }
    });

    Card.suit = {'NoSuit': 0, 'Spade': 1, 'Heart': 2, 'Club': 3, 'Diamond': 4};
    Card.color = {'Red': 0, 'Black': 1, 'Colorless': 2};
    Card.cardType = {'Skill': 0, 'Basic': 1, 'Trick': 2, 'Equip': 3};

    var SkillCard = Card.extend({
        initialize: function() {
            console.log('SkillCard');
        }
    });

    exports.Card = Card;
    exports.SkillCard = SkillCard;
});
