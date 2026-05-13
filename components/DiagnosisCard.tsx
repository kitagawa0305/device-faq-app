"use client";

import { DiagnosisQuestion } from "@/lib/diagnosisTypes";

interface Props {
  question: DiagnosisQuestion;
  turnCount: number;
  maxTurns: number;
  onSelect: (label: string) => void;
  disabled?: boolean;
}

export default function DiagnosisCard({
  question,
  turnCount,
  maxTurns,
  onSelect,
  disabled,
}: Props) {
  const progress = Math.round((turnCount / maxTurns) * 100);

  return (
    <div className="w-full bg-gray-800 border border-indigo-500/30 rounded-2xl p-4 space-y-3 animate-fade-slide">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <span className="text-indigo-400 text-xs font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          AI 진단 진행 중
        </span>
        <span className="text-gray-500 text-xs">
          {turnCount} / {maxTurns}
        </span>
      </div>

      {/* 진행 바 */}
      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 질문 */}
      <p className="text-white text-sm font-medium leading-relaxed">
        {question.question}
      </p>

      {/* 선택지 */}
      <div className="space-y-2">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(opt.label)}
            disabled={disabled}
            className="w-full text-left px-3 py-2.5 rounded-xl border border-gray-600 hover:border-indigo-400 hover:bg-indigo-500/10 text-gray-200 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="font-medium text-indigo-400 mr-2 group-hover:text-indigo-300">
              {String.fromCharCode(65 + i)}.
            </span>
            {opt.label}
            {opt.hint && (
              <span className="block text-xs text-gray-500 mt-0.5 pl-5">
                {opt.hint}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
