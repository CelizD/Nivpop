export type FlavorId =
  | "fresa" | "vainilla" | "menta" | "choco" | "mango" | "lavanda"
  | "matcha" | "miel" | "higo" | "caramelo" | "yuzu" | "earl"
  | "chai" | "platano" | "vino" | "carda";

export type FlavorScores = Partial<Record<FlavorId, number>>;

export interface FlavorBase {
  rec: string; recD: string;
  alt: string; altD: string;
}

export interface FlavorAllergens {
  lacteos: boolean; gluten: boolean; huevo: boolean;
  frutosSecs: boolean; soja: boolean; sulfitos: boolean;
}

export interface Flavor {
  cls: string; c: string; c2: string;
  name: string; persona: string; desc: string;
  ins: { tag: string; text: string; hl: string };
  psych: string;
  traits: Array<{ l: string; v: string }>;
  tips: Array<{ t: string }>;
  base: FlavorBase;
  allergens: FlavorAllergens;
  allergenNotes: Partial<Record<keyof FlavorAllergens, string>>;
  baseType: "agua" | "leche" | "ambas";
  maridaje: string[];
}

export interface QuizOption {
  t: string;
  s: FlavorScores;
}

export interface QuizQuestion {
  q: string;
  o: QuizOption[];
}

export type VinculoId = "pareja" | "amigos" | "hermanos" | "familia" | "colegas" | "otro";

export interface Vinculo {
  icon: string; label: string;
}

export type KioskScreen =
  | "welcome" | "mode"
  | "name-p" | "name-t" | "duo-names"
  | "quiz" | "duo-quiz"
  | "loading" | "duo-loading"
  | "result" | "duo-result"
  | "ticket" | "duo-ticket"
  | "share";

export interface KioskState {
  screen: KioskScreen;
  // solo
  cName: string;
  scores: FlavorScores;
  curQ: number;
  hist: Array<{ q: number; scores: FlavorScores }>;
  rKey: FlavorId;
  testMode: "p" | "t";
  // duo
  dN1: string; dN2: string; dVin: VinculoId | "";
  dScores: FlavorScores; dScores1: FlavorScores; dScores2: FlavorScores;
  dCurQ: number;
  dHist: Array<{ q: number; scores: FlavorScores; s1: FlavorScores; s2: FlavorScores }>;
  dRKey: FlavorId;
  dQuestions: QuizQuestion[];
  lastCompat: number;
  folio: string;
  shareMode: "solo" | "duo";
}

export type KioskAction =
  | { type: "GO"; screen: KioskScreen }
  | { type: "SET_MODE"; testMode: "p" | "t" }
  | { type: "SET_NAME"; name: string }
  | { type: "SET_DUO_NAMES"; dN1: string; dN2: string }
  | { type: "SET_VIN"; dVin: VinculoId }
  | { type: "ANSWER_SOLO"; scores: FlavorScores; curQ: number }
  | { type: "PUSH_HIST_SOLO"; entry: KioskState["hist"][0] }
  | { type: "POP_HIST_SOLO" }
  | { type: "ANSWER_DUO"; dScores: FlavorScores; dScores1: FlavorScores; dScores2: FlavorScores; dCurQ: number }
  | { type: "PUSH_HIST_DUO"; entry: KioskState["dHist"][0] }
  | { type: "POP_HIST_DUO" }
  | { type: "SET_RESULT"; rKey: FlavorId }
  | { type: "SET_DUO_RESULT"; dRKey: FlavorId; dQuestions: QuizQuestion[] }
  | { type: "SET_COMPAT"; lastCompat: number }
  | { type: "SET_FOLIO"; folio: string }
  | { type: "SET_SHARE_MODE"; shareMode: "solo" | "duo" }
  | { type: "RESET_SOLO" }
  | { type: "RESET_DUO" }
  | { type: "RESET_ALL" };

export interface NivResult {
  id: string;
  fecha: string;
  hora: number;
  min: number;
  timeStr: string;
  modo: "solo" | "estado" | "duo";
  flavorId: FlavorId;
  sabor: string;
  flavorColor: string;
  nombre1: string;
  nombre2?: string;
  compat?: number;
}
