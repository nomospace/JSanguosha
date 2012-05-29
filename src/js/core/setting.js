/**
 * 游戏设置模块
 * @author: jinlu.nomospace
 * @date: 12-5-9
 */
define(function(require, exports, module) {
    var resource = '../../resource/',
        audioResource = resource + 'audio/',
        audio = {
            card: audioResource + 'card/',
            death: audioResource + 'death/',
            skill: audioResource + 'skill/',
            system: audioResource + 'system/'
        },
        imageResource = resource + 'image/',
        image = {
            backdrop: imageResource + ' backdrop/',
            bigCard: imageResource + 'big-card/',
            card: imageResource + 'card/',
            generals: imageResource + 'generals/',
            icon: imageResource + 'icon/',
            system: imageResource + 'system/',
            kingdom: imageResource + 'kingdom/'
        };
    exports.audio = audio;
    exports.image = image;
});
