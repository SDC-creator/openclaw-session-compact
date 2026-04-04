import { loadConfig, mergeConfigs, type CompactConfig } from '../config.js';

describe('Config', () => {
  describe('loadConfig', () => {
    it('should return default config when no overrides provided', () => {
      const config = loadConfig();
      expect(config.max_tokens).toBe(10000);
      expect(config.preserve_recent).toBe(4);
      expect(config.auto_compact).toBe(true);
      expect(config.model).toBe('');
    });

    it('should override default values with provided options', () => {
      const config = loadConfig({
        max_tokens: 5000,
        preserve_recent: 6,
        model: 'qwen/qwen3.5-122b'
      });
      expect(config.max_tokens).toBe(5000);
      expect(config.preserve_recent).toBe(6);
      expect(config.model).toBe('qwen/qwen3.5-122b');
      expect(config.auto_compact).toBe(true); // default preserved
    });

    it('should handle partial overrides', () => {
      const config = loadConfig({ max_tokens: 8000 });
      expect(config.max_tokens).toBe(8000);
      expect(config.preserve_recent).toBe(4); // default
      expect(config.auto_compact).toBe(true); // default
    });
  });

  describe('mergeConfigs', () => {
    it('should merge base and override configs correctly', () => {
      const base = { max_tokens: 12000, preserve_recent: 5 };
      const override = { model: 'custom-model' };
      const config = mergeConfigs(base, override);
      
      expect(config.max_tokens).toBe(12000);
      expect(config.preserve_recent).toBe(5);
      expect(config.model).toBe('custom-model');
      expect(config.auto_compact).toBe(true); // default
    });

    it('should prioritize override over base', () => {
      const base = { max_tokens: 10000, preserve_recent: 4 };
      const override = { max_tokens: 15000 };
      const config = mergeConfigs(base, override);
      
      expect(config.max_tokens).toBe(15000);
      expect(config.preserve_recent).toBe(4);
    });

    it('should apply defaults when both base and override are empty', () => {
      const config = mergeConfigs({}, {});
      expect(config.max_tokens).toBe(10000);
      expect(config.preserve_recent).toBe(4);
      expect(config.auto_compact).toBe(true);
    });
  });
});
