"use client";
import { useEffect, useState } from "react";
import type { FlavorId } from "@/lib/types";
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
  const [paused, setPaused] = useState(false);

  // Pause detection — listen for changes from admin in another tab
  useEffect(() => {
    const check = () => setPaused(!!getKiosko().pausado);
    check();
    function onStorage(e: StorageEvent) {
      if (e.key === "nivpop_kiosko") {
        const v = e.newValue ? JSON.parse(e.newValue) : {};
        setPaused(!!v.pausado);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Idle timer
  useEffect(() => {
    if (screen === "welcome" || paused) return;
    let timer: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(reset, IDLE_MS);
    };
    const events = ["click", "keydown", "touchstart", "mousemove", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [screen, paused, reset]);

  if (paused) {
    return (
      <div className="fixed inset-0 bg-ink overflow-hidden">
        <PauseScreen />
      </div>
    );
  }

  function renderScreen() {
    switch (screen) {
      case "welcome":
        return (
          <WelcomeScreen
            onStart={() => go("mode")}
            onCatalog={() => go("catalog")}
            onSurprise={() => go("name-surprise")}
          />
        );

      case "mode":
        return (
          <ModeScreen
            onSolo={(mode) => go(mode === "p" ? "name-p" : "name-t")}
            onDuo={() => go("duo-names")}
            onBack={() => go("welcome")}
          />
        );

      case "name-p":
        return (
          <NameScreen
            mode="p"
            onSubmit={(name) => startSolo("p", name)}
            onBack={() => go("mode")}
          />
        );

      case "name-t":
        return (
          <NameScreen
            mode="t"
            onSubmit={(name) => startSolo("t", name)}
            onBack={() => go("mode")}
          />
        );

      case "name-surprise":
        return (
          <NameScreen
            mode="p"
            headline="¿Cuál es tu nombre?"
            hint="Te asignamos un sabor sorpresa ✨"
            onSubmit={(name) => startSurprise(name)}
            onBack={() => go("welcome")}
          />
        );

      case "duo-names":
        return (
          <DuoNamesScreen
            onSubmit={(n1, n2, vin) => startDuo(n1, n2, vin)}
            onBack={() => go("mode")}
          />
        );

      case "quiz":
        return (
          <QuizScreen
            state={state}
            questions={questions}
            onAnswer={answerSolo}
            onBack={() => dispatch({ type: "POP_HIST_SOLO" })}
          />
        );

      case "duo-quiz":
        return (
          <DuoQuizScreen
            state={state}
            onAnswer={answerDuo}
            onBack={() => dispatch({ type: "POP_HIST_DUO" })}
          />
        );

      case "loading":
        return <LoadingScreen flavorId={state.rKey} onFinish={finishSolo} />;

      case "duo-loading":
        return <LoadingScreen flavorId={state.dRKey} duo onFinish={finishDuo} />;

      case "result":
        return (
          <ResultScreen
            state={state}
            onTicket={() => showTicket("solo")}
            onShare={() => showShare("solo")}
            onReset={reset}
          />
        );

      case "duo-result":
        return (
          <DuoResultScreen
            state={state}
            onTicket={() => showTicket("duo")}
            onShare={() => showShare("duo")}
            onReset={reset}
          />
        );

      case "ticket":
        return <TicketScreen state={state} onReset={reset} />;

      case "duo-ticket":
        return <TicketScreen state={state} duo onReset={reset} />;

      case "share":
        return (
          <ShareScreen
            state={state}
            onBack={() => go(state.shareMode === "duo" ? "duo-result" : "result")}
            onReset={reset}
          />
        );

      case "catalog":
        return (
          <CatalogScreen
            onSelect={(id) => { setCatalogFlavorId(id); go("catalog-detail"); }}
            onBack={() => go("welcome")}
          />
        );

      case "catalog-detail":
        return (
          <CatalogDetailScreen
            flavorId={catalogFlavorId}
            onBack={() => go("catalog")}
            onStartQuiz={() => go("mode")}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-ink overflow-hidden">
      <div key={screen} className="h-full overflow-y-auto animate-fade-in">
        {renderScreen()}
      </div>
    </div>
  );
}
