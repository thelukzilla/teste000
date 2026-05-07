import { Check, Lock, Play, Sparkles } from "lucide-react";
import type { StoicLesson } from "@/types";

export function JourneyNode({ lesson, index }: { lesson: StoicLesson; index: number }) {
  const state = {
    completed: { icon: Check, badge: "Concluído", style: "border-lime-300/40 bg-lime-300/15 text-lime-100", orb: "bg-[#58CC02] text-slate-950 shadow-green" },
    current: { icon: Play, badge: "Atual", style: "border-sky-300/50 bg-sky-300/15 text-sky-100", orb: "bg-[#1CB0F6] text-slate-950 shadow-glow" },
    available: { icon: Sparkles, badge: "Disponível", style: "border-violet-300/35 bg-violet-300/12 text-violet-100", orb: "bg-[#8B5CF6] text-white" },
    locked: { icon: Lock, badge: "Bloqueado", style: "border-white/10 bg-white/[0.04] text-slate-400", orb: "bg-slate-700 text-slate-300" },
  }[lesson.status];

  const Icon = state.icon;
  const offset = index % 2 === 0 ? "mr-10" : "ml-10";

  return (
    <div className={`relative ${offset}`}>
      <div className={`rounded-[1.5rem] border p-4 ${state.style}`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${state.orb}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-black text-white">{lesson.title}</h3>
              <span className="rounded-full bg-black/25 px-2 py-1 text-[0.62rem] font-black uppercase tracking-wider">{state.badge}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">{lesson.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
