'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Search, LogOut, Menu, X, Shield,
  User, Link2, HelpCircle, Trash2,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import ProfileModal from '@/components/ProfileModal';
import ContentLinksModal from '@/components/ContentLinksModal';
import HelpModal from '@/components/HelpModal';
import DeleteAccountModal from '@/components/DeleteAccountModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Modal states
  const [profileOpen, setProfileOpen] = useState(false);
  const [contentLinksOpen, setContentLinksOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (!user) return null;

  const isBrand = user.role === 'Brand';
  const pd = user.profileDetails || {};
  const displayName = pd.firstName || user.email?.split('@')[0] || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const navLinks = isBrand
    ? [
        { href: '/dashboard/brand', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/brand/discover', label: 'Discover', icon: Search },
      ]
    : [
        { href: '/dashboard/creator', label: 'Dashboard', icon: LayoutDashboard },
      ];

  // Dropdown menu items
  const dropdownItems = isBrand
    ? [
        { label: 'Profile', icon: User, action: () => { setDropdownOpen(false); setProfileOpen(true); } },
        { label: 'Brand Page Links', icon: Link2, action: () => { setDropdownOpen(false); setContentLinksOpen(true); } },
        { label: 'Help and Support', icon: HelpCircle, action: () => { setDropdownOpen(false); setHelpOpen(true); } },
        { label: 'Delete Account', icon: Trash2, action: () => { setDropdownOpen(false); setDeleteOpen(true); }, danger: true },
        { label: 'Logout', icon: LogOut, action: () => { setDropdownOpen(false); logout(); }, danger: true },
      ]
    : [
        { label: 'Profile', icon: User, action: () => { setDropdownOpen(false); setProfileOpen(true); } },
        { label: 'Your Content Links', icon: Link2, action: () => { setDropdownOpen(false); setContentLinksOpen(true); } },
        { label: 'Help and Support', icon: HelpCircle, action: () => { setDropdownOpen(false); setHelpOpen(true); } },
        { label: 'Delete Account', icon: Trash2, action: () => { setDropdownOpen(false); setDeleteOpen(true); }, danger: true },
        { label: 'Logout', icon: LogOut, action: () => { setDropdownOpen(false); logout(); }, danger: true },
      ];

  return (
    <>
      <nav className="glass-spatial sticky top-0 z-50 border-b border-spatial">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-600/80 shadow-lg shadow-violet-900/40 transition-transform group-hover:scale-105">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[var(--spatial-text)]">
                Collab<span className="text-[var(--spatial-accent)]">Trust</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'text-spatial-accent'
                        : 'text-spatial-muted hover:bg-spatial-hover hover:text-spatial'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 -z-10 rounded-xl border border-[var(--spatial-accent-border)] bg-[var(--spatial-accent-bg)]"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Profile Dropdown — Desktop */}
              <div className="relative ml-2 hidden border-l border-spatial pl-4 md:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-spatial-hover"
                >
                  {pd.profilePicture ? (
                    <img
                      src={pd.profilePicture}
                      alt={displayName}
                      className="h-9 w-9 rounded-xl border border-spatial object-cover"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div
                    className={`${pd.profilePicture ? 'hidden' : 'flex'} h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-700 text-sm font-bold text-white shadow-lg shadow-violet-900/30`}
                  >
                    {avatarLetter}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-spatial">{displayName}</p>
                    <p className="text-xs text-spatial-muted">{user.role}</p>
                  </div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="glass-spatial absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl py-2 shadow-2xl"
                    >
                      {dropdownItems.map((item, i) => {
                        const Icon = item.icon;
                        const isLast = i === dropdownItems.length - 1;
                        const isDanger = item.danger;

                        return (
                          <div key={item.label}>
                            {/* Separator before danger items */}
                            {i === dropdownItems.length - 2 && (
                              <div className="my-1 border-t border-spatial" />
                            )}
                            <button
                              onClick={item.action}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                                isDanger
                                  ? 'text-red-400 hover:bg-red-500/10'
                                  : 'text-spatial hover:bg-spatial-hover'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {item.label}
                            </button>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-spatial-muted transition-colors hover:bg-spatial-hover md:hidden"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-spatial fixed inset-x-0 top-16 z-40 space-y-1 border-b border-spatial p-4 md:hidden"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? 'border border-[var(--spatial-accent-border)] bg-[var(--spatial-accent-bg)] text-spatial-accent'
                      : 'text-spatial-muted hover:bg-spatial-hover hover:text-spatial'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-3 space-y-1 border-t border-spatial pt-3">
              {dropdownItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => { setMobileOpen(false); item.action(); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      item.danger
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-spatial hover:bg-spatial-hover'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <ContentLinksModal isOpen={contentLinksOpen} onClose={() => setContentLinksOpen(false)} />
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <DeleteAccountModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  );
}
