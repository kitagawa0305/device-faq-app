export interface Faq {
  keywords: string[];
  question: string;
  answer: string;
}

export type RepairDifficulty = "DIY" | "전문가권장" | "전문가필요";

export interface RepairInfo {
  difficulty: RepairDifficulty;
  cost: string;
  time: string;
  note: string;
}

export interface Component {
  id: string;
  name: string;
  cx: number;
  cy: number;
  description: string;
  repairInfo: RepairInfo;
  faqs: Faq[];
}

export interface Device {
  id: string;
  name: string;
  icon: string;
  svgViewBox: string;
  components: Component[];
}

export function matchFaq(question: string, faqs: Faq[]): Faq | null {
  const q = question.toLowerCase();
  let best: Faq | null = null;
  let bestScore = 0;

  for (const faq of faqs) {
    const score = faq.keywords.filter((kw) => q.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }

  return bestScore > 0 ? best : null;
}

export function getAllFaqs(device: Device): Faq[] {
  return device.components.flatMap((c) => c.faqs);
}

const CACHE_PREFIX = "dfaq_";
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24시간

interface CacheEntry {
  answer: string;
  ts: number;
}

export function getCached(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.ts > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.answer;
  } catch {
    return null;
  }
}

export function setCached(key: string, answer: string) {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry = { answer, ts: Date.now() };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // localStorage 용량 초과 시 무시
  }
}

export async function askQuestion(
  question: string,
  device: Device,
  component: Component | null
): Promise<{ answer: string; source: "faq" | "cache" | "api" }> {
  const faqs = component ? component.faqs : getAllFaqs(device);
  const matched = matchFaq(question, faqs);
  if (matched) return { answer: matched.answer, source: "faq" };

  const cacheKey = `${device.id}_${question.trim().toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return { answer: cached, source: "cache" };

  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      deviceName: device.name,
      componentName: component?.name ?? null,
    }),
  });

  const data = await res.json();
  if (data.answer) {
    setCached(cacheKey, data.answer);
    return { answer: data.answer, source: "api" };
  }

  throw new Error(data.error ?? "API 오류");
}
