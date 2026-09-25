'use client';

import * as React from 'react';
import { useState } from 'react';
import { CodeBlock } from './CodeBlock';

interface CodeTabItem {
  label: string;
  language: string;
  code: string;
}

interface CodeTabsProps {
  items: CodeTabItem[];
  defaultValue?: string;
}

export function CodeTabs({ items, defaultValue }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || items[0]?.label);

  if (!items || items.length === 0) return null;

  const activeItem = items.find((item) => item.label === activeTab) || items[0];

  return (
    <div className="my-6">
      <div className="mb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === item.label
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        <CodeBlock code={activeItem.code.trim()} language={activeItem.language} />
      </div>
    </div >
  );
}
