/**
 * 游戏界面模块(UI类)
 * User: jinlu.nomospace
 * Date: 12-5-14
 * Time: 下午5:56
 */
define(function(require, exports, module) {
    var Class = require('class');
    var Room = Class.create({
        initialize: function() {

        },
        getPlayers: function() {
            return this.allPlayers;
        },
        getAlivePlayer: function() {
            return this.alivePlayers;
        },
        getAliveRoles: function() {
            return this.aliveRoles;
        },
        gameOver: function() {

        },
        slashEffect: function() {

        },
        slashResult: function() {

        },
        attachSkillToPlayer: function(player, skillName) {

        },
        detachSkillFromPlayer: function(player, skillName) {

        },
        obtainable: function(card, player) {
            if (!card) {
                return false;
            }
            var owner = this.getCardOwner(card.getId());
            var place = this.getCardPlace(card.getId());
            // player.hand TODO
            if (owner == player && place == player.hand) {
                return false;
            }
            return true;
        },
        setCardMapping: function(cardId, owner, place) {
            this.ownerMap[cardId] = owner;
            this.placeMap[cardId] = place;
        },
        getCardOwner: function(cardId) {
            return this.ownerMap(cardId);
        },
        getCardPlace: function(cardId) {
            return this.placeMap(cardId);
        },
        getRaceResult: function() {

        },
        drawCard: function() {

        },
        prepareForStart: function() {
            var mode = this.mode,
                players = this.players;
            if (mode = '02_1v1') {
                players[0].setRole('lord');
                players[1].setRole('renegade');
            }
            //
        }
    });
});
