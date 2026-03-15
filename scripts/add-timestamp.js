/**
 * 给 index.html 中的静态资源添加时间戳
 * 避免浏览器缓存问题
 */
const fs = require('fs');
const path = require('path');

const timestamp = Date.now();
const indexPath = path.join(__dirname, '..', 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// 给 JS 文件加时间戳
html = html.replace(/game\.bundle\.js(\?v=\d+)?/g, `game.bundle.js?v=${timestamp}`);

fs.writeFileSync(indexPath, html);

console.log(`✅ 已添加时间戳: v=${timestamp}`);