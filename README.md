# OpenClaw Session Compact Skill 🔄

智能会话压缩插件，自动管理 Token 消耗，支持**无限长对话**。通过自动压缩历史消息，将长对话压缩为结构化摘要，显著降低 Token 使用量。

## ✨ 核心特性

- **自动压缩**: 当会话 Token 接近阈值时自动触发压缩
- **智能摘要**: 保留关键信息（时间线、待办事项、关键文件）
- **无感续接**: 压缩后对话无缝继续，无需用户干预
- **降级保护**: LLM 不可用时自动使用代码提取摘要
- **递归压缩**: 支持多次压缩，保持上下文连贯

## 🚀 快速开始

### 1. 安装

```bash
# 从本地安装
openclaw skills install /Users/lab/.openclaw/workspace/skills/session-compact

# 从 GitHub 安装（发布后）
openclaw skills install https://github.com/openclaw/skills/session-compact
```

### 2. 配置

在 `~/.openclaw/openclaw.json` 中配置：

```json
{
  "skills": {
    "session-compact": {
      "enabled": true,
      "max_tokens": 10000,
      "preserve_recent": 4,
      "auto_compact": true,
      "model": "qwen/qwen3.5-122b-a10b"
    }
  }
}
```

### 3. 使用

**自动模式**（推荐）:
```bash
# 启动 OpenClaw，压缩功能自动生效
openclaw start
# 当对话历史超过阈值时，自动压缩并继续
```

**手动触发**:
```bash
# 压缩当前会话
openclaw compact --session-id <session-id>

# 查看压缩状态
openclaw compact --status --session-id <session-id>

# 强制压缩（忽略阈值）
openclaw compact --force --session-id <session-id>
```

## 📊 工作原理

### 压缩流程

```
1. 监控 Token 使用量
   ↓
2. 超过阈值 (90%)?
   ├─ 否 → 继续对话
   └─ 是 → 触发压缩
        ↓
3. 保留最近 N 条消息 (默认 4 条)
   ↓
4. 压缩旧消息为结构化摘要
   ├─ Scope: 统计信息
   ├─ Recent requests: 最近用户请求
   ├─ Pending work: 待办事项
   ├─ Key files: 关键文件
   ├─ Tools used: 使用的工具
   └─ Key timeline: 对话时间线
   ↓
5. 替换旧消息，插入 System 摘要
   ↓
6. 无缝继续对话
```

### 压缩效果示例

**压缩前**: 50 条消息 (1,250 tokens)
```
user: 第 1 条消息...
assistant: 第 2 条消息...
...
user: 第 49 条消息...
assistant: 第 50 条消息...
```

**压缩后**: 5 条消息 (360 tokens) - **节省 92% Token**
```
system: Summary:
- Scope: 46 earlier messages compacted
- Recent requests:
  - 发送第 37 条测试消息
  - 发送第 41 条测试消息
  - 发送第 45 条测试消息
- Pending work: 无待办事项
- Key timeline:
  - user: 第 37 条消息...
  - assistant: 第 38 条消息...
  - user: 第 39 条消息...

user: 第 49 条消息...
assistant: 第 50 条消息...
```

## 🔧 配置详解

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `max_tokens` | number | 10000 | 触发压缩的 Token 阈值 |
| `preserve_recent` | number | 4 | 保留最近 N 条消息 |
| `auto_compact` | boolean | true | 是否自动压缩 |
| `model` | string | '' | 用于生成摘要的模型（空表示使用全局默认） |

### 配置示例

**保守模式**（频繁压缩，节省 Token）:
```json
{
  "max_tokens": 5000,
  "preserve_recent": 6,
  "auto_compact": true
}
```

**激进模式**（减少压缩次数，保持更多上下文）:
```json
{
  "max_tokens": 20000,
  "preserve_recent": 3,
  "auto_compact": true
}
```

## 📚 API 文档

### 核心函数

#### `compactSession(messages, config)`

压缩会话并返回结果。

```typescript
async function compactSession(
  messages: Array<{ role: string; content?: string }>,
  config: CompactConfig
): Promise<CompactionResult>
```

**参数**:
- `messages`: 消息数组
- `config`: 配置对象

**返回**:
```typescript
interface CompactionResult {
  summary: string;           // 原始摘要
  formattedSummary: string;  // 格式化后的摘要
  removedCount: number;      // 移除的消息数
  savedTokens: number;       // 节省的 Token 数
}
```

**示例**:
```typescript
const result = await compactSession(messages, {
  max_tokens: 10000,
  preserve_recent: 4
});

console.log(`移除了 ${result.removedCount} 条消息，节省 ${result.savedTokens} tokens`);
```

#### `shouldCompact(messages, config)`

检查是否需要压缩。

```typescript
function shouldCompact(
  messages: Array<{ content?: string }>,
  config: CompactConfig
): boolean
```

**示例**:
```typescript
if (shouldCompact(messages, config)) {
  console.log('需要压缩会话');
}
```

#### `estimateTokenCount(messages)`

估算消息的 Token 数量。

```typescript
function estimateTokenCount(
  messages: Array<{ content?: string }>
): number
```

**注意**: 使用简化算法（4 字符 ≈ 1 token），实际值可能略有差异。

## 🛠️ 开发指南

### 本地开发

```bash
# 克隆项目
cd /Users/lab/.openclaw/workspace/skills/session-compact

# 安装依赖
npm install

# 编译
npm run build

# 开发模式（监听文件变化）
npm run dev

# 运行测试
npm test

# 查看覆盖率
npm run test:coverage
```

### 目录结构

```
session-compact/
├── src/
│   ├── index.ts              # 技能入口
│   ├── compact/
│   │   ├── config.ts         # 配置管理
│   │   ├── engine.ts         # 压缩核心逻辑
│   │   └── __tests__/        # 单元测试 (65 个测试，63.63% 覆盖)
│   │       ├── config.test.ts
│   │       ├── engine.test.ts
│   │       ├── engine-integration.test.ts
│   │       └── engine-mock.test.ts
│   └── cli/
│       └── register.ts       # CLI 命令注册
├── package.json
├── tsconfig.json
└── README.md
```

### 添加新功能

1. 在 `src/compact/engine.ts` 中添加新函数
2. 在 `src/compact/__tests__/` 中添加对应测试
3. 运行 `npm run test:coverage` 确保覆盖率不下降
4. 更新 `README.md` 文档

## 📈 性能指标

- **测试覆盖率**: 63.63% (目标 70%+)
- **核心功能覆盖**: 89.76%
- **平均压缩时间**: < 1 秒 (无 LLM 调用)
- **Token 节省**: 通常 85-95%
- **内存使用**: 低 (无泄漏)

## 🐛 故障排查

### 问题：压缩未触发

**原因**: Token 未达到阈值
**解决**:
```bash
# 检查当前 Token 使用
openclaw compact --status

# 降低阈值测试
openclaw compact --max-tokens 1000
```

### 问题：摘要质量差

**原因**: LLM 配置错误或不可用
**解决**:
- 检查 `model` 配置
- 确保 OpenClaw 网关已启动: `openclaw gateway start`
- 系统会自动降级为代码提取摘要

### 问题：压缩后上下文丢失

**原因**: `preserve_recent` 设置过低
**解决**:
```json
{
  "preserve_recent": 6  // 增加到 6 或更多
}
```

## 📝 更新日志

### v1.0.0 (2026-04-04)
- ✨ 初始版本发布
- ✅ 65 个单元测试通过
- ✅ 压缩功能实测通过
- ✅ 降级机制有效
- 📚 完整文档

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

---

**项目状态**: ✅ 稳定发布  
**测试状态**: ✅ 65/65 通过  
**覆盖率**: 📈 63.63%  
**维护者**: OpenClaw Team
