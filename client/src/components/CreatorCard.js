'use client';

import Link from 'next/link';
import { MapPin, Sparkles, Eye, Award } from 'lucide-react';
import CreatorAvatar from '@/components/creator/CreatorAvatar';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { getCreatorDisplay } from '@/lib/creatorUtils';

export default function CreatorCard({ creator, delay = 0 }) {
  const {
    _id,
    totalViewsTimeframe = 0,
    totalVideosTimeframe = 0,
    historicalRelevance = 0,
  } = creator;

  const { fullName, avatarLetter, profilePicture, location, niches, niche } =
    getCreatorDisplay(creator);

  const nicheDisplay =
    niches.length > 0 ? niches.slice(0, 3) : niche ? [niche] : ['General'];

  return (
    <Link href={`/dashboard/brand/creator/${_id}`} className="block h-full">
      <SpotlightCard delay={delay} className="h-full cursor-pointer transition-transform duration-300 hover:-translate-y-1">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <CreatorAvatar
              creatorId={_id}
              profilePicture={profilePicture}
              avatarLetter={avatarLetter}
              variant="card"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-spatial">{fullName}</h3>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {nicheDisplay.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--spatial-accent-border)] bg-[var(--spatial-accent-bg)] px-2 py-0.5 text-xs font-medium text-spatial-accent"
                  >
                    <Sparkles className="h-3 w-3" />
                    {tag.length > 25 ? `${tag.substring(0, 25)}…` : tag}
                  </span>
                ))}
                {niches.length > 3 && (
                  <span className="inline-flex items-center rounded-lg bg-spatial-card-muted px-2 py-0.5 text-xs font-medium text-spatial-muted">
                    +{niches.length - 3} more
                  </span>
                )}
              </div>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-spatial-card-muted px-2 py-0.5 text-xs font-medium text-spatial-muted">
                <MapPin className="h-3 w-3" />
                {location}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl border border-spatial bg-spatial-card-muted p-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-spatial-muted">
                <Eye className="h-3 w-3" />
                Views
              </div>
              <p className="mt-0.5 font-mono text-sm font-bold text-spatial">
                {totalViewsTimeframe >= 1000
                  ? `${(totalViewsTimeframe / 1000).toFixed(1)}K`
                  : totalViewsTimeframe}
              </p>
            </div>
            <div className="border-x border-spatial text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-spatial-muted">
                <Award className="h-3 w-3" />
                Relevance
              </div>
              <p className="mt-0.5 font-mono text-sm font-bold text-spatial-accent">
                {historicalRelevance >= 1000
                  ? `${(historicalRelevance / 1000).toFixed(1)}K`
                  : Math.round(historicalRelevance)}
              </p>
            </div>
            <div className="text-center">
              <div className="text-xs text-spatial-muted">Videos</div>
              <p className="mt-0.5 font-mono text-sm font-bold text-spatial">
                {totalVideosTimeframe}
              </p>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}
