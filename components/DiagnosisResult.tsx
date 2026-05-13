"use client";

import { DiagnosisResult, DiagnosisUrgency } from "@/lib/diagnosisTypes";

interface Props {
  result: DiagnosisResult;
  componentName: string;
  onReset: () => void;
}

const URGENCY_STYLE: Record<DiagnosisUrgency, { bg: string; text: string; border: string }> = {
  "즉시 수리":    { bg: "bg-red-900/40",     text: "text-red-300",     border: "border-red-500/40" },
  "수리 권장":    { bg: "bg-amber-900/40",   text: "text-amber-300",   border: "border-amber-500/40" },
  "선택적 수리":  { bg: "bg-emerald-900/40", text: "text-emerald-300", border: "border-emerald-500/40" },
};

export default function DiagnosisResultCard({ result, componentName, onReset }: Props) {
  const urgencyStyle = URGENCY_STYLE[result.urgency];

  return (
    <div className="w-full space-y-3 animate-fade-slide">
      {/* 결론 헤더 */}
      <div className={`rounded-2xl border p-4 space-y-2 ${urgencyStyle.bg} ${urgencyStyle.border}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${urgencyStyle.text} ${urgencyStyle.border}`}>
            {result.urgency}
          </span>
          <span className="text-xs text-gray-500">{componentName}</span>
        </div>
        <p className={`font-semibold text-sm ${urgencyStyle.text}`}>
          {result.conclusion}
        </p>
        <p className="text-gray-300 text-xs leading-relaxed">{result.cause}</p>
      </div>

      {/* 수리 단계 */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 space-y-2">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
          수리 방법
        </p>
        <ol className="space-y-1.5">
          {result.repairSteps.map((step, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-300">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* 비용 + DIY */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-3">
          <p className="text-gray-500 text-xs mb-1">예상 비용</p>
          <p className="text-white text-sm font-semibold">{result.estimatedCost}</p>
        </div>
        <div className={`rounded-xl p-3 border ${result.canDIY ? "bg-emerald-900/30 border-emerald-500/30" : "bg-red-900/30 border-red-500/30"}`}>
          <p className="text-gray-500 text-xs mb-1">DIY 가능</p>
          <p className={`text-sm font-semibold ${result.canDIY ? "text-emerald-300" : "text-red-300"}`}>
            {result.canDIY ? "✓ 가능" : "✗ 전문가 필요"}
          </p>
        </div>
      </div>

      {/* 다시 진단 버튼 */}
      <button
        onClick={onReset}
        className="w-full py-2 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 text-sm transition-colors"
      >
        다시 진단하기
      </button>
    </div>
  );
}
