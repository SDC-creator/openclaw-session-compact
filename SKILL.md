# OpenClaw Session Compact

智能会话压缩插件，自动管理 Token 消耗，支持无限长对话。

## 功能

- **自动压缩**: 当会话 Token 超过阈值时自动压缩历史
- **手动压缩**: 通过 `openclaw compact` 命令手动触发
- **状态查看**: 通过 `openclaw compact-status` 查看当前 Token 使用
- **递归压缩**: 支持多次压缩，保留关键上下文

## 安装

```bash
openclaw skills install /Users/lab/.openclaw/workspace/skills/session-compact
# 或从 GitHub
openclaw skills install https://github.com/your-org/openclaw-session-compact
```

## 使用

```bash
# 查看当前会话状态
openclaw compact-status

# 手动压缩会话
openclaw compact

# 强制压缩（即使低于阈值）
openclaw compact --force

# 配置压缩阈值（默认 10000 tokens）
openclaw config set plugins.entries.session-compact.config.max_tokens 20000
```

## 故障排查

### 常见问题

#### 1. `OpenClaw CLI not found`
**原因**: OpenClaw 未安装或未添加到 PATH。  
**解决**: 确保 `openclaw` 命令可用：
```bash
openclaw --version
```

#### 2. `Gateway connection failed`
**原因**: OpenClaw Gateway 未运行。  
**解决**: 启动 Gateway：
```bash
openclaw gateway start
```

#### 3. `LLM call timeout`
**原因**: 网络问题或模型响应超时。  
**解决**: 检查网络连接，或增加 `timeout` 配置。

#### 4. 压缩后内容丢失
**原因**: 摘要生成失败或 LLM 未返回关键信息。  
**解决**: 检查日志中的 `[LLM]` 警告，确保模型配置正确。

#### 5. 命令未响应
**原因**: 插件未正确加载。  
**解决**: 重启 OpenClaw 或检查 `plugins.entries.session-compact.enabled` 配置。

---

## 配置

在 `~/.openclaw/config.json` 中添加：

```json
{
  "plugins": {
    "entries": {
      "session-compact": {
        "enabled": true,
        "config": {
          "max_tokens": 10000,
          "preserve_recent": 4,
          "auto_compact": true,
          "model": "claude-haiku"
        }
      }
    }
  }
}
```

## 配置项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `max_tokens` | number | 10000 | 触发压缩的 Token 阈值 |
| `preserve_recent` | number | 4 | 保留最近 N 条消息（不压缩） |
| `auto_compact` | boolean | true | 是否在持久化会话时自动压缩 |
| `model` | string | "claude-haiku" | 用于生成摘要的模型 |

## 工作原理

1. **检测**: 每次会话持久化前检查 Token 数量
2. **生成摘要**: 调用 LLM 生成结构化摘要（待办、文件、工具、时间线）
3. **替换**: 用摘要替换旧消息，保留最近消息
4. **续写**: 添加标准化续写指令，确保无缝接续

## 开发

```bash
cd skills/session-compact
npm install
npm run build
```

## 许可证

MIT
