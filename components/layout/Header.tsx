'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { slideDown } from '@/lib/animations';

export function Header() {
  return (
    <motion.header
      initial="initial"
      animate="animate"
      variants={slideDown}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Zap className="h-6 w-6 fill-primary text-primary" />
          </motion.div>
          <span className="text-xl font-bold">EV Finder</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-primary"
          >
            Browse
          </Link>
          <Link
            href="/compare"
            className="transition-colors hover:text-primary"
          >
            Compare
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/find-your-ev">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="hidden sm:inline-flex">
                Get Recommendations
              </Button>
            </motion.div>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
