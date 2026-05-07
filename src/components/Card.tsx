import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`rounded-[1.75rem] border border-white/10 bg-[#101B36]/85 p-5 shadow-xl backdrop-blur ${className}`}
    >
      {children}
    </motion.section>
  );
}
