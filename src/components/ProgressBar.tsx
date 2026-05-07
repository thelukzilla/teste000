type ProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
  tone?: "green" | "blue" | "purple" | "yellow";
};

const toneClass = {
  green: "from-[#58CC02] to-[#7ED957]",
  blue: "from-[#1CB0F6] to-[#2563EB]",
  purple: "from-[#8B5CF6] to-[#A855F7]",
  yellow: "from-[#FFD43B] to-[#FBBF24]",
};

export function ProgressBar({ value, max = 100, label, tone = "green" }: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      ) : null}
      <div className="h-3 overflow-hidden rounded-full bg-slate-950/70 ring-1 ring-white/10">
        <div className={`h-full rounded-full bg-gradient-to-r ${toneClass[tone]} shadow-green transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
