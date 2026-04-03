import { Command } from 'commander';
import { registerCompactCommands } from './cli/register.js';
import { loadConfig } from './compact/config.js';

export const skill = {
  name: 'session-compact',
  version: '1.0.0',
  description: 'Smart session compaction for OpenClaw',
  
  // CLI 命令注册
  cli: {
    register: (program: Command) => {
      registerCompactCommands(program);
    }
  },

  // 初始化（可选）
  init: async (config: any) => {
    const mergedConfig = loadConfig(config);
    console.log('[session-compact] Initialized with config:', mergedConfig);
    return mergedConfig;
  }
};

// 导出类型
export type { CompactConfig } from './compact/config.js';
export { generateSummary, estimateTokenCount, compactSession } from './compact/engine.js';
