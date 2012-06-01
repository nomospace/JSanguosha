/**
 * 游戏入口模块
 * @author: nomospace
 * @date: 2012-5-9
 */
define(function(require, exports, module) {
    return;
    var $ = require('$');

    // test 洗牌算法
//    var util = require('../core/util');
//    var cardType = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
//    var cardNum = [28, 24, 20, 15, 7, 5, 1];
//    console.log(util.playCard(cardType, cardNum));

//    var Card = require('../core/card').Card;
//    var SkillCard = require('../core/card').SkillCard;
//    console.log(Card);
//    console.log(new Card());
//    console.log(new SkillCard());

//    var stdpkg = require('../data/standard-package');
//    console.log(stdpkg);

    var setting = require('../core/setting');

    var Engine = require('../core/engine');
    var engine = new Engine({'a': 1, 'b': 2});
    engine.playAudio(setting.audio.skill + 'beige1.ogg');
//    engine.playAudio(setting.audio.skill + 'beige3.ogg');
//    engine.playAudio(setting.audio.skill + 'beige2.ogg');

//    var standard = require('../package/standard'),
//        StandardPackage = standard.StandardPackage;
//    new StandardPackage();

//    var hbs = require('handlebars');
//    console.log(hbs)

});
