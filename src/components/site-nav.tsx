"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

type NavLink = {
  href: string;
  label: string;
  isActive: (pathname: string) => boolean;
};

const navLinks: NavLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    isActive: (pathname) => pathname === "/dashboard",
  },
  {
    href: "/browse",
    label: "Browse",
    isActive: (pathname) => pathname === "/browse" || pathname.startsWith("/entities"),
  },
  {
    href: "/search",
    label: "Search",
    isActive: (pathname) => pathname.startsWith("/search"),
  },
  {
    href: "/create",
    label: "Create",
    isActive: (pathname) => pathname.startsWith("/create"),
  },
  {
    href: "/timeline",
    label: "Timeline",
    isActive: (pathname) => pathname.startsWith("/timeline"),
  },
  {
    href: "/admin/import-export",
    label: "Import/Export",
    isActive: (pathname) => pathname.startsWith("/admin/import-export"),
  },
];

export function SiteNav() {
  const pathname = usePathname();
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
          {navLinks.map((link, index) => {
            const isActive = link.isActive(pathname);

            return (
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
                  className={[
                    "relative inline-flex items-center justify-center overflow-hidden rounded-full border px-4 py-2 text-sm transition",
                    isActive
                      ? "border-foreground/20 text-foreground"
                      : "border-border hover:bg-accent",
                  ].join(" ")}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-accent shadow-sm"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  ) : null}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}