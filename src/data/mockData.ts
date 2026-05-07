import { Award, Brain, Compass, Dumbbell, Flame, HeartHandshake, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import type { StoicTrack } from "@/types";

// Dados mockados: suficientes para validar a experiência antes de criar backend ou conta real.
export const stoicTrack: StoicTrack = {
  title: "Estoicismo Prático",
  description: "Aprenda a focar no que você controla e agir com mais calma.",
  level: 1,
  xp: 60,
  nextLevelXp: 200,
  streak: 5,
  lessons: [
    { id: "controle", title: "Controle", description: "Domine o que depende de você.", status: "completed" },
    { id: "emocoes", title: "Emoções", description: "Observe, compreenda e escolha sua resposta.", status: "current" },
    { id: "virtude", title: "Virtude", description: "Pratique o que é certo, não o que é fácil.", status: "available" },
    { id: "adversidade", title: "Adversidade", description: "Fortaleça sua mente diante dos desafios.", status: "locked" },
    { id: "relacoes", title: "Relações", description: "Cultive conexões baseadas em respeito e maturidade.", status: "locked" },
  ],
};

export const foundations = [
  { title: "Dicotomia do controle", description: "Foque no que depende de você.", icon: Target },
  { title: "Virtude", description: "Agir com coragem, justiça, sabedoria e temperança.", icon: ShieldCheck },
  { title: "Razão", description: "Pensar antes de reagir.", icon: Brain },
  { title: "Aceitação", description: "Aceitar o que você não controla sem abandonar sua responsabilidade.", icon: Compass },
];

export const libraryItems = [
  { title: "Estoicismo Prático", description: "Clareza, calma e ação diante do que acontece.", status: "Liberado", icon: Sparkles, unlocked: true },
  { title: "Autoestima", description: "Construa confiança por pequenas ações.", status: "Em breve", icon: Award, unlocked: false },
  { title: "Disciplina", description: "Transforme intenção em repetição simples.", status: "Bloqueado", icon: Flame, unlocked: false },
  { title: "Rotina", description: "Organize energia, sono e foco sem rigidez extrema.", status: "Em breve", icon: Dumbbell, unlocked: false },
  { title: "Controle emocional", description: "Reconheça gatilhos e escolha respostas melhores.", status: "Bloqueado", icon: Brain, unlocked: false },
  { title: "Relacionamentos saudáveis", description: "Desenvolva respeito, limites e conversas maduras.", status: "Em breve", icon: HeartHandshake, unlocked: false },
];

export const weeklyProgress = [
  { day: "Seg", status: "completed" },
  { day: "Ter", status: "completed" },
  { day: "Qua", status: "completed" },
  { day: "Qui", status: "current" },
  { day: "Sex", status: "pending" },
  { day: "Sáb", status: "pending" },
  { day: "Dom", status: "pending" },
];

export const achievements = [
  { title: "Mente estável", description: "Manteve a calma em situações desafiadoras.", icon: Brain },
  { title: "Sem reclamar", description: "7 dias sem reclamações. Foco naquilo que importa.", icon: Users },
];

export const ethicalNotice =
  "Este app não substitui acompanhamento psicológico, médico ou profissional. Se você estiver em sofrimento intenso, crise emocional, pensamentos de autolesão ou dificuldade persistente, procure ajuda especializada.";
