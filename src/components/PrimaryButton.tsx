import { ArrowRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "bg-gradient-to-r from-[#58CC02] to-[#1CB0F6] text-slate-950 shadow-green hover:scale-[1.01]",
  secondary: "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15",
  ghost: "bg-transparent text-slate-300 hover:bg-white/10",
};

export function PrimaryButton({ children, variant = "primary", className = "", ...props }: PrimaryButtonProps) {
  return (
    <button
      className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black transition active:scale-[0.98] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {variant !== "ghost" ? <ArrowRight className="h-4 w-4" /> : null}
    </button>
  );
}
