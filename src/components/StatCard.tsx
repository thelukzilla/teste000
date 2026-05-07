import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, icon: Icon, tone = "blue" }: { label: string; value: string; icon: LucideIcon; tone?: "blue" | "green" | "purple" | "yellow" }) {
  const tones = {
    blue: "from-sky-400/25 to-blue-700/10 text-sky-200",
    green: "from-lime-400/25 to-emerald-700/10 text-lime-200",
    purple: "from-violet-400/25 to-fuchsia-700/10 text-violet-200",
    yellow: "from-yellow-300/25 to-amber-700/10 text-yellow-200",
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#101B36]/90 p-4 shadow-xl">
      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
    </div>
  );
}
