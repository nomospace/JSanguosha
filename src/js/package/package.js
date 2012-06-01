/**
 * 游戏包模块
 * @author: nomospace
 * @date: 2012-5-10
 */
define(function(require, exports, module) {
    var Class = require('class');
    var Package = Class.create({
        initialize: function() {
            console.log('Package');
        },
        getType: function() {
            return type;
        }
    });
    module.exports = Package;
});
