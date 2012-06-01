/**
 * 游戏引擎模块
 * @author: nomospace
 * @date: 2012-5-9
 */
define(function(require, exports, module) {
    var Class = require('class'),
        Logger = require('logger'),
        setting = require('./setting');
    var Engine = Class.create({
        initialize: function(options) {
            Logger.show('engine: ' + options);
//            this.playSystemBGM();
        },
        getAvailableModes: function() {

        },
        getModeName: function(mode) {

        },
        getPlayerCount: function(mode) {

        },
        getRoles: function(mode, roles) {

        },
        /**
         * 播放系统背景音乐
         */
        playSystemBGM: function() {
            this.systemBGMAudio = new Audio(setting.audio.system + 'background.ogg');
            this.systemBGMAudio.loop = true;
            this.systemBGMAudio.play();
        },
        playAudio: function(name, singleton) {
            Logger.show(name);
            singleton && this.audio && this.audio.pause();
            this.audio = new Audio(name);
            this.audio.play();
        },
        playEffect: function(fileName) {

        },
        playSkillEffect: function(skillName, index) {

        },
        playCardEffect: function(cardName, isMale) {

        },
        getCardCount: function() {
            return 0;
        },
        getRandomCards: function() {
            return list;
        },
        getCard: function(index) {
            return card;
        },
        getLords: function() {

        },
        getRandomGenerals: function(count, excludeList) {

        }
    });

    module.exports = Engine;
});
