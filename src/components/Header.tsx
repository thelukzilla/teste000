import { ChevronLeft } from "lucide-react";

export function Header({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack?: () => void }) {
  return (
    <header className="mb-5 flex items-center gap-3">
      {onBack ? (
        <button onClick={onBack} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-slate-200 ring-1 ring-white/10">
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : null}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm font-medium text-slate-400">{subtitle}</p> : null}
      </div>
    </header>
  );
}
