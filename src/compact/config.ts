export interface CompactConfig {
 max_tokens: number;
 preserve_recent: number;
 auto_compact: boolean;
 model: string;
}

// 默认配置：模型留空，将在运行时动态读取 OpenClaw 配置
const DEFAULT_CONFIG: CompactConfig = {
 max_tokens: 5000, // 默认阈值（保守模式）
 preserve_recent: 4,
 auto_compact: true,
 model: '' // 空字符串表示使用 OpenClaw 全局默认模型
};

export function loadConfig(overrides: Partial<CompactConfig> = {}): CompactConfig {
 // 优先级：overrides > DEFAULT_CONFIG
 // 注意：overrides 应该来自 api.getConfig()，包含用户在 openclaw.json 中的配置
 return {
 ...DEFAULT_CONFIG,
 ...overrides
 };
}

// 新增：从 OpenClaw 配置系统加载配置
export function loadFromOpenClawConfig(pluginConfig: Record<string, any> = {}): CompactConfig {
 // 插件配置应该包含在 openclaw.json 的 plugins.entries."openclaw-session-compact" 中
 // 或者在 skills.entries."openclaw-session-compact" 中（取决于 OpenClaw 版本）
 const config = pluginConfig as Partial<CompactConfig>;
 
 // 只合并用户明确设置的参数，未设置的保持默认值
 return {
 max_tokens: config.max_tokens ?? DEFAULT_CONFIG.max_tokens,
 preserve_recent: config.preserve_recent ?? DEFAULT_CONFIG.preserve_recent,
 auto_compact: config.auto_compact ?? DEFAULT_CONFIG.auto_compact,
 model: config.model ?? DEFAULT_CONFIG.model,
 };
}

export function mergeConfigs(base: Partial<CompactConfig>, override: Partial<CompactConfig>): CompactConfig {
 return {
 ...DEFAULT_CONFIG,
 ...base,
 ...override
 };
}
