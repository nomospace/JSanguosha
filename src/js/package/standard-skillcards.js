/**
 * 标准包技能牌模块
 * @author: jinlu.nomospace
 * @date: 12-5-10
 */
define(function(require, exports, module) {
    var Class = require('class'),
        Player = require('../core/player'),
        Card = require('../core/card').Card,
        SkillCard = require('../core/card').SkillCard;

    var ZhihengCard = SkillCard.extend({
        use: function() {
            Player.getCardCount()
        }
    });
});
