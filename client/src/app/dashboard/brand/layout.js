'use client';

import { usePathname } from 'next/navigation';
import { LayoutGroup, motion } from 'framer-motion';

export default function BrandDashboardLayout({ children }) {
  const pathname = usePathname();
  const isCreatorProfile = pathname?.includes('/dashboard/brand/creator/');

  return (
    <LayoutGroup id="brand-discovery">
      <motion.div
        key={pathname}
        initial={isCreatorProfile ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </LayoutGroup>
  );
}
