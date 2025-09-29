# Steam Picture - Docker 部署指南

## 📋 已创建的文件

- `Dockerfile` - Docker 镜像构建配置
- `.dockerignore` - Docker 忽略文件配置
- `docker-compose.yml` - Docker Compose 编排配置
- `deploy.sh` / `deploy.bat` - 一键部署脚本
- `app/api/health/route.ts` - 健康检查 API

## 🚀 快速部署

### 方法 1: 使用部署脚本（推荐）

**Windows:**
```bash
./deploy.bat
```

**Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### 方法 2: 手动部署

```bash
# 1. 构建镜像
docker build -t steam-pic .

# 2. 运行容器
docker run -d -p 3000:3000 --name steam-pic-app steam-pic

# 3. 访问应用
# http://localhost:3000
```

### 方法 3: 使用 Docker Compose

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down
```

## 📊 监控和管理

### 查看应用状态
```bash
# 查看容器状态
docker ps

# 查看应用日志
docker logs steam-pic-app

# 实时查看日志
docker logs -f steam-pic-app
```

### 健康检查
访问: `http://localhost:3000/api/health`

### 进入容器调试
```bash
docker exec -it steam-pic-app sh
```

## 🔧 生产环境配置

### 环境变量配置
```bash
docker run -d \
  -p 3000:3000 \
  --name steam-pic-app \
  --env NODE_ENV=production \
  --env STEAM_API_TIMEOUT=10000 \
  steam-pic
```

### 数据持久化（如果需要）
```bash
docker run -d \
  -p 3000:3000 \
  --name steam-pic-app \
  -v steam-pic-data:/app/data \
  steam-pic
```

### 自动重启
```bash
docker run -d \
  -p 3000:3000 \
  --name steam-pic-app \
  --restart unless-stopped \
  steam-pic
```

## 🐳 Docker 镜像优化

当前 Dockerfile 已包含以下优化：
- ✅ 多阶段构建减少镜像大小
- ✅ 使用 Alpine Linux 轻量级基础镜像
- ✅ 非 root 用户运行提升安全性
- ✅ Next.js standalone 输出优化启动速度
- ✅ 健康检查监控应用状态

## 🔍 故障排查

### 常见问题

1. **端口被占用**
   ```bash
   # 查看端口占用
   netstat -tulpn | grep 3000
   # 使用其他端口
   docker run -d -p 3001:3000 --name steam-pic-app steam-pic
   ```

2. **容器启动失败**
   ```bash
   # 查看详细错误
   docker logs steam-pic-app
   ```

3. **镜像构建失败**
   ```bash
   # 清理构建缓存
   docker system prune -f
   # 重新构建
   docker build --no-cache -t steam-pic .
   ```

## 📝 部署清单

部署前确认：
- [ ] Docker 已安装并运行
- [ ] 端口 3000 未被占用
- [ ] 网络连接正常（访问 Steam API）
- [ ] 有足够的磁盘空间

部署后验证：
- [ ] 容器正常运行 `docker ps`
- [ ] 应用可访问 `http://localhost:3000`
- [ ] 健康检查通过 `http://localhost:3000/api/health`
- [ ] Steam API 功能正常