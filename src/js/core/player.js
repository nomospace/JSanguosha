/**
 * 玩家模块
 * @author: jinlu.nomospace
 * @date: 12-5-9
 */
define(function(require, exports, module) {
    var Class = require('class'),
        EquipCard = require('../package/standard').EquipCard;

    var Player = Class.create({
        initialize: function() {

        },
        getHp: function() {
            return this.hp;
        },
        setHp: function(hp) {
            if (this.hp < this.maxHp && this.hp != hp) {
                this.hp = hp;
                this.trigger('stateChanged');
            }
        },
        getMaxHp: function() {
            return this.maxHp;
        },
        getLostHp: function() {
            return this.maxHp - Math.max(this.hp, 0);
        },
        isWounded: function() {
            if (this.hp < 0) {
                return true;
            } else {
                return this.hp < this.maxHp;
            }
        },
        getGender: function() {
            return this.general.getGender();
        },
        getKingdom: function() {
            return this.kingdom;
        },
        getKingdomIcon: function() {
            return 'image/kingdom/icon/%.png'.replace('%', this.kingdom);
        },
        getKingdomFrame: function() {
            return 'image/kingdom/frame/%.png'.replace('%', this.kingdom);
        },
        getSeat: function() {
            return this.seat;
        },
        setSeat: function(seat) {
            this.seat = seat;
        },
        getPhase: function() {
            return this.phase;
        },
        isAlive: function() {
            return this.alive;
        },
        isDead: function() {
            return !this.alive;
        },
        setAlive: function(alive) {
            this.alive = !!alive;
        },
        distanceTo: function(other) {
            var distance = this.distance;
            if (this.player == other) {
                return 0;
            }
            // todo
            if (distance < 1) {
                distance = 1;
            }
            return distance;
        },
        isLord: function() {
            return this.getRole() == 'lord';
        },
        setEquip: function(card) {
            switch (card.getLocation()) {
                case EquipCard.location.WeaponLocation:
                    this.weaponCard = true;
                    break;
                case EquipCard.location.ArmorLocation:
                    this.armorCard = true;
                    break;
                case EquipCard.location.DefensiveHorseLocation:
                    this.defensiveHorseCard = true;
                    break;
                case EquipCard.location.OffensiveHorseLocation:
                    this.offensiveHorseCard = true;
                    break;
            }
        },
        removeEquip: function(card) {
            switch (card.getLocation()) {
                case EquipCard.location.WeaponLocation:
                    this.weaponCard = true;
                    break;
                case EquipCard.location.ArmorLocation:
                    this.armorCard = true;
                    break;
                case EquipCard.location.DefensiveHorseLocation:
                    this.defensiveHorseCard = true;
                    break;
                case EquipCard.location.OffensiveHorseLocation:
                    this.offensiveHorseCard = true;
                    break;
            }
        },
        hasEquip: function(card) {
            return this.weaponCard == card ||
                this.armorCard == card ||
                this.defensiveHorseCard == card ||
                this.offensiveHorseCard == card;
        },
        getEquips: function() {
            var list = [];
            if (this.weaponCard) {
                list.push(this.weaponCard);
            }
            if (this.armorCard) {
                list.push(this.armorCard);
            }
            if (this.defensiveHorseCard) {
                list.push(this.defensiveHorseCard);
            }
            if (this.offensiveHorseCard) {
                list.push(this.offensiveHorseCard);
            }
            return list;
        },
        addDelayedTrick: function(trickCard) {
            this.judgingArea.push(trickCard);
            this.delayTricks.push(DelayedTrick.CastFrom(trickCard));
        },
        removeDelayedTrick: function(trickCard) {
            var index = this.judgingArea.indexOf(trickCard);
            if (index >= 0) {
                this.judgingArea.splice(index, 1);
                this.delayTricks.splice(index, 1);
            }
        },
        getJudgingArea: function() {
            return this.judgingArea;
        },
        getHandcardNum: function() {
            return this.handcardNum;
        },
        getCardCount: function(includeEquip) {
            var count = this.getHandcardNum();
            if (includeEquip) {
                this.weaponCard && count++;
                this.armorCard && count++;
                this.defensiveHorseCard && count++;
                this.offensiveHorseCard && count++;
            }
            return count;
        },
        addCard: function(card, place) {
            switch (place) {
                case Player.place.Hand:
                    if (card) {
                        this.knownCards.push(card);
                    }
                    this.handcardNum++;
                    break;
                case Player.place.Equip:
                    this.setEquip(card);
                    break;
                case Player.place.Judging:
                    this.addDelayedTrick(card);
                    break;
                default:
                    // FIXME
                    ;
            }
        },
        removeCard: function(card, place) {
            switch (place) {
                case Player.place.Hand:
                    this.handcardNum--;
                    if (card) {
                        this.knownCards.remove(card);
                    }
                    break;
                case Player.place.Equip:
                    this.removeEquip(card);
                    break;
                case Player.place.Judging:
                    this.removeDelayedTrick(card);
                    break;
                default:
                    // FIXME
                    ;
            }
        },
        getWeapon: function() {
            return this.weaponCard;
        },
        getArmor: function() {
            return this.armorCard;
        },
        getDefensiveHorse: function() {
            return this.defensiveHorseCard;
        },
        getOffensiveHorse: function() {
            return this.offensiveHorseCard;
        },
        hasWeapon: function(name) {
            return this.weaponCard.getName() == name;
        },
        hasArmorEffect: function(name) {

        },
        setChained: function(chained) {
            if (this.chained != chained) {
                this.chained = chained;
                this.trigger('stateChanged');
            }
        },
        isChained: function() {
            return this.chained;
        },
        canSlash: function(other, distanceLimit) {

        },
        isLastHandCard: function(card) {
            if (this.knownCards.length != 1)
                return false;
        },
        hasFlag: function(flag) {
            return this.flags.contains(flag)
        },
        clearFlag: function() {
            this.flags.clear();
        },
        canSlashWithoutCrossbow: function() {
            if (this.hasSkill('paoxiao')) {
                return true;
            }
            var slashCount = this.getSlashCount(),
                validSlashCount = 1;
            return slashCount < validSlashCount;
        },
        hasSkill: function(name) {
            return this.hasInnateSkill(name);
        },
        hasLordSkill: function(name) {
            return this.isLord() && this.hasInnateSkill(name);
        },
        hasInnateSkill: function(name) {
            if (this.hasSkill(name)) {
                return true;
            }
            return false;
        },
        getSlashCount: function() {
            var history = this.history;
            return history['Slash'] + history['FireSlash'] + history['ThunderSlash'];
        },
        setRole: function(role) {
            this.role = role;
        },
        getRole: function() {
            return this.role;
        }
    });

    Player.phase = {
        'RoundStart': 0,
        'Start': 1,
        'Judge': 2,
        'Draw': 3,
        'Play': 4,
        'Discard': 5,
        'Finish': 6,
        'NotActive': 7
    }

    Player.role = {
        'Lord': 0,
        'Loyalist': 1,
        'Rebel': 2,
        'Renegade': 3
    }

    Player.place = {
        'Hand': 0,
        'Equip': 1,
        'Judging': 2,
        'Special': 3,
        'DiscardedPile': 4,
        'DrawPile': 5
    }

    var Weapon = Class.create({
        initialize: function() {
            console.log('Weapon');
        }
    });
    module.exports = Player;
});
