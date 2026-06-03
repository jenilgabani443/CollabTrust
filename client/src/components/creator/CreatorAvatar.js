'use client';

import { motion } from 'framer-motion';
import {
  creatorAvatarLayoutId,
  creatorAvatarImageLayoutId,
} from '@/lib/creatorUtils';

const VARIANTS = {
  card: {
    shell: 'h-12 w-12 shrink-0 rounded-2xl border border-spatial shadow-lg shadow-[var(--spatial-shadow)]',
    text: 'text-lg',
    img: 'rounded-2xl',
  },
  profile: {
    shell:
      'h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-full border-4 border-[var(--spatial-avatar-border)] shadow-2xl shadow-[var(--spatial-shadow)]',
    text: 'text-4xl',
    img: 'rounded-full',
  },
};

/**
 * Shared-layout avatar for discover → profile transitions (Framer layoutId).
 */
export default function CreatorAvatar({
  creatorId,
  profilePicture,
  avatarLetter,
  variant = 'card',
  className = '',
}) {
  const styles = VARIANTS[variant] || VARIANTS.card;
  const layoutId = creatorAvatarLayoutId(creatorId);
  const imageLayoutId = creatorAvatarImageLayoutId(creatorId);

  return (
    <motion.div
      layoutId={layoutId}
      layout="position"
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className={`relative overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-700 ${styles.shell} ${className}`}
    >
      {profilePicture ? (
        <motion.img
          layoutId={imageLayoutId}
          src={profilePicture}
          alt=""
          className={`h-full w-full object-cover ${styles.img}`}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <motion.span
          layoutId={`${layoutId}-letter`}
          className={`flex h-full w-full items-center justify-center font-bold text-white ${styles.text}`}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        >
          {avatarLetter}
        </motion.span>
      )}
    </motion.div>
  );
}
