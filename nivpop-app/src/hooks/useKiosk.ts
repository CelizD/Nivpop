"use client";

import { useReducer, useCallback } from "react";
import type { KioskState, KioskAction, FlavorId, VinculoId, QuizQuestion } from "@/types";
import { mkScores, calcResult, calcCompat, genFolio, applyAnswer, buildDuoQuestions } from "@/utils/quiz";
import { FLAVORS } from "@/utils/flavors";
import { QP, QT } from "@/utils/questions";
import {
  saveResultWithScores, getActiveFlavors, addStamp,
  getQOverrides, applyQOverrides, findByName,
} from "@/services/storage";

const ALL_IDS = Object.keys(FLAVORS) as FlavorId[];

function getActiveIds(): FlavorId[] {
  if (typeof window === "undefined") return ALL_IDS;
  return getActiveFlavors() ?? ALL_IDS;
}

function initialState(): KioskState {
  const ids = ALL_IDS;
  return {
    screen: "welcome",
    cName: "", scores: mkScores(ids), curQ: 0, hist: [],
    rKey: "fresa" as FlavorId, testMode: "p", quickMode: false, prevFlavorId: undefined,
    dN1: "", dN2: "", dVin: "", dScores: mkScores(ids), dScores1: mkScores(ids), dScores2: mkScores(ids),
    dCurQ: 0, dHist: [], dRKey: "fresa" as FlavorId, dQuestions: [],
    lastCompat: 0, folio: "", shareMode: "solo",
  };
}

function reducer(state: KioskState, action: KioskAction): KioskState {
  switch (action.type) {
    case "GO":              return { ...state, screen: action.screen };
    case "SET_MODE":        return { ...state, testMode: action.testMode };
    case "SET_QUICK_MODE":  return { ...state, quickMode: action.quickMode };
    case "SET_PREV_FLAVOR": return { ...state, prevFlavorId: action.prevFlavorId };
    case "SET_NAME":        return { ...state, cName: action.name };
    case "SET_DUO_NAMES":   return { ...state, dN1: action.dN1, dN2: action.dN2 };
    case "SET_VIN":         return { ...state, dVin: action.dVin };
    case "ANSWER_SOLO":     return { ...state, scores: action.scores, curQ: action.curQ };
    case "PUSH_HIST_SOLO":  return { ...state, hist: [...state.hist, action.entry] };
    case "POP_HIST_SOLO": {
      const hist = [...state.hist];
      const prev = hist.pop();
      if (!prev) return state;
      return { ...state, hist, scores: prev.scores, curQ: prev.q };
    }
    case "ANSWER_DUO":    return { ...state, dScores: action.dScores, dScores1: action.dScores1, dScores2: action.dScores2, dCurQ: action.dCurQ };
    case "PUSH_HIST_DUO": return { ...state, dHist: [...state.dHist, action.entry] };
    case "POP_HIST_DUO":  {
      const dHist = [...state.dHist];
      const prev = dHist.pop();
      if (!prev) return state;
      return { ...state, dHist, dScores: prev.scores, dScores1: prev.s1, dScores2: prev.s2, dCurQ: prev.q };
    }
    case "SET_RESULT":     return { ...state, rKey: action.rKey };
    case "SET_DUO_RESULT": return { ...state, dRKey: action.dRKey, dQuestions: action.dQuestions };
    case "SET_COMPAT":     return { ...state, lastCompat: action.lastCompat };
    case "SET_FOLIO":      return { ...state, folio: action.folio };
    case "SET_SHARE_MODE": return { ...state, shareMode: action.shareMode };
    case "RESET_SOLO": {
      const ids = getActiveIds();
      return { ...state, cName: "", scores: mkScores(ids), curQ: 0, hist: [], rKey: "fresa" as FlavorId, quickMode: false, prevFlavorId: undefined };
    }
    case "RESET_DUO": {
      const ids = getActiveIds();
      return { ...state, dN1: "", dN2: "", dVin: "", dScores: mkScores(ids), dScores1: mkScores(ids), dScores2: mkScores(ids), dCurQ: 0, dHist: [], dRKey: "fresa" as FlavorId, dQuestions: [] };
    }
    case "RESET_ALL": return initialState();
    default: return state;
  }
}

export function useKiosk() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const go = useCallback((screen: KioskState["screen"]) => dispatch({ type: "GO", screen }), []);

  const startSolo = useCallback((mode: "p" | "t", name: string) => {
    const ids = getActiveIds();
    dispatch({ type: "SET_MODE", testMode: mode });
    dispatch({ type: "SET_NAME", name });
    dispatch({ type: "ANSWER_SOLO", scores: mkScores(ids), curQ: 0 });
    dispatch({ type: "PUSH_HIST_SOLO", entry: { q: 0, scores: mkScores(ids) } });
    go("quiz");
  }, [go]);

  const startDuo = useCallback((dN1: string, dN2: string, dVin: VinculoId) => {
    const ids = getActiveIds();
    const questions = buildDuoQuestions();
    dispatch({ type: "SET_DUO_NAMES", dN1, dN2 });
    dispatch({ type: "SET_VIN", dVin });
    dispatch({ type: "SET_DUO_RESULT", dRKey: "fresa" as FlavorId, dQuestions: questions });
    dispatch({ type: "ANSWER_DUO", dScores: mkScores(ids), dScores1: mkScores(ids), dScores2: mkScores(ids), dCurQ: 0 });
    go("duo-quiz");
  }, [go]);

  const answerSolo = useCallback((state: KioskState, optionIdx: number, questions: QuizQuestion[]) => {
    const q = questions[state.curQ];
    const opt = q.o[optionIdx];
    dispatch({ type: "PUSH_HIST_SOLO", entry: { q: state.curQ, scores: { ...state.scores } } });
    const newScores = applyAnswer(state.scores, opt);
    const nextQ = state.curQ + 1;
    if (nextQ >= questions.length) {
      dispatch({ type: "ANSWER_SOLO", scores: newScores, curQ: nextQ });
      const rKey = calcResult(newScores);
      dispatch({ type: "SET_RESULT", rKey });
      go("loading");
    } else {
      dispatch({ type: "ANSWER_SOLO", scores: newScores, curQ: nextQ });
    }
  }, [go]);

  const answerDuo = useCallback((state: KioskState, optionIdx: number) => {
    const q = state.dQuestions[state.dCurQ];
    const opt = q.o[optionIdx];
    dispatch({ type: "PUSH_HIST_DUO", entry: { q: state.dCurQ, scores: { ...state.dScores }, s1: { ...state.dScores1 }, s2: { ...state.dScores2 } } });
    const newScores = applyAnswer(state.dScores, opt);
    const even = state.dCurQ % 2 === 0;
    const newS1 = even ? applyAnswer(state.dScores1, opt) : { ...state.dScores1 };
    const newS2 = !even ? applyAnswer(state.dScores2, opt) : { ...state.dScores2 };
    const nextQ = state.dCurQ + 1;
    if (nextQ >= state.dQuestions.length) {
      dispatch({ type: "ANSWER_DUO", dScores: newScores, dScores1: newS1, dScores2: newS2, dCurQ: nextQ });
      const dRKey = calcResult(newScores);
      const compat = calcCompat(newS1, newS2);
      dispatch({ type: "SET_DUO_RESULT", dRKey, dQuestions: state.dQuestions });
      dispatch({ type: "SET_COMPAT", lastCompat: compat });
      go("duo-loading");
    } else {
      dispatch({ type: "ANSWER_DUO", dScores: newScores, dScores1: newS1, dScores2: newS2, dCurQ: nextQ });
    }
  }, [go]);

  const finishSolo = useCallback((state: KioskState) => {
    // Check for previous result with same name BEFORE saving
    const prevResults = findByName(state.cName).filter((r) => r.modo !== "duo");
    const prevFlavor  = prevResults[0]?.flavorId;
    if (prevFlavor && prevFlavor !== state.rKey) {
      dispatch({ type: "SET_PREV_FLAVOR", prevFlavorId: prevFlavor as FlavorId });
    }

    const f = FLAVORS[state.rKey];
    const folio = genFolio();
    dispatch({ type: "SET_FOLIO", folio });
    addStamp();
    saveResultWithScores(
      { folio, modo: state.testMode === "p" ? "solo" : "estado", flavorId: state.rKey, sabor: f.name, flavorColor: state.rKey, nombre1: state.cName },
      state.scores,
    );
    go("reveal");
  }, [go]);

  const finishDuo = useCallback((state: KioskState) => {
    const f = FLAVORS[state.dRKey];
    const folio = genFolio();
    dispatch({ type: "SET_FOLIO", folio });
    addStamp();
    saveResultWithScores(
      { folio, modo: "duo", flavorId: state.dRKey, sabor: f.name, flavorColor: state.dRKey, nombre1: state.dN1, nombre2: state.dN2, compat: state.lastCompat },
      undefined, state.dScores1, state.dScores2,
    );
    go("duo-reveal");
  }, [go]);

  const startSurprise = useCallback((name: string) => {
    const ids = getActiveIds();
    const rKey = ids[Math.floor(Math.random() * ids.length)] as FlavorId;
    dispatch({ type: "SET_MODE", testMode: "p" });
    dispatch({ type: "SET_QUICK_MODE", quickMode: false });
    dispatch({ type: "SET_NAME", name });
    dispatch({ type: "SET_RESULT", rKey });
    go("loading");
  }, [go]);

  const showShare = useCallback((mode: "solo" | "duo") => {
    dispatch({ type: "SET_SHARE_MODE", shareMode: mode });
    go("share");
  }, [go]);

  const showTicket = useCallback(() => {
    go(state.shareMode === "duo" ? "duo-ticket" : "ticket");
  }, [go, state.shareMode]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET_ALL" });
    go("welcome");
  }, [go]);

  // Apply custom question overrides; limit to 5 questions in quick mode
  const ov = typeof window !== "undefined" ? getQOverrides() : {};
  const baseQs = state.testMode === "p" ? QP : QT;
  const limitedQs = state.quickMode ? baseQs.slice(0, 5) : baseQs;
  const questions = applyQOverrides(limitedQs, state.testMode === "p" ? ov.p : ov.t);

  return {
    state, dispatch, go,
    startSolo, startDuo, startSurprise,
    answerSolo: (idx: number) => answerSolo(state, idx, questions),
    answerDuo:  (idx: number) => answerDuo(state, idx),
    finishSolo: () => finishSolo(state),
    finishDuo:  () => finishDuo(state),
    showShare, showTicket, reset, questions,
  };
}
