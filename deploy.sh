#!/bin/bash

# 🦞 微杀杀 Online - 部署脚本

set -e

PROJECT_NAME="jsanguosha"
BUILD_DIR="/home/admin/.openclaw/workspace/jsanguosha/dist"
NGINX_ROOT="/var/www/jsanguosha"
PORT=3006

echo "🦞 开始部署 ${PROJECT_NAME}..."

# 1. 检查构建产物
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ 构建产物不存在，请先运行：npm run build"
    exit 1
fi

# 2. 创建 Nginx 目录
echo "📁 创建 Nginx 目录..."
sudo mkdir -p ${NGINX_ROOT}

# 3. 同步文件
echo "📦 同步文件..."
sudo rm -rf ${NGINX_ROOT}/*
sudo cp -r ${BUILD_DIR}/* ${NGINX_ROOT}/
sudo cp index.html ${NGINX_ROOT}/
sudo chown -R nginx:nginx ${NGINX_ROOT}
sudo chmod -R 755 ${NGINX_ROOT}

# 4. 配置 Nginx
echo "⚙️ 配置 Nginx..."
sudo tee /etc/nginx/conf.d/jsanguosha.conf > /dev/null << EOF
server {
    listen ${PORT};
    server_name _;
    root ${NGINX_ROOT};
    index index.html;

    # SPA 路由支持
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|mp3|wav)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
}
EOF

# 5. 测试并重载 Nginx
echo "🔄 重载 Nginx..."
sudo nginx -t && sudo nginx -s reload

# 6. 验证部署
echo "🧪 验证部署..."
sleep 1
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${PORT}/)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ 部署成功！"
    echo ""
    echo "🌐 访问地址："
    echo "   本地：http://localhost:${PORT}/"
    echo "   公网：http://47.102.199.24:${PORT}/"
    echo ""
    echo "📊 构建产物大小：$(du -sh ${BUILD_DIR} | cut -f1)"
else
    echo "❌ 部署失败 (HTTP ${HTTP_CODE})"
    exit 1
fi
