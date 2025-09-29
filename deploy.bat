@echo off
echo 🚀 开始部署 Steam Picture 项目...

REM 检查 Docker 是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker 未安装，请先安装 Docker
    pause
    exit /b 1
)

REM 停止并删除现有容器（如果存在）
echo 🔄 清理现有容器...
docker stop steam-pic-app >nul 2>&1
docker rm steam-pic-app >nul 2>&1

REM 构建 Docker 镜像
echo 🔨 构建 Docker 镜像...
docker build -t steam-pic:latest .

if %errorlevel% neq 0 (
    echo ❌ 镜像构建失败
    pause
    exit /b 1
)

echo ✅ 镜像构建成功

REM 运行容器
echo 🚀 启动容器...
docker run -d --name steam-pic-app -p 3000:3000 --restart unless-stopped steam-pic:latest

if %errorlevel% neq 0 (
    echo ❌ 容器启动失败
    pause
    exit /b 1
)

echo ✅ 容器启动成功
echo 🌐 应用地址: http://localhost:3000
echo 🔍 健康检查: http://localhost:3000/api/health
echo.
echo 📋 常用命令:
echo   查看日志: docker logs steam-pic-app
echo   停止应用: docker stop steam-pic-app
echo   删除容器: docker rm steam-pic-app
echo.
pause