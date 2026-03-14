# 🦞 JSanguosha - 视觉化三国杀单机版

> Sanguosha written in JavaScript (Phaser 3) | 基于 Phaser 3 的视觉化三国杀单机游戏

## 🌐 访问地址

- **本地**: http://localhost:3006/
- **公网**: http://47.102.199.24:3006/
- **GitHub**: https://github.com/nomospace/JSanguosha

## ✨ 特性

### 🎮 核心功能
- ✅ **视觉化界面** - 精美的游戏桌面布局
- ✅ **武将头像** - 14 位经典武将（颜色区分势力）
- ✅ **卡牌动画** - 摸牌、出牌飞行动画
- ✅ **技能特效** - 粒子效果、伤害数字、回复动画
- ✅ **AI 对战** - 单机自动对战模式
- ✅ **游戏日志** - 实时战斗记录

### 🎨 视觉效果
| 效果类型 | 描述 |
|----------|------|
| 摸牌动画 | 卡牌从牌堆飞到玩家手牌区 |
| 出牌动画 | 卡牌飞向目标玩家 |
| 伤害效果 | 红色伤害数字 + 粒子爆发 |
| 回复效果 | 绿色回复数字 + 粒子效果 |
| 死亡动画 | 灰色粒子爆发 + 屏幕震动 |
| 胜利特效 | 彩带粒子 + 胜利文字动画 |
| 回合高亮 | 当前玩家黄色光环 + 缩放动画 |

### 👥 武将列表
已包含 14 位经典武将：

**魏国** (蓝色)
- 曹操 - 奸雄
- 司马懿 - 反馈
- 夏侯惇 - 刚烈

**蜀国** (绿色)
- 刘备 - 仁德
- 诸葛亮 - 观星
- 关羽 - 武圣
- 张飞 - 咆哮
- 赵云 - 龙胆

**吴国** (红色)
- 孙权 - 制衡
- 周瑜 - 反间
- 陆逊 - 连营

**群雄** (橙色)
- 吕布 - 无双
- 貂蝉 - 闭月
- 华佗 - 急救

## 🚀 快速开始

### 开发模式
```bash
cd weseewe-phaser
npm run dev
# 访问 http://localhost:3006/
```

### 生产构建
```bash
npm run build
npm run deploy
```

## 📁 项目结构

```
weseewe-phaser/
├── index.html              # 游戏入口
├── package.json            # 依赖配置
├── webpack.config.js       # 构建配置
├── deploy.sh               # 部署脚本
├── src/
│   ├── main.js             # 游戏入口
│   └── scenes/
│       ├── BootScene.js    # 资源加载场景
│       ├── MenuScene.js    # 主菜单场景
│       └── GameScene.js    # 游戏主场景（核心）
├── assets/                 # 素材资源（预留）
│   ├── images/
│   │   ├── characters/     # 武将头像
│   │   ├── cards/          # 卡牌图片
│   │   └── ui/             # UI 元素
│   └── audio/              # 音效音乐
└── dist/                   # 构建产物
```

## 🎯 游戏流程

1. **开始游戏** - 点击主菜单"开始游戏"按钮
2. **选择人数** - 支持 4/6/8 人局
3. **自动发牌** - 每位玩家 4 张初始手牌
4. **回合制对战** - AI 自动出牌对战
5. **技能触发** - 貂蝉闭月自动摸牌
6. **游戏结束** - 最后一人获胜，彩带庆祝

## 🎨 自定义素材

### 替换武将头像
将头像图片放入 `assets/images/characters/` 目录：
```
caocao.png      # 曹操
liubei.png      # 刘备
sunquan.png     # 孙权
...
```

然后在 `BootScene.js` 中取消注释加载代码：
```javascript
this.load.image('caocao', 'assets/images/characters/caocao.png');
```

在 `GameScene.js` 中修改头像创建逻辑：
```javascript
// 将颜色块替换为真实图片
const avatar = this.add.image(0, 0, character.key);
avatar.setDisplaySize(100, 100);
```

### 替换卡牌图片
将卡牌图片放入 `assets/images/cards/` 目录：
```
card_back.png   # 卡牌背面
card_sha.png    # 杀
card_shan.png   # 闪
card_tao.png    # 桃
...
```

## 🔧 技术栈

- **Phaser 3.80.1** - 游戏引擎
- **Webpack 5** - 构建工具
- **JavaScript ES6** - 编程语言
- **Nginx** - Web 服务器

## 📊 性能数据

| 指标 | 数值 |
|------|------|
| 构建产物大小 | 1.2MB |
| 首屏加载时间 | < 2 秒 |
| 帧率 | 60 FPS |
| 支持人数 | 4/6/8 人 |

## 🎵 音效预留

代码已预留音效接口，添加音效文件后在 `BootScene.js` 中加载：
```javascript
this.load.audio('bgm_battle', 'assets/audio/bgm/battle.mp3');
this.load.audio('sfx_draw', 'assets/audio/sfx/draw.mp3');
```

在对应事件中播放：
```javascript
this.sound.play('sfx_draw');
```

## 📝 待完善功能

- [ ] 真实武将头像替换
- [ ] 真实卡牌图片替换
- [ ] 背景音乐和音效
- [ ] 武将技能完整实现
- [ ] 玩家手动出牌模式
- [ ] 身份选择界面
- [ ] 游戏存档/读档
- [ ] 回放功能

## 🦞 开发心得

> 从纯文字对战到视觉化游戏，关键在于：
> 1. **分层次开发** - 先框架后细节
> 2. **占位素材** - 用颜色块/文字代替图片，跑通流程
> 3. **动画系统** - Phaser 的 tweens 让动画变得简单
> 4. **粒子效果** - 小细节大大提升视觉体验

## 📄 License

MIT License

---

_🦞 Created by 金大虾 | 2026-03-14_
