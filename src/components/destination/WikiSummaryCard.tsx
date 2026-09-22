import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { AsyncSection, WikipediaSummary } from '../../types/api';
import { Skeleton } from '../common/Skeleton';
import { ErrorCard } from '../common/ErrorCard';

interface WikiSummaryCardProps {
  wiki: AsyncSection<WikipediaSummary>;
  cityName: string;
  onRetry?: () => void;
}

export const WikiSummaryCard: React.FC<WikiSummaryCardProps> = ({
  wiki,
  cityName,
  onRetry,
}) => {
  if (wiki.status === 'loading') {
    return (
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    );
  }

  if (wiki.status === 'error' || !wiki.data) {
    return (
      <ErrorCard
        title="Destination Overview Unavailable"
        message={wiki.error || `No Wikipedia summary found for ${cityName}.`}
        onRetry={onRetry}
      />
    );
  }

  const { title, extract, description, pageUrl } = wiki.data;

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Wikipedia Information
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              About {title}
            </h3>
          </div>
        </div>

        {pageUrl && (
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Read more</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {description && (
        <p className="text-xs font-semibold text-purple-600 dark:text-purple-300 italic">
          {description}
        </p>
      )}

      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {extract}
      </p>
    </div>
  );
};
