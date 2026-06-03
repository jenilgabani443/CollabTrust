'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, BarChart3, Lock } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const features = [
  {
    icon: Shield,
    title: 'Cryptographic Trust',
    description: 'Every contract and invoice is sealed with SHA-256 hashing to prevent post-agreement tampering.',
  },
  {
    icon: Zap,
    title: 'Real-Time Collaboration',
    description: 'Built-in encrypted chat with automatic redaction of sensitive contact and payment information.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Engine',
    description: 'Discover creators using advanced aggregation pipelines with historical relevance scoring.',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'Stripe-powered payments with automated invoicing, 5% platform fee, and 95% creator payouts.',
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[var(--color-primary)]/8 blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/25">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Collab<span className="text-[var(--color-primary)]">Trust</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-[var(--color-primary)]/40 transition-all hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-1.5">
            <Lock className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span className="text-xs font-semibold text-[var(--color-primary)]">Cryptographically Secured Collaborations</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Where Brands Meet
            <span className="text-[var(--color-primary)]"> Trusted </span>
            Creators
          </h1>

          <p className="mt-5 text-lg text-[var(--color-text-muted)] max-w-xl mx-auto leading-relaxed">
            A premium marketplace with cryptographic contract verification, real-time collaboration, and automated payouts.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[var(--color-primary)]/25 transition-all hover:shadow-[var(--color-primary)]/40 hover:scale-105"
            >
              Start Collaborating
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-8 py-3.5 text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <div className="mt-24 w-full max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-[var(--color-text)]">{feature.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-muted)]">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="h-20" />
      </main>
    </div>
  );
}
