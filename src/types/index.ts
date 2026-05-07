import type { LucideIcon } from "lucide-react";

export type TabId = "home" | "missions" | "progress" | "content" | "profile";

export type ScreenId =
  | "dashboard"
  | "track"
  | "lesson"
  | "exercise"
  | "quiz"
  | "reflection"
  | "mission"
  | "progress"
  | "library"
  | "profile";

export type LessonStatus = "completed" | "current" | "available" | "locked";

export type StoicLesson = {
  id: string;
  title: string;
  description: string;
  status: LessonStatus;
};

export type StoicTrack = {
  title: string;
  description: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  lessons: StoicLesson[];
};

export type BottomNavItem = {
  id: TabId;
  label: string;
  icon: LucideIcon;
  screen: ScreenId;
};
