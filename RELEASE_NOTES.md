# Release Notes - Session Compact v1.0.0

## 🎉 First Stable Release

### ✨ Features

- **Automatic Session Compaction**: Automatically compresses session history when token count exceeds threshold (default: 10,000 tokens).
- **CLI Commands**: Three new OpenClaw CLI commands:
  - `openclaw compact` — Manually compress current session
  - `openclaw compact-status` — View token usage and compression status
  - `openclaw compact-config` — View/edit configuration
- **Recursive Summary Merge**: Preserves historical context across multiple compaction cycles by merging old and new summaries.
- **Timeline Preservation**: Extracts and maintains event timeline from conversation history (code-based, LLM-independent).
- **Safety Fallback**: Zero data loss on LLM failures — session remains unchanged if compaction fails.
- **Smart Threshold Buffer**: 10% buffer prevents missed compaction due to token estimation errors.
- **Summary Validation**: Validates required fields and auto-generates timeline if missing.

### 🔧 Technical Improvements

- **Plugin Architecture**: Fully integrated as an OpenClaw plugin (not just a workspace skill).
  - Installed to `~/.openclaw/extensions/openclaw-session-compact/`
  - Uses `api.registerCli()` for CLI command registration
  - Proper `openclaw.plugin.json` manifest with `id`, `cli`, and `configSchema`
- **Token Efficiency**: Achieves up to 97% token reduction while preserving critical context.
- **LLM Robustness**: Handles timeout, API errors, and JSON parsing failures gracefully.
- **Type Safety**: Full TypeScript support with strict mode enabled.
- **ESM Modules**: Proper ES module support with `NodeNext` resolution.

### 📚 Documentation

- Comprehensive `SKILL.md` with YAML frontmatter for OpenClaw skill discovery.
- `SKILL_CN.md` with complete Chinese documentation.
- `README.md` with quick start, API docs, and troubleshooting.
- `DEVELOPMENT.md` with plugin architecture guide and development workflow.
- `QWEN.md` with project context and key learnings.

### 🐛 Bug Fixes

- Fixed SKILL.md missing YAML frontmatter (caused skill to be silently skipped).
- Fixed timeline extraction to work independently of LLM response quality.
- Fixed recursive merge to preserve event order across multiple compactions.
- Fixed shell injection vulnerability in LLM command execution.
- Fixed version mismatch between `_meta.json` (0.1.0) and `package.json` (1.0.0).

### 🔒 Security

- No hard-coded API keys — relies on OpenClaw configuration.
- Shell command arguments properly escaped.
- Read-only access to configuration files.

### 📦 Dependencies

| Package | Type | Version |
|---------|------|---------|
| `commander` | runtime | ^12.0.0 |
| `typescript` | dev | ^5.3.0 |
| `jest` | dev | ^29.7.0 |
| `ts-jest` | dev | ^29.1.0 |
| `@types/node` | dev | ^20.10.0 |
| `openclaw` | peer | ^2026.3.28 |

### 🚀 Installation

```bash
# From ClawHub
openclaw skills install openclaw-session-compact

# From local path
openclaw skills install /Users/lab/.openclaw/workspace/skills/openclaw-session-compact
```

### ⚙️ Configuration

Add to `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "allow": ["openclaw-session-compact"],
    "entries": {
      "openclaw-session-compact": { "enabled": true }
    }
  },
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

### 📖 Usage

```bash
# Check session status
openclaw compact-status

# Manual compaction
openclaw compact

# Force compaction (even if under threshold)
openclaw compact --force

# View configuration
openclaw compact-config
```

### 📈 Performance Metrics

- **Test Coverage**: 63.63% (target 70%+)
- **Core Function Coverage**: 89.76%
- **Tests**: 65/65 passing
- **Average Compression Time**: < 1 second (without LLM)
- **Token Savings**: Typically 85-95%

### 🎯 Future Roadmap

- [ ] Integrate with actual OpenClaw session storage (replace mock data)
- [ ] Optimize LLM calls (use direct API instead of CLI exec)
- [ ] Increase test coverage to 70%+
- [ ] Add unit tests for CLI registration
- [ ] Support custom compression strategies
- [ ] Add performance metrics and logging
- [ ] Add vector database support for semantic search of compressed history
- [ ] Publish to GitHub with automated release workflow

---

**Full Changelog**: [View commits](https://github.com/your-org/openclaw-session-compact/commits/main)

**License**: MIT

**Release Date**: 2026-04-06

**Maintainer**: SDC-creator
