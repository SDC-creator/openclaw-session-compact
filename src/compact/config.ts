export interface CompactConfig {
  max_tokens: number;
  preserve_recent: number;
  auto_compact: boolean;
  model: string;
}

// 默认配置：模型留空，将在运行时动态读取 OpenClaw 配置
const DEFAULT_CONFIG: CompactConfig = {
  max_tokens: 10000, // 恢复默认阈值
  preserve_recent: 4,
  auto_compact: true,
  model: '' // 空字符串表示使用 OpenClaw 全局默认模型
};

export function loadConfig(overrides: Partial<CompactConfig> = {}): CompactConfig {
  return {
    ...DEFAULT_CONFIG,
    ...overrides
  };
}

export function mergeConfigs(base: Partial<CompactConfig>, override: Partial<CompactConfig>): CompactConfig {
  return {
    ...DEFAULT_CONFIG,
    ...base,
    ...override
  };
}
