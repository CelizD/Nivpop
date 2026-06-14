"use client";
import { useKiosk } from "@/hooks/useKiosk";
import WelcomeScreen   from "./screens/WelcomeScreen";
import ModeScreen      from "./screens/ModeScreen";
import NameScreen      from "./screens/NameScreen";
import DuoNamesScreen  from "./screens/DuoNamesScreen";
import QuizScreen      from "./screens/QuizScreen";
import DuoQuizScreen   from "./screens/DuoQuizScreen";
import LoadingScreen   from "./screens/LoadingScreen";
import ResultScreen    from "./screens/ResultScreen";
import DuoResultScreen from "./screens/DuoResultScreen";
import TicketScreen    from "./screens/TicketScreen";

export default function KioskOverlay() {
  const {
    state, dispatch,
    go, startSolo, startDuo,
    answerSolo, answerDuo,
    finishSolo, finishDuo,
    showTicket, reset,
    questions,
  } = useKiosk();

  const { screen } = state;

  function renderScreen() {
    switch (screen) {
      case "welcome":
        return <WelcomeScreen onStart={() => go("mode")} />;

      case "mode":
        return (
          <ModeScreen
            onSolo={(mode) => {
              go(mode === "p" ? "name-p" : "name-t");
            }}
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
        return (
          <LoadingScreen
            flavorId={state.rKey}
            onFinish={finishSolo}
          />
        );

      case "duo-loading":
        return (
          <LoadingScreen
            flavorId={state.dRKey}
            duo
            onFinish={finishDuo}
          />
        );

      case "result":
        return (
          <ResultScreen
            state={state}
            onTicket={() => showTicket("solo")}
            onReset={reset}
          />
        );

      case "duo-result":
        return (
          <DuoResultScreen
            state={state}
            onTicket={() => showTicket("duo")}
            onReset={reset}
          />
        );

      case "ticket":
        return <TicketScreen state={state} onReset={reset} />;

      case "duo-ticket":
        return <TicketScreen state={state} duo onReset={reset} />;

      case "share":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
            <p className="font-display text-3xl italic text-paper/70 mb-8">Compartir</p>
            <p className="font-sans text-sm text-muted mb-12">Próximamente — carta de presentación digital</p>
            <button onClick={reset} className="font-sans text-xs tracking-widest uppercase text-paper/50 border border-paper/15 px-10 py-4 hover:border-paper/30 transition-all">
              NUEVA VISITA
            </button>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-ink overflow-hidden">
      <div
        key={screen}
        className="h-full overflow-y-auto animate-fade-in"
      >
        {renderScreen()}
      </div>
    </div>
  );
}
