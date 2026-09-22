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
      <div className="p-6 bg-white dark:bg-[#15181e] border border-stone-200/80 dark:border-stone-800 rounded-3xl shadow-subtle space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
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
    <div className="p-6 bg-white dark:bg-[#15181e] border border-stone-200/80 dark:border-stone-800 rounded-3xl shadow-subtle space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-stone-500" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Historical Digest
          </span>
        </div>

        {pageUrl && (
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 dark:text-stone-300 hover:underline"
          >
            <span>Wikipedia Article</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
        About {title}
      </h3>

      {description && (
        <p className="text-xs font-serif italic text-stone-500">
          {description}
        </p>
      )}

      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
        {extract}
      </p>
    </div>
  );
};
