/**
 * 标准包模块
 * @author: jinlu.nomospace
 * @date: 12-5-10
 */
define(function(require, exports, module) {
    var Class = require('class'),
        Logger = require('logger'),
        Package = require('./package'),
        Card = require('../core/card').Card,
        SkillCard = require('../core/card').SkillCard;

    var StandardPackage = Package.extend({
        initialize: function() {
            Logger.show('StandardPackage');
            this.cards = [];
            this.cards.push(
                new Slash(Card.suit.Spade, 7),
                new Slash(Card.suit.Spade, 8),
                new Slash(Card.suit.Spade, 8),
                new Slash(Card.suit.Spade, 9),
                new Slash(Card.suit.Spade, 9),
                new Slash(Card.suit.Spade, 10),
                new Slash(Card.suit.Spade, 10),
                new Slash(Card.suit.Club, 2),
                new Slash(Card.suit.Club, 3),
                new Slash(Card.suit.Club, 4),
                new Slash(Card.suit.Club, 5),
                new Slash(Card.suit.Club, 6),
                new Slash(Card.suit.Club, 7),
                new Slash(Card.suit.Club, 8),
                new Slash(Card.suit.Club, 8),
                new Slash(Card.suit.Club, 9),
                new Slash(Card.suit.Club, 9),
                new Slash(Card.suit.Club, 10),
                new Slash(Card.suit.Club, 10),
                new Slash(Card.suit.Club, 11),
                new Slash(Card.suit.Club, 11),
                new Slash(Card.suit.Heart, 10),
                new Slash(Card.suit.Heart, 10),
                new Slash(Card.suit.Heart, 11),
                new Slash(Card.suit.Diamond, 6),
                new Slash(Card.suit.Diamond, 7),
                new Slash(Card.suit.Diamond, 8),
                new Slash(Card.suit.Diamond, 9),
                new Slash(Card.suit.Diamond, 10),
                new Slash(Card.suit.Diamond, 13),
                new Jink(Card.suit.Heart, 2),
                new Jink(Card.suit.Heart, 2),
                new Jink(Card.suit.Heart, 13),
                new Jink(Card.suit.Diamond, 2),
                new Jink(Card.suit.Diamond, 2),
                new Jink(Card.suit.Diamond, 3),
                new Jink(Card.suit.Diamond, 4),
                new Jink(Card.suit.Diamond, 5),
                new Jink(Card.suit.Diamond, 6),
                new Jink(Card.suit.Diamond, 7),
                new Jink(Card.suit.Diamond, 8),
                new Jink(Card.suit.Diamond, 9),
                new Jink(Card.suit.Diamond, 10),
                new Jink(Card.suit.Diamond, 11),
                new Jink(Card.suit.Diamond, 11),
                new Peach(Card.suit.Heart, 3),
                new Peach(Card.suit.Heart, 4),
                new Peach(Card.suit.Heart, 6),
                new Peach(Card.suit.Heart, 7),
                new Peach(Card.suit.Heart, 8),
                new Peach(Card.suit.Heart, 9),
                new Peach(Card.suit.Heart, 12),
                new Peach(Card.suit.Diamond, 12)
            )
            console.dir(this.cards);
        }
    });

    var BasicCard = Card.extend({
        initialize: function() {
            Logger.show('BasicCard');
        },
        getType: function() {
            return 'basic';
        }
    });

    var EquipCard = Card.extend({
        initialize: function() {
            Logger.show('EquipCard');
        },
        onInstall: function() {

        },
        onUninstall: function() {

        },
        onuse: function() {

        },
        getType: function() {
            return 'equip';
        },
        getLocation: function() {
            return this.location;
        }
    });

    // 静态类如何实现
    EquipCard.location = {
        WeaponLocation: 0,
        ArmorLocation: 1,
        DefensiveHorseLocation: 2,
        OffensiveHorseLocation: 3
    }

    var Weapon = EquipCard.extend({
        initialize: function(suit, number, range) {

        },
        getLocation: function() {
            return location;
        },
        onInstall: function() {

        },
        onUninstall: function() {

        }
    });


    var Slash = BasicCard.extend({
        initialize: function(suit, number) {
            this.suit = suit;
            this.number = number;
            this.objectName = 'Slash';
            Logger.show('Slash ' + 'suit:' + suit + ' number:' + number);
        },
        setNature: function(nature) {
            this.nature = nature;
        },
        isAvailable: function() {
            var player = this.player;
            return player.hashWeapon('crossbow') || player.canSlashWithoutCrossbow();
        },
        targetsFeasible: function(targets) {
            return targets.length > 0;
        },
        targetFilter: function(targets, selfPlayer, targetPlayer) {
            // targets 参数貌似无用
            var slashTargets = 1,
                distanceLimit = true;
            if (selfPlayer.hasWeapon('halberd') && selfPlayer.isLastHandCard(this)) {
                slashTargets = 3;
            }
            return selfPlayer.canSlash(targetPlayer, distanceLimit);
        }
    });

    var Jink = BasicCard.extend({
        initialize: function(suit, number) {
            this.suit = suit;
            this.number = number;
            this.objectName = 'Jink';
            Logger.show('Jink ' + 'suit:' + suit + ' number:' + number);
        },
        isAvailable: function() {
            return false;
        }
    });

    var Peach = BasicCard.extend({
        initialize: function(suit, number) {
            this.suit = suit;
            this.number = number;
            this.objectName = 'Peach';
            Logger.show('Peach ' + 'suit:' + suit + ' number:' + number);
        },
        onEffect: function() {

        },
        isAvailable: function() {
            return this.player.isWounded();
        }
    });

    exports.StandardPackage = StandardPackage;
    exports.EquipCard = EquipCard;
});
