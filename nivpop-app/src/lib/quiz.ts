import type { FlavorId, FlavorScores, QuizQuestion, QuizOption } from "./types";
import { AFFINITY } from "./flavors";

export function mkScores(activeIds: FlavorId[]): FlavorScores {
  return Object.fromEntries(activeIds.map((k) => [k, 0]));
}

export function applyAnswer(scores: FlavorScores, option: QuizOption): FlavorScores {
  const next = { ...scores };
  for (const [k, v] of Object.entries(option.s)) {
    if (k in next) next[k as FlavorId] = (next[k as FlavorId] ?? 0) + (v ?? 0);
  }
  return next;
}

export function calcResult(scores: FlavorScores): FlavorId {
  const entries = Object.entries(scores).filter(([, v]) => v > 0);
  const pool = entries.length ? entries : Object.entries(scores);
  return pool.sort((a, b) => b[1] - a[1])[0][0] as FlavorId;
}

export function calcTopFlavors(scores: FlavorScores, n = 3): FlavorId[] {
  const entries = Object.entries(scores).filter(([, v]) => v > 0);
  const pool = entries.length ? entries : Object.entries(scores);
  return pool.sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k as FlavorId);
}

export function calcCompat(s1: FlavorScores, s2: FlavorScores): number {
  const k1 = calcResult(s1);
  const k2 = calcResult(s2);
  const row = AFFINITY[k1];
  const base = row?.[k2] ?? 75;
  return Math.min(99, Math.max(40, base + Math.floor(Math.random() * 10) - 5));
}

export function genFolio(): string {
  const now = new Date();
  return (
    "NP-" +
    now.getFullYear().toString().slice(-2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    "-" +
    String(Math.floor(Math.random() * 9999)).padStart(4, "0")
  );
}

export function buildDuoQuestions(): QuizQuestion[] {
  return [
    {q:"¿Cómo suelen pasar su mejor tiempo juntos?",o:[{t:"Contándonos todo — horas de conversación",s:{fresa:3,vino:1}},{t:"En calma, sin necesidad de hacer nada especial",s:{vainilla:3,platano:1}},{t:"Explorando lugares o ideas nuevas",s:{menta:3,yuzu:1}},{t:"En conversaciones profundas que cambian algo",s:{choco:3,earl:1}},{t:"En planes espontáneos llenos de energía",s:{mango:3}},{t:"Creando o compartiendo arte y momentos estéticos",s:{lavanda:3,carda:1}},{t:"Cocinando, comiendo o en rituales compartidos",s:{chai:3,miel:1}},{t:"Recordando — el pasado compartido es parte de nosotros",s:{platano:3,higo:1}}]},
    {q:"Cuando hay un conflicto entre ustedes, generalmente...",o:[{t:"Lo hablamos enseguida, aunque sea difícil",s:{fresa:3,miel:1}},{t:"Esperamos a estar calmados antes de hablar",s:{vainilla:3,matcha:1}},{t:"Analizamos qué pasó y buscamos solución juntos",s:{menta:3,earl:1}},{t:"Necesitamos tiempo por separado para procesar",s:{choco:3,lavanda:1}},{t:"Lo superamos rápido — no nos quedamos en el conflicto",s:{mango:3,yuzu:1}},{t:"Lo expresamos de formas indirectas — gestos, silencios",s:{lavanda:3,carda:1}},{t:"Le damos espacio sin alejarnos del todo",s:{higo:3,vainilla:1}},{t:"Con humor — es nuestra forma de descomprimir",s:{mango:3,caramelo:1}}]},
    {q:"Lo que más une a los dos es...",o:[{t:"La intensidad de lo que sentimos uno por el otro",s:{fresa:3,vino:1}},{t:"La confianza y la estabilidad que nos damos",s:{vainilla:3,platano:1}},{t:"Las conversaciones que nos hacen crecer",s:{menta:3,earl:1}},{t:"La profundidad — nos conocemos de verdad",s:{choco:3}},{t:"La energía y el entusiasmo que compartimos",s:{mango:3,yuzu:1}},{t:"La sensibilidad — nos entendemos sin explicar",s:{lavanda:3,carda:1}},{t:"La calidez — siempre hay un lugar donde caer",s:{chai:3,miel:1}},{t:"La historia compartida y la memoria",s:{platano:3,higo:1}}]},
    {q:"Cuando uno de los dos está mal, el otro generalmente...",o:[{t:"Se acerca, abraza y está presente emocionalmente",s:{fresa:3,miel:1}},{t:"Da espacio pero se asegura que sepa que está ahí",s:{vainilla:3}},{t:"Trata de entender y ayuda a encontrar soluciones",s:{menta:3,earl:1}},{t:"Escucha profundo sin juzgar y acompaña en silencio",s:{choco:3,lavanda:1}},{t:"Busca distraer o animar con algo que lo saque del estado",s:{mango:3,yuzu:1}},{t:"Crea un ambiente de calma — música, detalle, presencia suave",s:{lavanda:3,carda:1}},{t:"Prepara algo de comer o un gesto concreto de cuidado",s:{chai:3,miel:1}},{t:"Cuenta historias o recuerdos compartidos para reconectar",s:{platano:3,higo:1}}]},
    {q:"¿Cómo es la comunicación entre ustedes principalmente?",o:[{t:"Muy emocional — nos decimos lo que sentimos",s:{fresa:3}},{t:"Tranquila y estable — rara vez hay drama innecesario",s:{vainilla:3,matcha:1}},{t:"Intelectual — hablamos mucho y de todo",s:{menta:3,earl:1}},{t:"Intensa y real — cuando hablamos, hablamos de verdad",s:{choco:3,vino:1}},{t:"Ligera y fluida — nos reímos mucho y todo fluye",s:{mango:3,yuzu:1}},{t:"Sutil — a veces no necesitamos palabras",s:{lavanda:3,carda:1}},{t:"Sabia — siempre hay algo que aprender del otro",s:{chai:3,higo:1}},{t:"Nostálgica — a menudo volvemos a recuerdos",s:{platano:3,fresa:1}}]},
    {q:"Si tuvieran que describir su energía juntos en una imagen, sería...",o:[{t:"Una hoguera — cálida, intensa, que atrae a todos",s:{fresa:3,vino:1}},{t:"Un lago tranquilo al atardecer — sereno y sin prisa",s:{vainilla:3,matcha:1}},{t:"Un café lleno de ideas — siempre algo interesante",s:{menta:3,earl:1}},{t:"El océano de noche — profundo, con mucho adentro",s:{choco:3}},{t:"Un día de playa con sol — alegre y sin preocupaciones",s:{mango:3,yuzu:1}},{t:"Un jardín en la madrugada — silencioso y lleno de detalles",s:{lavanda:3,carda:1}},{t:"Una mesa compartida — cálida, especiada, acogedora",s:{chai:3,miel:1}},{t:"Un álbum de fotos viejas — con historia y con peso",s:{platano:3,higo:1}}]},
    {q:"¿Cuál es su mayor reto como dúo?",o:[{t:"No dejarnos llevar demasiado por las emociones",s:{fresa:3}},{t:"Salir de la zona de confort y atrevernos a más",s:{vainilla:3,higo:1}},{t:"Bajar el ritmo mental y simplemente estar",s:{menta:3,earl:1}},{t:"Abrirse al mundo — a veces nuestra burbuja es muy cerrada",s:{choco:3}},{t:"Profundizar — a veces la alegría evita lo difícil",s:{mango:3,yuzu:1}},{t:"Comunicar más directo — lo sutil no siempre se entiende",s:{lavanda:3,carda:1}},{t:"Dejar espacio al cambio — nos aferramos a lo que fue",s:{platano:3,chai:1}},{t:"Equilibrarnos — a veces uno da más que el otro",s:{miel:3,vainilla:1}}]},
    {q:"¿Qué los hace únicos como dúo?",o:[{t:"La forma en que nos queremos — pocos lo tienen así",s:{fresa:3,vino:1}},{t:"La calma que nos damos — somos el descanso uno del otro",s:{vainilla:3,platano:1}},{t:"La estimulación mutua — siempre hay algo nuevo que aprender",s:{menta:3,yuzu:1}},{t:"La profundidad — nos conocemos en capas que otros no ven",s:{choco:3,earl:1}},{t:"La energía — con nosotros siempre es un buen momento",s:{mango:3}},{t:"La sensibilidad compartida — nos entendemos sin hablar",s:{lavanda:3,carda:1}},{t:"La calidez — cualquiera que nos ve siente el cuidado",s:{chai:3,miel:1}},{t:"La historia — hemos construido algo que muy pocos tienen",s:{platano:3,higo:1}}]},
    {q:"Una palabra para describir lo que son juntos:",o:[{t:"Intensidad",s:{fresa:3,vino:1}},{t:"Serenidad",s:{vainilla:3,matcha:1}},{t:"Crecimiento",s:{menta:3,yuzu:1}},{t:"Profundidad",s:{choco:3,earl:1}},{t:"Alegría",s:{mango:3}},{t:"Sensibilidad",s:{lavanda:3,carda:1}},{t:"Calidez",s:{chai:3,miel:1}},{t:"Raíces",s:{platano:3,higo:1}}]},
    {q:"¿Cómo quieren que los recuerden juntos?",o:[{t:"Como los que más se amaron",s:{fresa:3,vino:1}},{t:"Como los que siempre estaban ahí",s:{vainilla:3,platano:1}},{t:"Como los que siempre tenían algo fascinante que decir",s:{menta:3,yuzu:1}},{t:"Como los que tenían algo profundo que pocos entendían",s:{choco:3,earl:1}},{t:"Como los que hacían cualquier momento memorable",s:{mango:3}},{t:"Como los que hacían sentir la belleza del mundo",s:{lavanda:3,carda:1}},{t:"Como los que siempre tenían lugar para todos",s:{chai:3,miel:1}},{t:"Como los que construyeron algo que duró",s:{platano:3,higo:1}}]}
  ];
}
