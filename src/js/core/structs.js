/**
 * @author: nomospace
 * @date: 2012-5-10
 */
define(function(require, exports, module) {
    var i = 0,
        DamageStruct = {
            Nature: {
                Normal: i++,
                Fire: i++,
                Thunder: i++
            },
            damage: i++,
            chain: false
        },
        TriggerEvent = {
//            http://moligaloo.blog.163.com/blog/static/477941620117115829452/
            NonTrigger: i++,
            GameStart: i++,
            TurnStart: i++,
            PhaseChange: i++,
            DrawNCards: i++,
            HpRecover: i++,
            HpLost: i++,
            HpChanged: i++,
            StartJudge: i++,
            AskForRetrial: i++,
            FinishJudge: i++,
            Pindian: i++,
            TurnedOver: i++,
            Predamage: i++,
            DamagedProceed: i++,
            DamageProceed: i++,
            Predamaged: i++,
            DamageDone: i++,
            Damage: i++,
            Damaged: i++,
            DamageComplete: i++,
            Dying: i++,
            AskForPeaches: i++,
            AskForPeachesDone: i++,
            Death: i++,
            GameOverJudge: i++,
            SlashEffect: i++,
            SlashEffected: i++,
            SlashProceed: i++,
            SlashHit: i++,
            SlashMissed: i++,
            JinkUsed: i++,
            CardAsked: i++,
            CardUsed: i++,
            CardResponsed: i++,
            CardDiscarded: i++,
            CardMoving: i++,
            CardLost: i++,
            CardLostDone: i++,
            CardGot: i++,
            CardGotDone: i++,
            CardDrawing: i++,
            CardDrawnDone: i++,
            CardEffect: i++,
            CardEffected: i++,
            CardFinished: i++,
            ChoiceMade: i++,
            NumOfEvents: i++
        }

    exports.DamageStruct = DamageStruct;
    exports.TriggerEvent = TriggerEvent;
});
