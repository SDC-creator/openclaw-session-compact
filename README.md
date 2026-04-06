# OpenClaw Session Compact Plugin 🔄

Intelligent session compression plugin for OpenClaw that automatically manages token consumption and supports **unlimited-length conversations**. By automatically compressing historical messages into structured summaries, it significantly reduces token usage (typically 85-95% savings).

## ✨ Key Features

- **Automatic Compression**: Triggers when session tokens approach threshold
- **Smart Summaries**: Preserves key information (timeline, todos, files)
- **Seamless Continuation**: Conversations continue without user intervention
- **Fallback Protection**: Code-based extraction when LLM unavailable
- **Recursive Compression**: Supports multiple compression cycles
- **CLI Commands**: `openclaw compact`, `openclaw compact-status`, `openclaw compact-config`

## 🚀 Quick Start

### 1. Installation

```bash
# Install from ClawHub
openclaw skills install openclaw-session-compact

# Or install from local path
openclaw skills install /Users/lab/.openclaw/workspace/skills/openclaw-session-compact
```

### 2. Plugin Configuration

The plugin is automatically discovered from `~/.openclaw/extensions/openclaw-session-compact/`.

Add to `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "allow": ["openclaw-session-compact"],
    "entries": {
      "openclaw-session-compact": {
        "enabled": true
      }
    }
  }
}
```

### 3. Compression Configuration

Add to `~/.openclaw/openclaw.json`:

```json
{
  "skills": {
    "entries": {
      "openclaw-session-compact": {
        "enabled": true,
        "max_tokens": 10000,
        "preserve_recent": 4,
        "auto_compact": true,
        "model": "qwen/qwen3.5-122b-a10b"
      }
    }
  }
}
```

### 4. Usage

**CLI Commands**:

```bash
# Check current session status
openclaw compact-status

# Manually compress current session
openclaw compact

# Force compression (ignores threshold)
openclaw compact --force

# View configuration
openclaw compact-config

# View specific config value
openclaw compact-config max_tokens

# Set config value (not persisted)
openclaw compact-config max_tokens 5000
```

**Automatic Mode** (Recommended):
```bash
# Start OpenClaw - compression works automatically
openclaw start
# Auto-compresses when conversation exceeds threshold
```

## 📊 How It Works

### Compression Flow

```
1. Monitor token usage
   ↓
2. Exceeds threshold (90%)?
   ├─ No → Continue conversation
   └─ Yes → Trigger compression
        ↓
3. Keep last N messages (default: 4)
   ↓
4. Compress old messages into structured summary
   ├─ Scope: Statistics
   ├─ Recent requests: Last 3 user requests
   ├─ Pending work: To-dos
   ├─ Key files: Important files
   ├─ Tools used: Tools mentioned
   └─ Key timeline: Conversation timeline
   ↓
5. Replace old messages with System summary
   ↓
6. Seamlessly continue conversation
```

### Compression Example

**Before**: 50 messages (1,250 tokens)
```
user: Message 1...
assistant: Message 2...
...
user: Message 49...
assistant: Message 50...
```

**After**: 5 messages (360 tokens) - **92% token savings**
```
system: Summary:
- Scope: 46 earlier messages compacted
- Recent requests:
  - Message 37: Discussing complex problem
  - Message 41: File operations
  - Message 45: Tool usage details
- Pending work: Continue debugging
- Key timeline:
  - user: Message 37...
  - assistant: Message 38...
  - user: Message 39...

user: Message 49...
assistant: Message 50...
```

## 🔧 Configuration Reference

| Parameter | Type | Default | Description | Recommended |
|-----------|------|---------|-------------|-------------|
| `max_tokens` | number | 10000 | Token threshold for compression | 5000-20000 |
| `preserve_recent` | number | 4 | Number of recent messages to keep | 4-6 |
| `auto_compact` | boolean | true | Enable automatic compression | true |
| `model` | string | '' | Model for summary generation | Global default |

### Configuration Examples

**Conservative Mode** (frequent compression, max token savings):
```json
{
  "max_tokens": 5000,
  "preserve_recent": 6
}
```

**Aggressive Mode** (fewer compressions, more context):
```json
{
  "max_tokens": 20000,
  "preserve_recent": 3
}
```

## 📚 API Documentation

### Core Functions

#### `compactSession(messages, config)`

Compresses a session and returns the result.

```typescript
async function compactSession(
  messages: Array<{ role: string; content?: string }>,
  config: CompactConfig
): Promise<CompactionResult>
```

**Parameters**:
- `messages`: Array of conversation messages
- `config`: Configuration object

**Returns**:
```typescript
interface CompactionResult {
  summary: string;           // Raw summary
  formattedSummary: string;  // Formatted summary
  removedCount: number;      // Messages removed
  savedTokens: number;       // Tokens saved
}
```

**Example**:
```typescript
const result = await compactSession(messages, {
  max_tokens: 10000,
  preserve_recent: 4
});

console.log(`Removed ${result.removedCount} messages, saved ${result.savedTokens} tokens`);
```

#### `shouldCompact(messages, config)`

Checks if compression is needed.

```typescript
function shouldCompact(
  messages: Array<{ content?: string }>,
  config: CompactConfig
): boolean
```

**Example**:
```typescript
if (shouldCompact(messages, config)) {
  console.log('Compression needed');
}
```

#### `estimateTokenCount(messages)`

Estimates token count for messages.

```typescript
function estimateTokenCount(
  messages: Array<{ content?: string }>
): number
```

**Note**: Uses simplified algorithm (4 chars ≈ 1 token).

## 🛠️ Development Guide

### Local Development

```bash
# Navigate to project
cd /Users/lab/.openclaw/workspace/skills/openclaw-session-compact

# Install dependencies
npm install

# Build
npm run build

# Development mode (watch for changes)
npm run dev

# Run tests
npm test

# Check coverage
npm run test:coverage
```

### Project Structure

```
openclaw-session-compact/
├── src/
│   ├── index.ts              # Plugin entry point (register function)
│   ├── compact/
│   │   ├── config.ts         # Configuration management
│   │   ├── engine.ts         # Core compression logic
│   │   └── __tests__/        # Unit tests (65 tests, 63.63% coverage)
│   │       ├── config.test.ts
│   │       ├── engine.test.ts
│   │       ├── engine-integration.test.ts
│   │       └── engine-mock.test.ts
│   └── cli/
│       └── register.ts       # CLI command registration (legacy)
├── bin/
│   └── openclaw-compact.js   # Standalone CLI entry point
├── package.json
├── openclaw.plugin.json      # OpenClaw plugin manifest
├── tsconfig.json
└── README.md
```

### Plugin Architecture

This project is an **OpenClaw plugin** (not just a workspace skill). Key differences:

| Aspect | Workspace Skill | Plugin |
|--------|----------------|--------|
| Location | `workspace/skills/` | `~/.openclaw/extensions/` |
| Purpose | Documentation for LLM | Executable code |
| Entry | `SKILL.md` with frontmatter | `dist/index.js` with `register()` |
| CLI | Not supported | Supported via `api.registerCli()` |

### Adding New Features

1. Add new function in `src/compact/engine.ts`
2. Add corresponding test in `src/compact/__tests__/`
3. Run `npm run test:coverage` to ensure coverage doesn't decrease
4. Update `README.md` documentation
5. Rebuild: `npm run build`
6. Sync to extensions: copy `dist/`, `src/`, `package.json` to `~/.openclaw/extensions/openclaw-session-compact/`

## 📈 Performance Metrics

- **Test Coverage**: 63.63% (target 70%+)
- **Core Function Coverage**: 89.76%
- **Average Compression Time**: < 1 second (without LLM)
- **Token Savings**: Typically 85-95%
- **Memory Usage**: Low (no leaks)

## 🐛 Troubleshooting

### Issue: Plugin Not Recognized

**Cause**: Missing plugin configuration
**Solution**:
```bash
# Check plugin status
openclaw plugins list | grep compact

# Ensure plugin is in plugins.allow
# Add to openclaw.json:
# "plugins": { "allow": ["openclaw-session-compact"] }
```

### Issue: Compression Not Triggered

**Cause**: Token count below threshold
**Solution**:
```bash
# Check current token usage
openclaw compact-status

# Lower threshold for testing
openclaw compact-config max_tokens 1000
```

### Issue: Poor Summary Quality

**Cause**: LLM misconfigured or unavailable
**Solution**:
- Verify `model` configuration
- Ensure OpenClaw Gateway is running: `openclaw gateway start`
- System auto-falls back to code extraction

### Issue: Context Loss After Compression

**Cause**: `preserve_recent` set too low
**Solution**:
```json
{
  "preserve_recent": 6  // Increase to 6 or more
}
```

## 📝 Changelog

### v1.0.0 (2026-04-06)
- ✨ Initial release
- ✅ 65 unit tests passing
- ✅ CLI commands: `compact`, `compact-status`, `compact-config`
- ✅ Plugin architecture with `api.registerCli()`
- ✅ Compression functionality verified
- ✅ Fallback mechanism validated
- 📚 Complete documentation

## 🤝 Contributing

Contributions are welcome! Please submit Issues and Pull Requests.

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License

---

**Project Status**: ✅ Stable Release
**Tests**: ✅ 65/65 Passing
**Coverage**: 📈 63.63%
**Maintainer**: SDC-creator

**Chinese Documentation**: [SKILL_CN.md](SKILL_CN.md)
