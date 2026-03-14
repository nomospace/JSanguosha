import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.scale;

    // ========== 背景 ==========
    const bg = this.add.rectangle(0, 0, width, height, 0x1a1a2e);
    bg.setOrigin(0);

    // 添加渐变效果
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(
      0x1a1a2e, 0x1a1a2e,
      0x16213e, 0x16213e,
      1
    );
    gradient.fillRect(0, 0, width, height);

    // ========== 标题 ==========
    const title = this.add.text(width / 2, height / 3, '微杀杀 Online', {
      font: 'bold 72px Microsoft YaHei',
      color: '#ffffff',
      stroke: '#e74c3c',
      strokeThickness: 8
    }).setOrigin(0.5);

    // 标题动画
    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 副标题
    const subtitle = this.add.text(width / 2, height / 3 + 60, '视觉化三国杀单机版', {
      font: '24px Microsoft YaHei',
      color: '#f39c12'
    }).setOrigin(0.5);

    // ========== 开始游戏按钮 ==========
    const startButton = this.createButton(
      width / 2,
      height / 2,
      '🎲 开始游戏',
      () => {
        this.scene.start('GameScene', { playerCount: 4 });
      }
    );

    // ========== 选择人数按钮 ==========
    const btn4 = this.createButton(
      width / 2 - 150,
      height / 2 + 100,
      '👥 4 人局',
      () => {
        this.scene.start('GameScene', { playerCount: 4 });
      }
    );

    const btn6 = this.createButton(
      width / 2 + 150,
      height / 2 + 100,
      '👥 6 人局',
      () => {
        this.scene.start('GameScene', { playerCount: 6 });
      }
    );

    const btn8 = this.createButton(
      width / 2,
      height / 2 + 200,
      '👥 8 人局',
      () => {
        this.scene.start('GameScene', { playerCount: 8 });
      }
    );

    // ========== 版本信息 ==========
    const version = this.add.text(width - 20, height - 20, 'v2.0.0 | Phaser 3', {
      font: '14px Microsoft YaHei',
      color: '#666666'
    }).setOrigin(1);

    // ========== 按钮悬停音效（预留） ==========
    startButton.on('pointerover', () => {
      // this.sound.play('sfx_hover');
    });
  }

  createButton(x, y, text, callback) {
    const button = this.add.container(x, y);

    // 按钮背景
    const bg = this.add.rectangle(0, 0, 200, 60, 0xf39c12);
    bg.setInteractive({ useHandCursor: true });
    bg.setStrokeStyle(2, 0xe74c3c);

    // 按钮文字
    const label = this.add.text(0, 0, text, {
      font: 'bold 24px Microsoft YaHei',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    button.add([bg, label]);

    // 悬停效果
    bg.on('pointerover', () => {
      bg.setFillStyle(0xe74c3c);
      this.tweens.add({
        targets: button,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100
      });
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(0xf39c12);
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });

    // 点击事件
    bg.on('pointerdown', () => {
      this.tweens.add({
        targets: button,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        onComplete: () => {
          callback();
        }
      });
    });

    return button;
  }
}
