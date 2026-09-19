'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * GerminationAnimation — the landing hero's signature motion.
 *
 * A terminal window typewriter that animates a canned curl snippet
 * letter-by-letter (no live SSE — playground was removed per §1 decision 5).
 *
 * Under prefers-reduced-motion: renders the final composed frame instantly.
 */

const LINES = [
  { prefix: '$ ', text: 'curl https://api.ai.seedofcode.dev/v1/chat/completions \\' },
  { prefix: '  ', text: '-H "Authorization: Bearer soc_live_xK9mNpQr2vWz" \\' },
  { prefix: '  ', text: '-H "Content-Type: application/json" \\' },
  { prefix: '  ', text: '-d \'{"model":"llama3.1:8b","messages":[' },
  { prefix: '  ', text: '     {"role":"user","content":"Plant a prompt."}' },
  { prefix: '  ', text: '   ]}\'' },
  { prefix: '', text: '' },
  { prefix: '# ', text: '→  {"choices":[{"message":{"content":"Watch it grow into code."}}]}' },
];

const CHAR_DELAY_MS = 22; // ms per character
const LINE_PAUSE_MS = 120; // extra pause between lines

export function GerminationAnimation() {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [displayedLines, setDisplayedLines] = useState<string[]>(
    prefersReduced ? LINES.map((l) => l.prefix + l.text) : [],
  );
  const [cursorVisible, setCursorVisible] = useState(true);
  const [done, setDone] = useState(prefersReduced);
  const rafRef = useRef<number | null>(null);

  // Blinking cursor
  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(t);
  }, [done]);

  useEffect(() => {
    if (prefersReduced) return;

    let lineIdx = 0;
    let charIdx = 0;
    let lines: string[] = [];
    let lastTime = 0;
    let charDebt = 0;

    function step(now: number) {
      if (lineIdx >= LINES.length) {
        setDone(true);
        setCursorVisible(false);
        return;
      }

      const elapsed = now - lastTime;
      lastTime = now;
      charDebt += elapsed;

      const currentLine = LINES[lineIdx];
      const fullLine = currentLine.prefix + currentLine.text;

      while (charDebt >= CHAR_DELAY_MS) {
        charDebt -= CHAR_DELAY_MS;

        if (charIdx < fullLine.length) {
          charIdx++;
          const updated = [...lines, fullLine.slice(0, charIdx)];
          if (updated.length > lines.length) {
            lines = [...lines.slice(0, lineIdx), fullLine.slice(0, charIdx)];
          } else {
            lines[lineIdx] = fullLine.slice(0, charIdx);
          }
          setDisplayedLines([...lines]);
        } else {
          // Line complete — move to next
          lines[lineIdx] = fullLine;
          lineIdx++;
          charIdx = 0;
          charDebt -= LINE_PAUSE_MS; // Extra delay between lines
          if (lineIdx >= LINES.length) {
            setDisplayedLines([...lines]);
            setDone(true);
            setCursorVisible(false);
            return;
          }
          lines.push('');
          setDisplayedLines([...lines]);
        }
      }

      rafRef.current = requestAnimationFrame(step);
    }

    // Small initial delay before animation starts
    const timer = setTimeout(() => {
      lastTime = performance.now();
      lines = [''];
      setDisplayedLines(['']);
      rafRef.current = requestAnimationFrame(step);
    }, 600);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative overflow-hidden rounded-card border border-border bg-pine dark:bg-pine shadow-2xl"
      aria-label="Code example: curl request to SeedofCode AI API"
      role="img"
    >
      {/* Terminal title bar */}
      <div className="flex items-center gap-1.5 border-b border-[#24382c] bg-[#0a140f] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#c0432f]/80" />
        <span className="h-3 w-3 rounded-full bg-harvest/60" />
        <span className="h-3 w-3 rounded-full bg-chlorophyll/60" />
        <span className="ml-3 font-mono text-xs text-[#8aa394]">
          api.ai.seedofcode.dev
        </span>
      </div>

      {/* Code lines */}
      <div className="min-h-[180px] p-5 font-mono text-sm leading-relaxed">
        {displayedLines.map((line, i) => {
          const isLastLine = i === displayedLines.length - 1;
          const isComment = line.startsWith('# ');
          const isPrompt = line.startsWith('$ ');

          return (
            <div key={i} className="whitespace-pre-wrap break-all">
              <span
                className={
                  isComment
                    ? 'text-chlorophyll'
                    : isPrompt
                    ? 'text-harvest'
                    : 'text-[#c8d9c2]'
                }
              >
                {line}
              </span>
              {isLastLine && !done && (
                <span
                  className={`inline-block h-[1em] w-[0.55em] translate-y-[1px] bg-chlorophyll ${
                    cursorVisible ? 'opacity-100' : 'opacity-0'
                  } transition-opacity`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
