/**
 * 工具模块
 * @author: nomospace
 * @date: 2012-5-9
 */
define(function(require, exports, module) {
    // http://www.silverna.org/blog/?p=65 洗牌算法
    function playCard(cardType, cardNum) {
        var cards = [];
        for (var i = 0; i < cardType.length; i++) {
            cards.push.apply(cards, new Array(cardNum[i] + 1).join(cardType[i]).split(''));
        }
        for (var i = 0; i < 10; i++) {  //可以多洗几次牌
            cards.sort(function() {
                return Math.random() > 0.5 ? 1 : -1
            });
        }
        return cards; //洗好的牌
    }

//    var cardType = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
//    var cardNum = [28, 24, 20, 15, 7, 5, 1];

    exports.playCard = playCard;

    // todo http://www.cnblogs.com/jkisjk/archive/2012/04/23/javascript_shuffle.html
});
