import { BarChart3, BookOpen, Flag, Home, User } from "lucide-react";
import type { BottomNavItem, TabId } from "@/types";

const navItems: BottomNavItem[] = [
  { id: "home", label: "Início", icon: Home, screen: "dashboard" },
  { id: "missions", label: "Missões", icon: Flag, screen: "mission" },
  { id: "progress", label: "Progresso", icon: BarChart3, screen: "progress" },
  { id: "content", label: "Conteúdos", icon: BookOpen, screen: "library" },
  { id: "profile", label: "Perfil", icon: User, screen: "profile" },
];

export function BottomNav({ activeTab, onNavigate }: { activeTab: TabId; onNavigate: (item: BottomNavItem) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 pb-3">
      <div className="grid grid-cols-5 gap-1 rounded-[1.7rem] border border-white/10 bg-[#07122E]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.id === activeTab;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item)}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.68rem] font-black transition ${
                active ? "bg-gradient-to-br from-[#58CC02] to-[#1CB0F6] text-slate-950 shadow-green" : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
