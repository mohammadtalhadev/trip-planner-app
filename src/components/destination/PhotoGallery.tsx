import React from 'react';
import { Camera } from 'lucide-react';
import { AsyncSection, PexelsPhoto } from '../../types/api';
import { Skeleton } from '../common/Skeleton';
import { ErrorCard } from '../common/ErrorCard';

interface PhotoGalleryProps {
  photos: AsyncSection<PexelsPhoto[]>;
  cityName: string;
  onRetry?: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  cityName,
  onRetry,
}) => {
  if (photos.status === 'loading') {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (photos.status === 'error' || !photos.data || photos.data.length === 0) {
    return (
      <ErrorCard
        title="Photo Gallery Unavailable"
        message={photos.error || `No destination photography found for ${cityName}.`}
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Visual Discovery
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Photo Gallery
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Camera className="w-4 h-4" />
          <span>Curated Photography</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.data.map((photo) => (
          <div
            key={photo.id}
            className="group relative h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm"
          >
            <img
              src={photo.src.medium || photo.src.large}
              alt={photo.alt}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
              <span className="text-xs text-white font-medium line-clamp-1">
                {photo.alt || cityName}
              </span>
              <span className="text-[10px] text-slate-300">
                Photo by {photo.photographer}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
