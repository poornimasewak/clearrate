// lib/agno/client.ts
import { AgnoClient } from '@antipopp/agno-client';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Initialize Agno Client with Claude Sonnet 3.5 (Sonnet 4.5)
 * Note: AgnoClient configuration - adjust based on package requirements
 */
export const agnoClient = new AgnoClient({
    // apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY,
    // model: 'claude-sonnet-4-20250514', // Latest Sonnet 3.5 model
    // Alternative models:
    // 'claude-3-5-sonnet-20241022' - Previous Sonnet 3.5
    // 'claude-3-opus-20240229' - Opus for complex tasks
} as any); // Type assertion for compatibility

/**
 * Direct Anthropic client for advanced usage
 */
export const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY,
});

/**
 * Claude model configuration
 */
export const CLAUDE_CONFIG = {
    // Sonnet 3.5 - Best balance of speed and intelligence
    SONNET: 'claude-sonnet-4-20250514',
    
    // For quick summaries and simple tasks
    HAIKU: 'claude-3-5-haiku-20241022',
    
    // For complex reasoning and analysis
    OPUS: 'claude-3-opus-20240229',
    
    // Max tokens for different tasks
    MAX_TOKENS: {
        SUMMARY: 2048,
        ANALYSIS: 4096,
        DETAILED: 8192,
    },
};

export type ClaudeModel = typeof CLAUDE_CONFIG.SONNET | typeof CLAUDE_CONFIG.HAIKU | typeof CLAUDE_CONFIG.OPUS;

