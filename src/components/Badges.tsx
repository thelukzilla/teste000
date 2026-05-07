import { Flame, Star } from "lucide-react";

export function XPBadge({ xp, nextLevelXp }: { xp: number; nextLevelXp: number }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 px-3 py-2 text-yellow-200">
      <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
      <span className="text-xs font-black">{xp} / {nextLevelXp} XP</span>
    </div>
  );
}

export function StreakBadge({ days }: { days: number }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-orange-300/25 bg-orange-300/10 px-3 py-2 text-orange-100">
      <Flame className="h-4 w-4 fill-orange-300 text-orange-300" />
      <span className="text-xs font-black">{days} dias</span>
    </div>
  );
}
