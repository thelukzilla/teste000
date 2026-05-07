import type { ReactNode } from "react";
import type { BottomNavItem, TabId } from "@/types";
import { BottomNav } from "./BottomNav";

export function AppShell({ children, activeTab, onNavigate }: { children: ReactNode; activeTab: TabId; onNavigate: (item: BottomNavItem) => void }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050B1E] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(28,176,246,0.22),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(139,92,246,0.18),transparent_28%),linear-gradient(180deg,#07122E_0%,#050B1E_55%,#020617_100%)]" />
      <div className="fixed left-1/2 top-6 h-44 w-44 -translate-x-1/2 rounded-full bg-[#58CC02]/10 blur-3xl" />
      <div className="relative mx-auto min-h-screen w-full max-w-md px-4 pb-28 pt-5">
        {children}
      </div>
      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />
    </main>
  );
}
