"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

export function DashboardCta() {
  const reduceMotion = useReducedMotion();
  const { locale } = useLocale();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className="relative"
    >
      <Link
        href="/create"
        className="inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl bg-foreground px-5 text-sm font-medium text-background shadow-lg shadow-foreground/10 transition hover:opacity-95"
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.18)_45%,transparent_70%)]"
          initial={{ x: "-120%" }}
          animate={reduceMotion ? undefined : { x: "120%" }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 1.2,
          }}
        />
        <span className="relative z-10 flex items-center gap-2">
          {locale === "ar" ? "أنشئ جديدًا" : "Create New"}
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </motion.div>
  );
}
