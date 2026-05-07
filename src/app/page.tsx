"use client";

import { motion } from "framer-motion";
import { Award, BarChart3, BookOpen, Brain, CalendarDays, CheckCircle2, Clock, Compass, Flame, Flag, Lock, MessageCircle, ShieldCheck, Star, Trophy, User, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { XPBadge, StreakBadge } from "@/components/Badges";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { JourneyNode } from "@/components/JourneyNode";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProgressBar } from "@/components/ProgressBar";
import { QuizOption } from "@/components/QuizOption";
import { StatCard } from "@/components/StatCard";
import { achievements, ethicalNotice, foundations, libraryItems, stoicTrack, weeklyProgress } from "@/data/mockData";
import type { BottomNavItem, ScreenId, TabId } from "@/types";

// Mantém a bottom navigation sincronizada mesmo quando o usuário entra em telas internas da trilha.
const screenTabMap: Record<ScreenId, TabId> = {
  dashboard: "home",
  track: "home",
  lesson: "home",
  exercise: "home",
  quiz: "home",
  reflection: "home",
  mission: "missions",
  progress: "progress",
  library: "content",
  profile: "profile",
};

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>("dashboard");
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState("Calmo");
  const [reflection, setReflection] = useState("");

  const activeTab = useMemo(() => screenTabMap[activeScreen], [activeScreen]);

  function navigateFromBottom(item: BottomNavItem) {
    // A navegação do MVP é local para manter o protótipo rápido, navegável e sem backend.
    setActiveScreen(item.screen);
  }

  return (
    <AppShell activeTab={activeTab} onNavigate={navigateFromBottom}>
      <motion.div key={activeScreen} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
        {activeScreen === "dashboard" && <Dashboard onGoToTrack={() => setActiveScreen("track")} onGoToMission={() => setActiveScreen("mission")} onGoToReflection={() => setActiveScreen("reflection")} />}
        {activeScreen === "track" && <TrackScreen onBack={() => setActiveScreen("dashboard")} onStartLesson={() => setActiveScreen("lesson")} />}
        {activeScreen === "lesson" && <LessonScreen onBack={() => setActiveScreen("track")} onNext={() => setActiveScreen("exercise")} />}
        {activeScreen === "exercise" && <ExerciseScreen onBack={() => setActiveScreen("lesson")} onAnswer={() => setActiveScreen("quiz")} />}
        {activeScreen === "quiz" && <QuizScreen selected={selectedQuizOption} onSelect={setSelectedQuizOption} onBack={() => setActiveScreen("exercise")} onContinue={() => setActiveScreen("reflection")} />}
        {activeScreen === "reflection" && <ReflectionScreen selectedMood={selectedMood} setSelectedMood={setSelectedMood} reflection={reflection} setReflection={setReflection} onBack={() => setActiveScreen("dashboard")} onSave={() => setActiveScreen("progress")} />}
        {activeScreen === "mission" && <MissionScreen />}
        {activeScreen === "progress" && <ProgressScreen />}
        {activeScreen === "library" && <LibraryScreen onOpenTrack={() => setActiveScreen("track")} />}
        {activeScreen === "profile" && <ProfileScreen />}
      </motion.div>
    </AppShell>
  );
}

function Dashboard({ onGoToTrack, onGoToMission, onGoToReflection }: { onGoToTrack: () => void; onGoToMission: () => void; onGoToReflection: () => void }) {
  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#17254A]/90 via-[#101B36]/95 to-[#07122E]/95 p-5 shadow-glow">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-sky-200">Protótipo MVP</p>
            <h1 className="text-3xl font-black tracking-tight">Project_srmen</h1>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300">Reconstrua sua mente, rotina e direção.</p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#58CC02] to-[#1CB0F6] text-slate-950 shadow-green">
            <Brain className="h-8 w-8" />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <StreakBadge days={stoicTrack.streak} />
          <XPBadge xp={stoicTrack.xp} nextLevelXp={stoicTrack.nextLevelXp} />
          <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-black text-slate-200">Nível {stoicTrack.level}</div>
        </div>
        <div className="mt-5">
          <ProgressBar value={stoicTrack.xp} max={stoicTrack.nextLevelXp} label="Rumo ao nível 2" tone="blue" />
        </div>
      </section>

      <Card className="bg-gradient-to-br from-sky-400/15 to-violet-500/10">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-300/15 text-sky-200"><Compass className="h-7 w-7" /></div>
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Trilha disponível</p>
            <h2 className="mt-1 text-xl font-black">{stoicTrack.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{stoicTrack.description}</p>
          </div>
        </div>
        <PrimaryButton className="mt-5" onClick={onGoToTrack}>Começar trilha</PrimaryButton>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <ActionCard icon={Flag} title="Missão do dia" text="Passe 1 hora sem reclamar e anote uma situação fora do seu controle." onClick={onGoToMission} />
        <ActionCard icon={MessageCircle} title="Reflexão rápida" text="O que está sob seu controle hoje?" onClick={onGoToReflection} />
      </div>

      <WeeklyCard />
    </div>
  );
}

function ActionCard({ icon: Icon, title, text, onClick }: { icon: LucideIcon; title: string; text: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-[1.7rem] border border-white/10 bg-[#101B36]/85 p-4 text-left shadow-xl transition hover:bg-[#17254A] active:scale-[0.99]">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300/15 text-lime-200"><Icon className="h-6 w-6" /></div>
      <h3 className="font-black text-white">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-300">{text}</p>
    </button>
  );
}

function WeeklyCard() {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-black">Progresso semanal</h2>
          <p className="text-xs text-slate-400">Seg, Ter e Qua completos; Qui atual.</p>
        </div>
        <CalendarDays className="h-6 w-6 text-sky-200" />
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weeklyProgress.map((item) => (
          <div key={item.day} className={`rounded-2xl p-2 text-center text-[0.68rem] font-black ${item.status === "completed" ? "bg-lime-300 text-slate-950" : item.status === "current" ? "bg-sky-300 text-slate-950" : "bg-white/10 text-slate-500"}`}>{item.day}</div>
        ))}
      </div>
    </Card>
  );
}

function TrackScreen({ onBack, onStartLesson }: { onBack: () => void; onStartLesson: () => void }) {
  return (
    <div className="space-y-5">
      <Header title="Trilha Estoicismo" subtitle="Sua jornada de evolução" onBack={onBack} />
      <Card className="relative overflow-hidden">
        <div className="absolute left-1/2 top-10 h-[78%] w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-lime-300 via-sky-300 to-white/10" />
        <div className="relative space-y-4">
          {stoicTrack.lessons.map((lesson, index) => <JourneyNode key={lesson.id} lesson={lesson} index={index} />)}
        </div>
      </Card>
      <Card className="bg-gradient-to-br from-lime-300/15 to-sky-400/10">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">Próxima lição: Emoções</p>
        <h2 className="mt-2 text-xl font-black">Aprenda a transformar reações em escolhas conscientes.</h2>
        <PrimaryButton className="mt-5" onClick={onStartLesson}>Começar lição</PrimaryButton>
      </Card>
    </div>
  );
}

function LessonScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="space-y-5">
      <Header title="Fundamentos" subtitle="Os pilares do estoicismo" onBack={onBack} />
      <Card>
        <ProgressBar value={1} max={4} label="Lição 1 de 4" tone="purple" />
      </Card>
      <div className="grid gap-4">
        {foundations.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-300/15 text-violet-200"><Icon className="h-6 w-6" /></div>
                <div><h3 className="font-black">{item.title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-300">{item.description}</p></div>
              </div>
            </Card>
          );
        })}
      </div>
      <Card className="bg-[#17254A]/80">
        <h2 className="font-black">Tradução para hoje</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <ModernExample title="Lidar com críticas" text="Escolha aprender, não apenas se defender." />
          <ModernExample title="Redes sociais" text="Use com consciência, não por validação." />
          <ModernExample title="Imprevistos" text="Mude o plano, não perca a calma." />
        </div>
        <PrimaryButton className="mt-5" onClick={onNext}>Próximo</PrimaryButton>
      </Card>
    </div>
  );
}

function ModernExample({ title, text }: { title: string; text: string }) {
  return <p><span className="font-black text-white">{title}: </span>{text}</p>;
}

function ExerciseScreen({ onBack, onAnswer }: { onBack: () => void; onAnswer: () => void }) {
  return (
    <div className="space-y-5">
      <Header title="Exercício prático" subtitle="Leve o estoicismo para o dia a dia" onBack={onBack} />
      <Card className="bg-gradient-to-br from-[#101B36] to-[#17254A]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">Situação</p>
        <h2 className="mt-2 text-xl font-black leading-tight">Você foi ignorado no WhatsApp e começou a imaginar o pior.</h2>
        <p className="mt-4 text-sm font-semibold text-slate-300">Qual seria a resposta mais alinhada ao estoicismo?</p>
      </Card>
      <div className="space-y-3">
        <QuizOption label="1" correct text="Lembrar que a resposta da outra pessoa não está sob seu controle e voltar ao que depende de você." />
        <QuizOption label="2" text="Insistir para entender o motivo e tentar fazer a outra pessoa responder." />
        <QuizOption label="3" text="Assumir que fez algo errado e se culpar por isso." />
      </div>
      <Card>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">O fundamento usado</p>
        <h3 className="mt-2 font-black">Dicotomia do controle</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">Foque no que depende de você e aceite com serenidade o que não está sob seu controle.</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Reward label="+25 XP" />
          <Reward label="Bônus: +10 XP" />
        </div>
        <PrimaryButton className="mt-5" onClick={onAnswer}>Responder</PrimaryButton>
      </Card>
    </div>
  );
}

function Reward({ label }: { label: string }) {
  return <div className="rounded-2xl bg-yellow-300/15 px-3 py-3 text-center text-sm font-black text-yellow-100 ring-1 ring-yellow-300/20">{label}</div>;
}

function QuizScreen({ selected, onSelect, onBack, onContinue }: { selected: string | null; onSelect: (id: string) => void; onBack: () => void; onContinue: () => void }) {
  const options = [
    ["A", "Responder na mesma hora para se defender"],
    ["B", "Pausar, avaliar se há algo útil e agir com calma"],
    ["C", "Guardar raiva e evitar a pessoa"],
    ["D", "Publicar uma indireta nas redes"],
  ];
  return (
    <div className="space-y-5">
      <Header title="Pergunta rápida" subtitle="Escolha a melhor resposta" onBack={onBack} />
      <Card><h2 className="text-xl font-black leading-tight">Qual atitude é mais estoica diante de uma crítica injusta?</h2></Card>
      <div className="space-y-3">{options.map(([id, text]) => <QuizOption key={id} label={id} text={text} selected={selected === id} correct={selected === "B" && id === "B"} onClick={() => onSelect(id)} />)}</div>
      {selected === "B" ? (
        <Card className="bg-lime-300/15">
          <div className="flex items-center gap-3 text-lime-100"><CheckCircle2 className="h-7 w-7" /><div><h3 className="text-lg font-black">Correta!</h3><p className="font-black text-yellow-100">+15 XP</p></div></div>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">Estoicismo ensina a reagir com razão, não por impulso.</p>
          <PrimaryButton className="mt-5" onClick={onContinue}>Continuar</PrimaryButton>
        </Card>
      ) : selected ? <Card><p className="text-sm text-slate-300">Boa tentativa. Procure a resposta que pausa o impulso antes de agir.</p></Card> : null}
    </div>
  );
}

function ReflectionScreen({ selectedMood, setSelectedMood, reflection, setReflection, onBack, onSave }: { selectedMood: string; setSelectedMood: (mood: string) => void; reflection: string; setReflection: (value: string) => void; onBack: () => void; onSave: () => void }) {
  return (
    <div className="space-y-5">
      <Header title="Reflexão" subtitle="Escreva antes de reagir" onBack={onBack} />
      <Card>
        <label className="text-lg font-black" htmlFor="reflection">O que está sob seu controle hoje?</label>
        <textarea id="reflection" value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Exemplo: Posso controlar minhas escolhas, minha resposta e onde coloco minha atenção..." className="mt-4 min-h-36 w-full resize-none rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-relaxed text-white outline-none placeholder:text-slate-500 focus:border-sky-300/50" />
      </Card>
      <Card>
        <h3 className="font-black">Checklist</h3>
        <div className="mt-3 space-y-3">{["Observar a emoção", "Respirar por 2 minutos", "Agir com clareza"].map((item) => <label key={item} className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" className="h-5 w-5 accent-lime-400" />{item}</label>)}</div>
        <h3 className="mt-5 font-black">Como você está se sentindo agora?</h3>
        <div className="mt-3 grid grid-cols-3 gap-2">{["Calmo", "Neutro", "Agitado"].map((mood) => <button key={mood} onClick={() => setSelectedMood(mood)} className={`rounded-2xl px-3 py-3 text-sm font-black ${selectedMood === mood ? "bg-sky-300 text-slate-950" : "bg-white/10 text-slate-300"}`}>{mood}</button>)}</div>
        <PrimaryButton className="mt-5" onClick={onSave}>Salvar reflexão</PrimaryButton>
      </Card>
      <Card className="bg-gradient-to-br from-violet-400/15 to-sky-400/10"><h3 className="font-black">Prática diária fortalece a mente.</h3><p className="mt-2 text-sm leading-relaxed text-slate-300">Cada reflexão é um treino para uma vida mais equilibrada.</p></Card>
    </div>
  );
}

function MissionScreen() {
  return (
    <div className="space-y-5">
      <Header title="Missão do dia" subtitle="Treine sua resposta ao que não controla" />
      <Card className="bg-gradient-to-br from-lime-300/15 to-sky-400/10">
        <Flag className="h-10 w-10 text-lime-200" />
        <h2 className="mt-4 text-2xl font-black leading-tight">Passe 1 hora sem reclamar e anote 1 situação fora do seu controle.</h2>
        <div className="mt-5 space-y-3">{["Perceber a vontade de reclamar", "Pausar e respirar", "Nomear o que não controla", "Escolher sua próxima ação"].map((step, index) => <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-sm font-semibold text-slate-200"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-300 text-xs font-black text-slate-950">{index + 1}</span>{step}</div>)}</div>
      </Card>
      <div className="grid grid-cols-3 gap-3">
        <MiniMetric icon={Clock} label="Tempo" value="60:00" />
        <MiniMetric icon={BarChart3} label="Progresso" value="0%" />
        <MiniMetric icon={Star} label="Recompensa" value="+25 XP" />
      </div>
      <PrimaryButton>Começar agora</PrimaryButton>
    </div>
  );
}

function MiniMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="rounded-3xl border border-white/10 bg-[#101B36] p-3 text-center"><Icon className="mx-auto h-5 w-5 text-sky-200" /><p className="mt-2 text-[0.65rem] font-bold text-slate-500">{label}</p><p className="text-sm font-black">{value}</p></div>;
}

function ProgressScreen() {
  return (
    <div className="space-y-5">
      <Header title="Seu progresso" subtitle="Veja sua evolução na prática." />
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="XP total" value="320 XP" icon={Star} tone="yellow" />
        <StatCard label="Geral" value="64%" icon={BarChart3} tone="blue" />
        <StatCard label="Sequência" value="7 dias" icon={Flame} tone="green" />
      </div>
      <Card><ProgressBar value={64} label="Progresso geral" tone="green" /></Card>
      <Card>
        <h2 className="font-black">Conquistas recentes</h2>
        <div className="mt-4 space-y-3">{achievements.map((achievement) => { const Icon = achievement.icon; return <div key={achievement.title} className="flex gap-3 rounded-2xl bg-white/10 p-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-300/15 text-yellow-100"><Icon className="h-5 w-5" /></div><div><h3 className="font-black">{achievement.title}</h3><p className="text-xs text-slate-400">{achievement.description}</p></div></div>; })}</div>
      </Card>
      <WeeklyCard />
      <Card className="bg-violet-300/10"><p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">Próxima recomendação</p><h2 className="mt-2 font-black">Lição 3: Adversidade</h2><p className="mt-2 text-sm text-slate-300">A prática de transformar obstáculos em oportunidades de crescimento.</p></Card>
      <div className="grid grid-cols-3 gap-3"><StatCard label="Lições concluídas" value="08" icon={BookOpen} /><StatCard label="Reflexões feitas" value="12" icon={Brain} tone="purple" /><StatCard label="Missões cumpridas" value="05" icon={Trophy} tone="green" /></div>
    </div>
  );
}

function LibraryScreen({ onOpenTrack }: { onOpenTrack: () => void }) {
  return (
    <div className="space-y-5">
      <Header title="Conteúdos" subtitle="Aprenda em poucos minutos por dia." />
      <div className="grid gap-4">{libraryItems.map((item) => { const Icon = item.icon; return <button key={item.title} onClick={item.unlocked ? onOpenTrack : undefined} className={`rounded-[1.7rem] border p-4 text-left transition ${item.unlocked ? "border-lime-300/30 bg-lime-300/10" : "border-white/10 bg-[#101B36]/70 opacity-75"}`}><div className="flex gap-4"><div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.unlocked ? "bg-lime-300 text-slate-950" : "bg-white/10 text-slate-400"}`}>{item.unlocked ? <Icon className="h-6 w-6" /> : <Lock className="h-6 w-6" />}</div><div><div className="flex items-center gap-2"><h2 className="font-black">{item.title}</h2><span className="rounded-full bg-white/10 px-2 py-1 text-[0.6rem] font-black uppercase text-slate-300">{item.status}</span></div><p className="mt-1 text-sm text-slate-400">{item.description}</p></div></div></button>; })}</div>
      <EthicalNotice />
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="space-y-5">
      <Header title="Perfil" />
      <Card className="bg-gradient-to-br from-[#17254A] to-[#101B36]">
        <div className="flex items-center gap-4"><div className="flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-[#58CC02] to-[#8B5CF6] text-slate-950"><User className="h-10 w-10" /></div><div><p className="text-sm text-slate-400">Usuário</p><h2 className="text-2xl font-black">Membro SR</h2><p className="mt-1 text-sm font-semibold text-sky-200">Trilha atual: Estoicismo Prático</p></div></div>
      </Card>
      <div className="grid grid-cols-3 gap-3"><StatCard label="Nível" value="1" icon={Award} tone="purple" /><StatCard label="XP" value="320" icon={Star} tone="yellow" /><StatCard label="Sequência" value="7 dias" icon={Flame} tone="green" /></div>
      <ProfileInfo title="Objetivo atual" text="Ter mais controle emocional e consistência." />
      <ProfileInfo title="Preferência de rotina" text="Missões curtas e práticas." />
      <EthicalNotice />
      <PrimaryButton variant="secondary">Editar perfil</PrimaryButton>
    </div>
  );
}

function ProfileInfo({ title, text }: { title: string; text: string }) {
  return <Card><p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{title}</p><p className="mt-2 text-sm font-semibold text-slate-200">{text}</p></Card>;
}

function EthicalNotice() {
  return (
    <Card className="border-sky-200/15 bg-sky-300/10">
      <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-200" /><p className="text-xs font-medium leading-relaxed text-slate-300">{ethicalNotice}</p></div>
    </Card>
  );
}
