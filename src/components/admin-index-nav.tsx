"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

type AdminLink = {
  href: string;
  label: string;
  isActive: (pathname: string) => boolean;
};

const adminLinks: AdminLink[] = [
  { href: "/admin", label: "Dashboard", isActive: (p) => p === "/admin" },
  { href: "/admin/content", label: "Content", isActive: (p) => p.startsWith("/admin/content") },
  { href: "/admin/analytics", label: "Analytics", isActive: (p) => p.startsWith("/admin/analytics") },
  { href: "/admin/settings", label: "Settings", isActive: (p) => p.startsWith("/admin/settings") },
  { href: "/admin/logs", label: "Logs", isActive: (p) => p.startsWith("/admin/logs") },
  { href: "/admin/support", label: "Support", isActive: (p) => p.startsWith("/admin/support") },
  {
    href: "/admin/import-export",
    label: "Import/Export",
    isActive: (p) => p.startsWith("/admin/import-export"),
  },
];

export function AdminIndexNav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <motion.nav
      className="flex flex-wrap gap-2"
      initial={reduceMotion ? false : { opacity: 0, y: -6 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {adminLinks.map((link, index) => {
        const isActive = link.isActive(pathname);

        return (
          <motion.div
            key={link.href}
            initial={reduceMotion ? false : { opacity: 0, y: -4 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.03,
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
                  layoutId="admin-active-pill"
                  className="absolute inset-0 rounded-full bg-accent shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              ) : null}
              <span className="relative z-10">{link.label}</span>
            </Link>
          </motion.div>
        );
      })}
    </motion.nav>
  );
}