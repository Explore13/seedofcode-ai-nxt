import type { ModelInfo } from '@/lib/types';
import {
  STATIC_MODELS,
  familyColour,
  modelDisplayName,
} from './models-data';
import { cn } from '@/lib/cn';

interface ModelBadgeProps {
  name: string;
  family: string | null | undefined;
  parameterSize: string | null | undefined;
}

function ModelBadge({ name, family, parameterSize }: ModelBadgeProps) {
  const colour = familyColour(family);
  const display = modelDisplayName(name);

  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-control border px-3 py-1.5 text-sm',
        colour,
      )}
    >
      <span className="font-medium">{display}</span>
      {parameterSize && (
        <span className="font-mono text-xs opacity-70">{parameterSize}</span>
      )}
    </div>
  );
}

interface ModelsStripProps {
  models?: ModelInfo[];
}

/**
 * Scrolling strip of available models.
 * Duplicates the list to create a seamless infinite scroll marquee.
 * Under prefers-reduced-motion: scrolling pauses (CSS handles it).
 */
export function ModelsStrip({ models }: ModelsStripProps) {
  // Use live models if provided (from ISR), else fall back to static list
  const list = (models && models.length > 0 ? models : STATIC_MODELS).filter(
    (m) => 'name' in m,
  );

  const badges = list.map((m) => ({
    id: m.id ?? m.name,
    name: m.name,
    family: m.family ?? null,
    parameterSize: (m as ModelInfo).parameterSize ?? null,
  }));

  // Duplicate for seamless loop
  const doubled = [...badges, ...badges];

  return (
    <section
      aria-label="Available models"
      className="relative overflow-hidden border-y border-border py-6"
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />

      {/* Scrolling track */}
      <div
        className="flex w-max animate-[marquee_40s_linear_infinite] gap-3 motion-reduce:animate-none"
        aria-hidden="true"
      >
        {doubled.map((m, i) => (
          <ModelBadge
            key={`${m.id}-${i}`}
            name={m.name}
            family={m.family}
            parameterSize={m.parameterSize}
          />
        ))}
      </div>

      {/* Accessible static label (hidden from sight but readable by SR) */}
      <p className="sr-only">
        Available models:{' '}
        {badges.map((b) => modelDisplayName(b.name)).join(', ')}
      </p>
    </section>
  );
}
