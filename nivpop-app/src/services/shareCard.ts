import type { FlavorId } from "@/types";
import { FLAVORS } from "@/utils/flavors";
import { FLAVOR_HEX } from "@/utils/colors";

const FLAVOR_EMOJI_MAP: Record<FlavorId, string> = {
  fresa:"🍓",vainilla:"🍦",menta:"🍃",choco:"🍫",mango:"🥭",lavanda:"💜",
  matcha:"🍵",miel:"🍯",higo:"🫐",caramelo:"🍮",yuzu:"🍋",earl:"🌿",
  chai:"☕",platano:"🍌",vino:"🍷",carda:"🌸",
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (const w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), x, cy);
      line = w + " ";
      cy += lineH;
    } else {
      line = test;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, cy);
}

export interface ShareCardOptions {
  flavorId: FlavorId;
  name?: string;
  duo?: boolean;
  n1?: string;
  n2?: string;
  compat?: number;
}

export function generateShareCard(opts: ShareCardOptions): string {
  const { flavorId, name, duo, n1, n2, compat } = opts;
  const f    = FLAVORS[flavorId];
  const hex  = FLAVOR_HEX[flavorId];
  const emoji = FLAVOR_EMOJI_MAP[flavorId] ?? "🍦";

  const canvas = document.createElement("canvas");
  canvas.width  = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#16120d";
  ctx.fillRect(0, 0, 1080, 1080);

  // Subtle inner frame
  ctx.strokeStyle = "rgba(250,249,246,0.07)";
  ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, 992, 992);

  // Color stripe top
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, 1080, 7);

  // Emoji
  ctx.font = "190px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, 540, 270);

  // Flavor name
  ctx.font = "700 76px Georgia, serif";
  ctx.fillStyle = hex;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(f.name, 540, 420);

  // Persona
  ctx.font = "italic 40px Georgia, serif";
  ctx.fillStyle = "rgba(250,249,246,0.52)";
  ctx.fillText(f.persona, 540, 485);

  // Person name(s)
  if (duo && n1 && n2) {
    ctx.font = "400 38px Arial, sans-serif";
    ctx.fillStyle = "rgba(250,249,246,0.68)";
    ctx.fillText(`${n1} & ${n2}`, 540, 558);
    if (compat) {
      ctx.font = "700 58px Georgia, serif";
      ctx.fillStyle = hex;
      ctx.fillText(`${compat}% compatibles`, 540, 632);
    }
  } else if (name) {
    ctx.font = "400 40px Arial, sans-serif";
    ctx.fillStyle = "rgba(250,249,246,0.65)";
    ctx.fillText(name, 540, 560);
  }

  // Divider
  ctx.fillStyle = "rgba(250,249,246,0.10)";
  ctx.fillRect(220, 680, 640, 1);

  // Quote
  ctx.font = "italic 31px Georgia, serif";
  ctx.fillStyle = "rgba(250,249,246,0.30)";
  wrapText(ctx, `"${f.ins.hl}"`, 540, 718, 780, 46);

  // Branding
  ctx.font = "400 24px Arial, sans-serif";
  ctx.fillStyle = "rgba(250,249,246,0.18)";
  ctx.fillText("NIV'POP · HELADOS ARTESANALES", 540, 980);

  ctx.font = "400 20px Arial, sans-serif";
  ctx.fillStyle = "rgba(250,249,246,0.10)";
  ctx.fillText("#NivPop", 540, 1013);

  return canvas.toDataURL("image/png");
}
