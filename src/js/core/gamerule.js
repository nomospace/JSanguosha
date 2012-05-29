/**
 * 游戏规则模块
 * @author: jinlu.nomospace
 * @date: 12-5-14
 */
define(function(require, exports, module) {
    var Class = require('class'),
        Logger = require('logger'),
        Skill = require('./skill');

    var GameRule = Skill.extend({
        initialize: function() {
            Logger.show('GameRule');
        },
        onPhaseChange: function(player) {
            switch (player.getPhase()) {
                case player.phase.RoundStart:
                    break;
                case player.phase.Start:
                    break;
                case player.phase.Judge:
                    break;
                case player.phase.Draw:
                    break;
                case player.phase.Play:
                    break;
                case player.phase.Discard:
                    break;
                case player.phase.Finish:
                    break;
                case player.phase.NotActive:
                    break;
            }
        },
        setGameProcess: function() {
            this.setTag()
        }
    })
});
