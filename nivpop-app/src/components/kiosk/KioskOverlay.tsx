"use client";
import { useEffect, useRef, useState } from "react";
import type { FlavorId, KioskScreen } from "@/lib/types";
import { useKiosk } from "@/hooks/useKiosk";
import { getKiosko } from "@/lib/storage";
import WelcomeScreen      from "./screens/WelcomeScreen";
import ModeScreen         from "./screens/ModeScreen";
import NameScreen         from "./screens/NameScreen";
import DuoNamesScreen     from "./screens/DuoNamesScreen";
import QuizScreen         from "./screens/QuizScreen";
import DuoQuizScreen      from "./screens/DuoQuizScreen";
import LoadingScreen      from "./screens/LoadingScreen";
import ResultScreen       from "./screens/ResultScreen";
import DuoResultScreen    from "./screens/DuoResultScreen";
import TicketScreen       from "./screens/TicketScreen";
import ShareScreen        from "./screens/ShareScreen";
import CatalogScreen      from "./screens/CatalogScreen";
import CatalogDetailScreen from "./screens/CatalogDetailScreen";
import PauseScreen        from "./screens/PauseScreen";

const IDLE_MS = 45_000;

// Ordered for direction detection (deeper = higher index)
const SCREEN_ORDER: KioskScreen[] = [
  "welcome","mode","name-p","name-t","name-surprise","duo-names",
  "quiz","duo-quiz","loading","duo-loading",
  "result","duo-result","ticket","duo-ticket","share",
  "catalog","catalog-detail",
];

export default function KioskOverlay() {
  const {
    state, dispatch,
    go, startSolo, startDuo, startSurprise,
    answerSolo, answerDuo,
    finishSolo, finishDuo,
    showShare, showTicket, reset,
    questions,
  } = useKiosk();

  const { screen } = state;
  const [catalogFlavorId, setCatalogFlavorId] = useState<FlavorId>("fresa");
  const [paused,    setPaused]   = useState(false);
  const [slideDir,  setSlideDir] = useState<"forward" | "back">("forward");
  const prevScreen = useRef<KioskScreen>("welcome");

  // Screen transition direction
  useEffect(() => {
    const pi = SCREEN_ORDER.indexOf(prevScreen.current);
    const ci = SCREEN_ORDER.indexOf(screen);
    setSlideDir(ci >= pi ? "forward" : "back");
    prevScreen.current = screen;
  }, [screen]);

  // Pause detection (storage event from admin in another tab)
  useEffect(() => {
    const check = () => setPaused(!!getKiosko().pausado);
    check();
    function onStorage(e: StorageEvent) {
      if (e.key === "nivpop_kiosko") setPaused(!!(e.newValue ? JSON.parse(e.newValue) : {}).pausado);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Idle timer — resets to welcome after IDLE_MS
  useEffect(() => {
    if (screen === "welcome" || paused) return;
    let timer: ReturnType<typeof setTimeout>;
    const resetTimer = () => { clearTimeout(timer); timer = setTimeout(reset, IDLE_MS); };
    const events = ["click","keydown","touchstart","mousemove","scroll"] as const;
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();
    return () => { clearTimeout(timer); events.forEach((e) => window.removeEventListener(e, resetTimer)); };
  }, [screen, paused, reset]);

  if (paused) {
    return <div className="fixed inset-0 bg-ink overflow-hidden"><PauseScreen /></div>;
  }

  function renderScreen() {
    switch (screen) {
      case "welcome":
        return <WelcomeScreen onStart={() => go("mode")} onCatalog={() => go("catalog")} onSurprise={() => go("name-surprise")} />;
      case "mode":
        return <ModeScreen onSolo={(m) => go(m === "p" ? "name-p" : "name-t")} onDuo={() => go("duo-names")} onBack={() => go("welcome")} />;
      case "name-p":
        return <NameScreen mode="p" onSubmit={(n) => startSolo("p", n)} onBack={() => go("mode")} />;
      case "name-t":
        return <NameScreen mode="t" onSubmit={(n) => startSolo("t", n)} onBack={() => go("mode")} />;
      case "name-surprise":
        return <NameScreen mode="p" headline="¿Cuál es tu nombre?" hint="Te asignamos un sabor sorpresa ✨" onSubmit={startSurprise} onBack={() => go("welcome")} />;
      case "duo-names":
        return <DuoNamesScreen onSubmit={startDuo} onBack={() => go("mode")} />;
      case "quiz":
        return <QuizScreen state={state} questions={questions} onAnswer={answerSolo} onBack={() => dispatch({ type: "POP_HIST_SOLO" })} />;
      case "duo-quiz":
        return <DuoQuizScreen state={state} onAnswer={answerDuo} onBack={() => dispatch({ type: "POP_HIST_DUO" })} />;
      case "loading":
        return <LoadingScreen flavorId={state.rKey} onFinish={finishSolo} />;
      case "duo-loading":
        return <LoadingScreen flavorId={state.dRKey} duo onFinish={finishDuo} />;
      case "result":
        return <ResultScreen state={state} onTicket={() => showTicket("solo")} onShare={() => showShare("solo")} onReset={reset} />;
      case "duo-result":
        return <DuoResultScreen state={state} onTicket={() => showTicket("duo")} onShare={() => showShare("duo")} onReset={reset} />;
      case "ticket":
        return <TicketScreen state={state} onReset={reset} />;
      case "duo-ticket":
        return <TicketScreen state={state} duo onReset={reset} />;
      case "share":
        return <ShareScreen state={state} onBack={() => go(state.shareMode === "duo" ? "duo-result" : "result")} onReset={reset} />;
      case "catalog":
        return <CatalogScreen onSelect={(id) => { setCatalogFlavorId(id); go("catalog-detail"); }} onBack={() => go("welcome")} />;
      case "catalog-detail":
        return <CatalogDetailScreen flavorId={catalogFlavorId} onBack={() => go("catalog")} onStartQuiz={() => go("mode")} />;
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-ink overflow-hidden">
      {/* Screen with directional slide */}
      <div
        key={screen}
        className={`h-full overflow-y-auto ${
          slideDir === "forward" ? "animate-slide-forward" : "animate-slide-back"
        }`}
      >
        {renderScreen()}
      </div>

      {/* Idle countdown bar */}
      {screen !== "welcome" && (
        <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-transparent pointer-events-none z-50 overflow-hidden">
          <div
            key={`${screen}-cd`}
            className="h-full bg-paper/20 origin-left animate-countdown"
          />
        </div>
      )}
    </div>
  );
}
