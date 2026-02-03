'use client';

import type { LucideIcon } from 'lucide-react';

interface Tab {
  label: string;
  icon?: LucideIcon;
}

interface FilterTabsProps {
  tabs: (string | Tab)[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function FilterTabs({ tabs, activeTab, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const label = typeof tab === 'string' ? tab : tab.label;
        const Icon = typeof tab === 'string' ? null : tab.icon;
        const isActive = activeTab === label;

        return (
          <button
            key={label}
            onClick={() => onChange(label)}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-gradient-to-r from-pulse to-synapse text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {Icon && <Icon size={14} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
