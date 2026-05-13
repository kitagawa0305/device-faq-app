"use client";

import { useState, useCallback } from "react";
import {
  DiagnosisSession,
  DiagnosisAnswer,
  DiagnosisAPIResponse,
  DiagnosisResult,
  createSession,
} from "@/lib/diagnosisTypes";
import { Device, Component } from "@/lib/queryHelper";

const MAX_TURNS = 6;
const CACHE_PREFIX = "diag_";

// localStorage 결과 저장/조회
function saveResult(deviceId: string, componentId: string, result: DiagnosisResult) {
  try {
    const key = `${CACHE_PREFIX}${deviceId}_${componentId}`;
    localStorage.setItem(key, JSON.stringify({ result, ts: Date.now() }));
  } catch { /* 용량 초과 무시 */ }
}

export function useDiagnosis() {
  const [session, setSession] = useState<DiagnosisSession | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const startDiagnosis = useCallback(
    async (device: Device, component: Component) => {
      const newSession = createSession(
        device.id,
        device.name,
        component.id,
        component.name,
        component.description
      );
      setRetryCount(0);
      setSession({ ...newSession, status: "loading" });

      const response = await fetchNextStep(newSession);

      if (!response) {
        setSession((prev) => (prev ? { ...prev, status: "error" } : prev));
        return;
      }

      setSession((prev) =>
        prev
          ? {
              ...prev,
              status: response.isDone ? "done" : "questioning",
              currentQuestion: response.isDone ? null : response.question,
              result: response.isDone ? response.result : null,
              turnCount: 1,
            }
          : prev
      );
    },
    []
  );

  const selectOption = useCallback(
    async (selectedLabel: string) => {
      if (!session || session.status !== "questioning" || !session.currentQuestion)
        return;

      const newAnswer: DiagnosisAnswer = {
        turnIndex: session.turnCount,
        question: session.currentQuestion.question,
        selectedLabel,
      };

      const updatedHistory = [...session.history, newAnswer];
      const updatedSession: DiagnosisSession = {
        ...session,
        history: updatedHistory,
        status: "loading",
      };
      setSession(updatedSession);

      // 최대 턴 도달 시 강제 완료
      const historyToSend =
        session.turnCount >= MAX_TURNS
          ? [
              ...updatedHistory,
              {
                turnIndex: 99,
                question: "__force_done__",
                selectedLabel: "지금까지 정보로 진단을 완료해주세요",
              },
            ]
          : updatedHistory;

      const response = await fetchNextStep({
        ...updatedSession,
        history: historyToSend,
      });

      // 실패 시 최대 1회 재시도
      if (!response) {
        if (retryCount < 1) {
          setRetryCount((c) => c + 1);
          const retryResponse = await fetchNextStep({
            ...updatedSession,
            history: historyToSend,
          });
          applyResponse(retryResponse, updatedSession, session.deviceId, session.componentId);
        } else {
          setSession((prev) => (prev ? { ...prev, status: "error" } : prev));
        }
        return;
      }

      applyResponse(response, updatedSession, session.deviceId, session.componentId);
    },
    [session, retryCount]
  );

  function applyResponse(
    response: DiagnosisAPIResponse | null,
    base: DiagnosisSession,
    deviceId: string,
    componentId: string
  ) {
    if (!response) {
      setSession((prev) => (prev ? { ...prev, status: "error" } : prev));
      return;
    }

    if (response.isDone) {
      // 결과 localStorage에 저장
      saveResult(deviceId, componentId, response.result);
      setSession({
        ...base,
        status: "done",
        currentQuestion: null,
        result: response.result,
      });
    } else {
      setSession({
        ...base,
        status: "questioning",
        currentQuestion: response.question,
        turnCount: base.turnCount + 1,
      });
    }
  }

  const resetDiagnosis = useCallback(() => {
    setSession(null);
    setRetryCount(0);
  }, []);

  return { session, startDiagnosis, selectOption, resetDiagnosis };
}

async function fetchNextStep(
  session: DiagnosisSession
): Promise<DiagnosisAPIResponse | null> {
  try {
    const res = await fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceName: session.deviceName,
        componentName: session.componentName,
        componentDescription: session.componentDescription,
        history: session.history,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    // API가 error 필드를 반환하면 null 처리
    if (data.error) return null;
    return data;
  } catch {
    return null;
  }
}
