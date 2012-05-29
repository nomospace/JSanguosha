/**
 * 游戏包模块
 * @author: jinlu.nomospace
 * @date: 12-5-10
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
