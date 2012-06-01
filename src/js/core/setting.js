/**
 * 游戏设置模块
 * @author: nomospace
 * @date: 2012-5-9
 */
define(function(require, exports) {
    var resource = '../resource/',
        audioResource = resource + 'audio/',
        audio = {
            'card': audioResource + 'card/',
            'death': audioResource + 'death/',
            'skill': audioResource + 'skill/',
            'system': audioResource + 'system/'
        },
        imageResource = resource + 'image/',
        image = {
            'backdrop': imageResource + ' backdrop/',
            'bigCard': imageResource + 'big-card/',
            'card': imageResource + 'card/',
            'generals': imageResource + 'generals/',
            'icon': imageResource + 'icon/',
            'system': imageResource + 'system/',
            'kingdom': imageResource + 'kingdom/'
        };
    exports.audio = audio;
    exports.image = image;
});
