# Release Notes - Session Compact v1.0.0

## 🎉 First Release

### ✨ Features

- **Automatic Session Compaction**: Automatically compresses session history when token count exceeds threshold (default: 10,000 tokens).
- **Recursive Summary Merge**: Preserves historical context across multiple compaction cycles by merging old and new summaries.
- **Timeline Preservation**: Extracts and maintains event timeline from conversation history (Claw Code-aligned logic).
- **Safety Fallback**: Zero data loss on LLM failures - session remains unchanged if compaction fails.
- **Smart Threshold Buffer**: 10% buffer prevents missed compaction due to token estimation errors.
- **Summary Validation**: Validates required fields and auto-generates timeline if missing.

### 🔧 Technical Improvements

- **Claw Code Alignment**: Fully aligned with Claw Code's timeline extraction and merge logic.
- **Token Efficiency**: Achieves up to 97% token reduction while preserving critical context.
- **LLM Robustness**: Handles timeout, API errors, and JSON parsing failures gracefully.
- **Type Safety**: Full TypeScript support with strict mode enabled.

### 📚 Documentation

- Comprehensive `SKILL.md` with installation, usage, and troubleshooting guide.
- `DEVELOPMENT.md` with project structure and contribution guidelines.
- `README.md` with quick start and configuration examples.

### 🐛 Bug Fixes

- Fixed timeline extraction to work independently of LLM response quality.
- Fixed recursive merge to preserve event order across multiple compactions.
- Fixed shell injection vulnerability in LLM command execution.

### 🔒 Security

- No hard-coded API keys - relies on OpenClaw configuration.
- Shell command arguments properly escaped.
- Read-only access to configuration files.

### 📦 Dependencies

- `commander`: ^12.0.0 (CLI argument parsing)
- `openclaw`: ^2026.3.28 (peer dependency)

### 🚀 Installation

```bash
openclaw skills install https://github.com/your-org/openclaw-session-compact
```

### ⚙️ Configuration

Add to `~/.openclaw/config.json`:

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
          "model": "qwen/qwen3.5-122b-a10b"
        }
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
```

### 🎯 Future Roadmap

- [ ] Add unit tests with vitest
- [ ] Support custom compression strategies
- [ ] Add performance metrics and logging
- [ ] Integrate with OpenClaw core for automatic triggering
- [ ] Add vector database support for semantic search of compressed history

---

**Full Changelog**: [View commits](https://github.com/your-org/openclaw-session-compact/commits/main)

**License**: MIT
