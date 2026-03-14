import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // 显示加载进度
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 800, 100);

    const loadingText = this.add.text(640, 250, '加载中...', {
      font: '28px Microsoft YaHei',
      color: '#ffffff'
    }).setOrigin(0.5);

    // 加载进度事件
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xf39c12, 1);
      progressBar.fillRect(250, 280, 780 * value, 80);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // ========== 加载武将头像（使用 DiceBear 占位） ==========
    const characters = [
      { key: 'caocao', name: '曹操', seed: 'caocao' },
      { key: 'liubei', name: '刘备', seed: 'liubei' },
      { key: 'sunquan', name: '孙权', seed: 'sunquan' },
      { key: 'zhugeliang', name: '诸葛亮', seed: 'zhugeliang' },
      { key: 'simayi', name: '司马懿', seed: 'simayi' },
      { key: 'xiahoudun', name: '夏侯惇', seed: 'xiahoudun' },
      { key: 'guanYu', name: '关羽', seed: 'guanyu' },
      { key: 'zhangfei', name: '张飞', seed: 'zhangfei' },
      { key: 'zhaoyun', name: '赵云', seed: 'zhaoyun' },
      { key: 'zhouyu', name: '周瑜', seed: 'zhouyu' },
      { key: 'luxun', name: '陆逊', seed: 'luxun' },
      { key: 'diaochan', name: '貂蝉', seed: 'diaochan' },
      { key: 'lvbu', name: '吕布', seed: 'lvbu' },
      { key: 'huatuo', name: '华佗', seed: 'huatuo' }
    ];

    // 使用 DiceBear API 生成头像（开发阶段）
    characters.forEach(char => {
      // 这里我们用颜色块代替，实际使用时替换为真实图片
      // this.load.image(char.key, `assets/images/characters/${char.key}.png`);
    });

    // ========== 加载卡牌图片 ==========
    // 卡牌背面
    // this.load.image('card_back', 'assets/images/cards/back.png');
    
    // 基本牌
    // this.load.image('card_sha', 'assets/images/cards/sha.png');
    // this.load.image('card_shan', 'assets/images/cards/shan.png');
    // this.load.image('card_tao', 'assets/images/cards/tao.png');
    
    // 锦囊牌
    // this.load.image('card_wuzhong', 'assets/images/cards/wuzhong.png');
    // this.load.image('card_juedou', 'assets/images/cards/juedou.png');
    // this.load.image('card_nanman', 'assets/images/cards/nanman.png');
    // this.load.image('card_wanjian', 'assets/images/cards/wanjian.png');
    // this.load.image('card_taoyuan', 'assets/images/cards/taoyuan.png');
    // this.load.image('card_shunshou', 'assets/images/cards/shunshou.png');
    // this.load.image('card_guoheshuang', 'assets/images/cards/guoheshuang.png');
    // this.load.image('card_tiesuo', 'assets/images/cards/tiesuo.png');
    // this.load.image('card_jiedao', 'assets/images/cards/jiedao.png');
    // this.load.image('card_wuke', 'assets/images/cards/wuke.png');
    // this.load.image('card_nanman', 'assets/images/cards/nanman.png');

    // 装备牌
    // this.load.image('card_zhuge', 'assets/images/cards/zhuge.png');
    // this.load.image('card_ciba', 'assets/images/cards/ciba.png');
    // this.load.image('card_qinggang', 'assets/images/cards/qinggang.png');
    // this.load.image('card_bagua', 'assets/images/cards/bagua.png');
    // this.load.image('card_renxwang', 'assets/images/cards/renxwang.png');
    // this.load.image('card_dilu', 'assets/images/cards/dilu.png');
    // this.load.image('card_zhuahuang', 'assets/images/cards/zhuahuang.png');

    // ========== 加载 UI 素材 ==========
    // this.load.image('player_frame', 'assets/images/ui/frame.png');
    // this.load.image('hp_icon', 'assets/images/ui/hp.png');
    // this.load.image('select_frame', 'assets/images/ui/select.png');

    // ========== 加载背景 ==========
    // this.load.image('table_bg', 'assets/images/backgrounds/table.png');

    // ========== 加载音效 ==========
    // this.load.audio('bgm_battle', 'assets/audio/bgm/battle.mp3');
    // this.load.audio('sfx_draw', 'assets/audio/sfx/draw.mp3');
    // this.load.audio('sfx_play', 'assets/audio/sfx/play.mp3');
    // this.load.audio('sfx_damage', 'assets/audio/sfx/damage.mp3');
    // this.load.audio('sfx_die', 'assets/audio/sfx/die.mp3');
  }

  create() {
    // 资源加载完成，进入主菜单
    this.scene.start('MenuScene');
  }
}
