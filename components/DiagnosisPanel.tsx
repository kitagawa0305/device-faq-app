"use client";

import { useEffect } from "react";
import { Device, Component } from "@/lib/queryHelper";
import { useDiagnosis } from "@/hooks/useDiagnosis";
import DiagnosisCard from "@/components/DiagnosisCard";
import DiagnosisResultCard from "@/components/DiagnosisResult";

const MAX_TURNS = 6;

interface Props {
  device: Device;
  component: Component;
  onClose: () => void;
}

export default function DiagnosisPanel({ device, component, onClose }: Props) {
  const { session, startDiagnosis, selectOption, resetDiagnosis } = useDiagnosis();

  // 부품이 바뀌면 자동으로 진단 시작
  useEffect(() => {
    startDiagnosis(device, component);
  }, [device.id, component.id]);

  function handleReset() {
    resetDiagnosis();
    startDiagnosis(device, component);
  }

  return (
    <div className="w-96 flex flex-col bg-gray-900 border-l border-gray-700">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <p className="text-white font-semibold text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            {component.name} 진단
          </p>
          <p className="text-gray-400 text-xs mt-0.5">{device.name}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-gray-800 transition-colors"
        >
          닫기
        </button>
      </div>

      {/* 답변 히스토리 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* 이전 Q&A 목록 */}
        {session?.history.map((answer, i) => (
          <div key={i} className="space-y-1">
            <p className="text-gray-500 text-xs px-1">Q{answer.turnIndex}. {answer.question}</p>
            <div className="flex justify-end">
              <span className="px-3 py-1.5 rounded-2xl rounded-tr-sm bg-indigo-600 text-white text-xs">
                {answer.selectedLabel}
              </span>
            </div>
          </div>
        ))}

        {/* 로딩 스켈레톤 */}
        {session?.status === "loading" && (
          <div className="w-full bg-gray-800 border border-indigo-500/20 rounded-2xl p-4 space-y-3 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-gray-700 rounded-full" />
              <div className="h-3 w-8 bg-gray-700 rounded-full" />
            </div>
            <div className="h-1 bg-gray-700 rounded-full" />
            <div className="h-4 w-4/5 bg-gray-700 rounded-full" />
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-9 bg-gray-700 rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {/* 현재 질문 */}
        {session?.status === "questioning" && session.currentQuestion && (
          <DiagnosisCard
            question={session.currentQuestion}
            turnCount={session.turnCount}
            maxTurns={MAX_TURNS}
            onSelect={selectOption}
          />
        )}

        {/* 최종 결과 */}
        {session?.status === "done" && session.result && (
          <DiagnosisResultCard
            result={session.result}
            componentName={component.name}
            onReset={handleReset}
          />
        )}

        {/* 오류 */}
        {session?.status === "error" && (
          <div className="text-center py-6 space-y-2">
            <p className="text-red-400 text-sm">진단 중 오류가 발생했습니다</p>
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-white underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 초기 로딩 */}
        {!session && (
          <div className="flex justify-center py-10">
            <span className="text-gray-500 text-sm animate-pulse">진단 시작 중...</span>
          </div>
        )}
      </div>
    </div>
  );
}
