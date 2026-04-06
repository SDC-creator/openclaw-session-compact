import { Command } from 'commander';
import { loadConfig } from './compact/config.js';
import {
  compactSession,
  estimateTokenCount,
  shouldCompact,
  getCurrentModel
} from './compact/engine.js';

// Mock session messages (TODO: integrate with actual OpenClaw session storage)
function getCurrentSessionMessages(): Array<{ role: string; content?: string }> {
  return [
    { role: 'user', content: 'Hello, how do I start a new project?' },
    { role: 'assistant', content: 'Sure! Let me help you set up a new project.' },
    { role: 'user', content: 'A TypeScript CLI tool' },
    { role: 'assistant', content: 'Great choice! I will help you set up a TypeScript CLI tool.' },
  ];
}

/**
 * OpenClaw plugin register function.
 */
export function register(api: any) {
  const config = loadConfig();

  // Register CLI commands
  api.registerCli(
    async ({ program }: { program: Command }) => {
      // compact command
      program
        .command('compact')
        .description('Manually compact the current session history to save tokens')
        .option('--force', 'Force compact even if under threshold')
        .action(async (opts: any) => {
          const messages = getCurrentSessionMessages();
          const totalTokens = estimateTokenCount(messages);
          const force = opts?.force === true;

          console.log(`📊 Current session tokens: ${totalTokens}`);
          console.log(`📉 Threshold: ${config.max_tokens}`);

          if (!force && !shouldCompact(messages, config)) {
            console.log('✅ Session is within token limits. No compaction needed.');
            return;
          }

          console.log('🔄 Compacting session...');
          const result = await compactSession(messages, config);

          if (result.removedCount === 0) {
            console.log('⚠️ No messages to compact.');
            return;
          }

          console.log(`✅ Successfully compacted ${result.removedCount} messages.`);
          console.log(`💰 Saved ~${result.savedTokens} tokens.`);
          console.log(`📝 Summary preview:\n${result.formattedSummary.substring(0, 200)}...`);
        });

      // compact-status command
      program
        .command('compact-status')
        .description('Show current session token usage and compression status')
        .action(() => {
          const messages = getCurrentSessionMessages();
          const totalTokens = estimateTokenCount(messages);
          const needsCompact = shouldCompact(messages, config);
          const actualModel = config.model || getCurrentModel();

          console.log('📊 Session Status');
          console.log('────────────────────────────────────');
          console.log(`  Current tokens: ${totalTokens.toLocaleString()}`);
          console.log(`  Threshold:      ${config.max_tokens.toLocaleString()}`);
          console.log(`  Usage:          ${Math.round((totalTokens / config.max_tokens) * 100)}%`);
          console.log(`  Status:         ${needsCompact ? '⚠️ Needs compact' : '✅ OK'}`);
          console.log('────────────────────────────────────');
          console.log(`  Preserve recent: ${config.preserve_recent} messages`);
          console.log(`  Auto compact:    ${config.auto_compact ? 'Enabled' : 'Disabled'}`);
          console.log(`  Model:           ${actualModel}`);
        });

      // compact-config command
      program
        .command('compact-config')
        .description('Show or update compact configuration')
        .argument('[key]', 'Configuration key (e.g., max_tokens, preserve_recent)')
        .argument('[value]', 'New value')
        .action((key: string, value: string) => {
          if (!key) {
            console.log('🔧 Current Configuration');
            console.log('────────────────────────────────────');
            Object.entries(config).forEach(([k, v]) => {
              console.log(`  ${k}: ${v}`);
            });
            return;
          }

          if (!value) {
            const val = (config as any)[key];
            if (val === undefined) {
              console.error(`❌ Unknown config key: ${key}`);
              return;
            }
            console.log(`${key} = ${val}`);
            return;
          }

          console.log(`⚙️  Setting ${key} = ${value} (not persisted yet)`);
        });
    },
    {
      commands: ['compact', 'compact-status', 'compact-config'],
      descriptors: [
        { name: 'compact', description: 'Manually compact the current session history to save tokens' },
        { name: 'compact-status', description: 'Show current session token usage and compression status' },
        { name: 'compact-config', description: 'Show or update compact configuration' },
      ]
    }
  );
}

// Export types and core functions for programmatic use
export type { CompactConfig } from './compact/config.js';
export { generateSummary, estimateTokenCount, compactSession } from './compact/engine.js';
