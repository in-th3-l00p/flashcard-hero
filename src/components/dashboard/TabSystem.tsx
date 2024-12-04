import React from 'react';
import { cn } from '../../utils/cn';

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface TabSystemProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabSystem: React.FC<TabSystemProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-teal-100">
      <nav className="-mb-px flex overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex shrink-0 items-center border-b-2 px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
            >
              <Icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};