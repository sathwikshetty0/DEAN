import React from 'react';
import { Activity } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
}

export const EmptyState = ({ icon: Icon = Activity, title, description }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-6 border border-[var(--border-default)]">
       <Icon className="w-8 h-8 text-[var(--text-muted)]" />
    </div>
    <h3 className="text-xl font-extrabold font-syne mb-2">{title}</h3>
    <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">{description}</p>
  </div>
);
