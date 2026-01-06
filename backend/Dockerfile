FROM node:18-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装所有依赖（包括 devDependencies，用于构建）
RUN npm ci

# 复制源代码
COPY . .

# 构建 TypeScript
RUN npm run build

# 删除 devDependencies，减小镜像体积
RUN npm prune --production

# 创建数据目录
RUN mkdir -p /app/data

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["npm", "start"]
