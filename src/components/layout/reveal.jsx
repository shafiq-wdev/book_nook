"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Scroll reveal shared by server-rendered sections. Wrap static markup with
 * this client component to fade content in as it enters the viewport, while
 * respecting the visitor's reduced-motion preference.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  amount = 0.2,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.55,
        delay: reduceMotion ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
