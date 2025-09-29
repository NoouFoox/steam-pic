#!/bin/bash

echo "🚀 开始部署 Steam Picture 项目..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 停止并删除现有容器（如果存在）
echo "🔄 清理现有容器..."
docker stop steam-pic-app 2>/dev/null || true
docker rm steam-pic-app 2>/dev/null || true

# 构建 Docker 镜像
echo "🔨 构建 Docker 镜像..."
docker build -t steam-pic:latest .

if [ $? -eq 0 ]; then
    echo "✅ 镜像构建成功"
else
    echo "❌ 镜像构建失败"
    exit 1
fi

# 运行容器
echo "🚀 启动容器..."
docker run -d \
  --name steam-pic-app \
  -p 3000:3000 \
  --restart unless-stopped \
  steam-pic:latest

if [ $? -eq 0 ]; then
    echo "✅ 容器启动成功"
    echo "🌐 应用地址: http://localhost:3000"
    echo "🔍 健康检查: http://localhost:3000/api/health"
    echo ""
    echo "📋 常用命令:"
    echo "  查看日志: docker logs steam-pic-app"
    echo "  停止应用: docker stop steam-pic-app"
    echo "  删除容器: docker rm steam-pic-app"
else
    echo "❌ 容器启动失败"
    exit 1
fi