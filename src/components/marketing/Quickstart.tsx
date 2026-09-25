import { cn } from '@/lib/cn';
import { CodeBlock } from '@/components/shared/CodeBlock';

const STEPS = [
  {
    number: '01',
    title: 'Get an API key',
    description:
      'Create a free account, then generate a key from the dashboard. Keys are prefixed soc_live_ so they\'re easy to spot in your code.',
    code: `# From the dashboard → API Keys → Create key
# Copy the key — you only see it once`,
    lang: 'bash',
  },
  {
    number: '02',
    title: 'Point your client at SeedofCode AI',
    description:
      "It's one line. SeedofCode AI is OpenAI-API-compatible, so any SDK that supports a custom baseURL works — Python, Node, Go, or plain curl.",
    code: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.ai.seedofcode.dev/api",
  apiKey: "soc_live_your_key_here",
});`,
    lang: 'js',
  },
  {
    number: '03',
    title: 'Call the API',
    description:
      'Use the same chat/completions interface you already know. Pick any available model — llama, qwen, mistral, and more.',
    code: `const response = await client.chat.completions.create({
  model: "qwen2.5vl:7b",
  messages: [
    { role: "user", content: "Plant a prompt." }
  ],
});
console.log(response.choices[0].message.content);
// → "Watch it grow into code."`,
    lang: 'js',
  },
];

interface StepProps {
  step: (typeof STEPS)[0];
  isLast?: boolean;
}

function QuickstartStep({ step, isLast }: StepProps) {
  return (
    <div className="relative grid gap-6 md:grid-cols-[auto_1fr]">
      {/* Number + connector line */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-chlorophyll bg-chlorophyll/10 font-mono text-sm font-bold text-chlorophyll">
          {step.number}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-chlorophyll/40 to-transparent" />
        )}
      </div>

      {/* Content */}
      <div className={cn('space-y-4', !isLast && 'pb-12')}>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {step.description}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-card">
          <CodeBlock code={step.code} language={step.lang} />
        </div>
      </div>
    </div>
  );
}

export function Quickstart() {
  return (
    <section
      id="quickstart"
      aria-labelledby="quickstart-heading"
      className="mx-auto max-w-3xl px-6 py-20"
    >
      <div className="mb-12 text-center">
        <p className="mb-3 font-mono text-xs font-medium tracking-widest text-chlorophyll uppercase">
          Quickstart
        </p>
        <h2
          id="quickstart-heading"
          className="font-display text-display-sm font-semibold tracking-tight text-foreground"
        >
          From zero to inference
          <br />
          in three steps.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          If you already use the OpenAI SDK, you&apos;re 90% done. Change two
          lines, keep the rest.
        </p>
      </div>

      <div>
        {STEPS.map((step, i) => (
          <QuickstartStep
            key={step.number}
            step={step}
            isLast={i === STEPS.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
