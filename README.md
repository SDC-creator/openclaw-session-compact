# OpenClaw Session Compact Skill

智能会话压缩插件，自动管理 Token 消耗，支持无限长对话。

## 快速开始

```bash
# 安装依赖
npm install

# 编译
npm run build

# 开发模式（监听文件变化）
npm run dev
```

## 测试

```bash
# 编译后测试
cd dist
node index.js
```

## 部署到 OpenClaw

```bash
# 从本地安装
openclaw skills install /Users/lab/.openclaw/workspace/skills/session-compact

# 从 GitHub 安装
openclaw skills install https://github.com/your-org/openclaw-session-compact
```

## 开发指南

### 目录结构
```
src/
├── index.ts          # 技能入口
├── compact/
│   ├── config.ts     # 配置管理
│   └── engine.ts     # 压缩核心逻辑
└── cli/
    └── register.ts   # CLI 命令注册
```

### 核心功能
1. **Token 估算**: `estimateTokenCount()` - 简化版估算（4 字符 ≈ 1 token）
2. **摘要生成**: `generateSummary()` - 调用 LLM 生成结构化摘要
3. **会话压缩**: `compactSession()` - 执行压缩并返回结果
4. **命令注册**: `registerCompactCommands()` - 注册 CLI 命令

### 配置项
- `max_tokens`: 触发压缩的 Token 阈值（默认 10000）
- `preserve_recent`: 保留最近 N 条消息（默认 4）
- `auto_compact`: 是否自动压缩（默认 true）
- `model`: 用于生成摘要的模型（默认 claude-haiku）

### TODO
- [ ] 实现真实的 LLM 调用（对接 OpenClaw 模型服务）
- [ ] 集成到 OpenClaw 会话持久化流程
- [ ] 添加单元测试
- [ ] 支持递归压缩
- [ ] 添加进度指示器

## 许可证

MIT
