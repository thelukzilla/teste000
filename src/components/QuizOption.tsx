export function QuizOption({ label, text, selected, correct, onClick }: { label: string; text: string; selected?: boolean; correct?: boolean; onClick?: () => void }) {
  const resolved = correct || selected
    ? "border-lime-300/60 bg-lime-300/15 text-lime-50 shadow-green"
    : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-sky-300/40 hover:bg-sky-300/10";

  return (
    <button onClick={onClick} className={`w-full rounded-3xl border p-4 text-left transition active:scale-[0.99] ${resolved}`}>
      <div className="flex gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-black">{label}</span>
        <span className="text-sm font-semibold leading-relaxed">{text}</span>
      </div>
    </button>
  );
}
