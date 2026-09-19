import type { ModelInfo } from '@/lib/types';

/**
 * Static fallback model list — shown when the API is unreachable at build time.
 * Keeps the models strip functional even without a live backend.
 */
export const STATIC_MODELS: Pick<
  ModelInfo,
  'id' | 'name' | 'family' | 'parameterSize' | 'capabilities'
>[] = [
  {
    id: 'llama3.1:8b',
    name: 'llama3.1:8b',
    family: 'llama',
    parameterSize: '8B',
    capabilities: ['chat'],
  },
  {
    id: 'llama3.1:70b',
    name: 'llama3.1:70b',
    family: 'llama',
    parameterSize: '70B',
    capabilities: ['chat'],
  },
  {
    id: 'qwen2.5:7b',
    name: 'qwen2.5:7b',
    family: 'qwen',
    parameterSize: '7B',
    capabilities: ['chat', 'code'],
  },
  {
    id: 'qwen2.5:32b',
    name: 'qwen2.5:32b',
    family: 'qwen',
    parameterSize: '32B',
    capabilities: ['chat', 'code'],
  },
  {
    id: 'mistral:7b',
    name: 'mistral:7b',
    family: 'mistral',
    parameterSize: '7B',
    capabilities: ['chat'],
  },
  {
    id: 'deepseek-coder:6.7b',
    name: 'deepseek-coder:6.7b',
    family: 'deepseek',
    parameterSize: '6.7B',
    capabilities: ['code'],
  },
  {
    id: 'phi3:mini',
    name: 'phi3:mini',
    family: 'phi',
    parameterSize: '3.8B',
    capabilities: ['chat'],
  },
  {
    id: 'gemma2:9b',
    name: 'gemma2:9b',
    family: 'gemma',
    parameterSize: '9B',
    capabilities: ['chat'],
  },
];

/** Colour assigned to each model family for the badge */
const FAMILY_COLOURS: Record<string, string> = {
  llama: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  qwen: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  mistral: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  deepseek: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  phi: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  gemma: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  default: 'bg-chlorophyll/15 text-chlorophyll border-chlorophyll/20',
};

export function familyColour(family: string | null | undefined): string {
  if (!family) return FAMILY_COLOURS.default;
  const key = family.toLowerCase();
  return FAMILY_COLOURS[key] ?? FAMILY_COLOURS.default;
}

/** Extract the base name without tag for display ("llama3.1:8b" → "Llama 3.1") */
export function modelDisplayName(name: string): string {
  const base = name.split(':')[0];
  // Capitalise and add spaces
  return base
    .replace(/([a-z])(\d)/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
