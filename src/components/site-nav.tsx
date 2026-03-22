"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/browse", label: "Browse" },
  { href: "/search", label: "Search" },
  { href: "/create", label: "Create" },
  { href: "/admin/import-export", label: "Import/Export" },
];

export function SiteNav() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="border-b border-border/60"
      initial={reduceMotion ? false : { opacity: 0, y: -10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
          Matriarchal Shari&apos;ah
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.06 + index * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={link.href}
                className="rounded-full border border-border px-4 py-2 text-sm transition hover:bg-accent"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}