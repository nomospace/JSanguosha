/**
 * 技能模块
 * @author: nomospace
 * @date: 2012-5-9
 */
define(function(require, exports, module) {
    var Class = require('class');
    var Skill = Class.create({
        initialize: function(name, frequency) {
            console.log('Skill');
            this.frequency = frequency;
        },
        isLordSkill: function() {

        },
        isVisible: function() {

        },
        getDescription: function() {

        },
        getText: function() {

        },
        getEffectIndex: function() {

        },
        getFrequency: function() {
            return this.frequency;
        }
    });
    Skill.frequency = {
        'Frequent': 0,
        'NotFrequent': 1,
        'Compulsory': 2,
        'Limited': 3,
        'Wake': 4
    };

    var TriggerSkill = Skill.extend({
        initialize: function() {
            console.log('TriggerSkill');
        },
        getViewAsSkill: function() {

        },
        getPriority: function() {

        },
        triggerable: function(player) {
            return false;
        },
        trigger: function(event, player, data) {

        }
    });

    var ArmorSkill = TriggerSkill.extend({
        initialize: function() {
            console.log('ArmorSkill');
        },
        triggerable: function(player) {
            return player.hasArmorEffect(name) && player.getArmor().getSkillName();
        }
    });
});
