"use client";

import { useState, useRef, useEffect } from "react";
import { Device, Component, Faq, askQuestion } from "@/lib/queryHelper";

type MessageSource = "faq" | "cache" | "api" | "photo";

interface Message {
  role: "user" | "assistant";
  text: string;
  source?: MessageSource;
  imagePreview?: string;
}

interface Props {
  device: Device;
  component: Component | null;
}

const SOURCE_LABEL: Record<MessageSource, { label: string; color: string }> = {
  faq:   { label: "FAQ",    color: "bg-emerald-700 text-emerald-100" },
  cache: { label: "캐시",   color: "bg-amber-700 text-amber-100" },
  api:   { label: "AI",     color: "bg-blue-700 text-blue-100" },
  photo: { label: "사진 분석", color: "bg-purple-700 text-purple-100" },
};

function formatAnswer(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return (
        <p key={i} className="font-bold text-white mt-2 mb-0.5">
          {trimmed.slice(2, -2)}
        </p>
      );
    }
    if (trimmed.startsWith("•") || trimmed.startsWith("-") || /^\d+\./.test(trimmed)) {
      return <p key={i} className="text-gray-300 pl-2">{trimmed}</p>;
    }
    if (trimmed === "") return <div key={i} className="h-1" />;
    return <p key={i} className="text-gray-300">{trimmed}</p>;
  });
}

export default function ChatPanel({ device, component }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFaqs: Faq[] = component
    ? component.faqs
    : device.components.flatMap((c) => c.faqs);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [device.id, component?.id]);

  async function submit(question: string) {
    if (!question.trim() || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setLoading(true);
    try {
      const { answer, source } = await askQuestion(question, device, component);
      setMessages((prev) => [...prev, { role: "assistant", text: answer, source }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function analyzePhoto(file: File) {
    if (loading) return;

    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "JPEG, PNG, GIF, WebP 형식의 이미지만 업로드할 수 있습니다." },
      ]);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "이미지 크기가 5MB를 초과합니다. 더 작은 이미지를 사용해주세요." },
      ]);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: "사진을 분석해주세요", imagePreview: previewUrl },
    ]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("deviceName", device.name);
      if (component) formData.append("componentName", component.name);

      const res = await fetch("/api/analyze-photo", { method: "POST", body: formData });
      const data = await res.json();

      if (data.answer) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.answer, source: "photo" },
        ]);
      } else {
        throw new Error(data.error ?? "분석 실패");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "사진 분석 중 오류가 발생했습니다. API 키를 확인해주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) analyzePhoto(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) analyzePhoto(file);
  }

  return (
    <div
      className={`w-96 flex flex-col bg-gray-900 border-l border-gray-700 transition-colors ${dragOver ? "bg-gray-800" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-700">
        <p className="text-white font-semibold text-sm">
          {component ? `${component.name} 관련 질문` : `${device.name} 전체 질문`}
        </p>
        <p className="text-gray-400 text-xs mt-0.5">
          FAQ 매칭 → 캐시 → AI 답변 · 사진 업로드로 손상 분석
        </p>
      </div>

      {/* FAQ 칩 */}
      {activeFaqs.length > 0 && (
        <div className="p-3 border-b border-gray-800 flex flex-wrap gap-1.5">
          {activeFaqs.map((faq, i) => (
            <button
              key={i}
              onClick={() => submit(faq.question)}
              disabled={loading}
              className="px-2.5 py-1 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs transition-colors disabled:opacity-50"
            >
              {faq.question}
            </button>
          ))}
        </div>
      )}

      {/* 드래그 오버 오버레이 */}
      {dragOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-purple-900/80 border-2 border-purple-400 border-dashed rounded-2xl px-8 py-6 text-purple-200 text-sm font-medium">
            여기에 이미지를 놓으세요
          </div>
        </div>
      )}

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-8 space-y-1">
            <p>위 칩을 누르거나 직접 질문하세요</p>
            <p className="text-xs text-gray-600">📷 사진을 드래그하거나 카메라 버튼으로 손상을 분석할 수 있습니다</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "user" ? (
              <div className="max-w-[85%] space-y-1">
                {msg.imagePreview && (
                  <div className="flex justify-end">
                    <img
                      src={msg.imagePreview}
                      alt="업로드 이미지"
                      className="max-w-[180px] max-h-[180px] rounded-xl object-cover border border-purple-500/40"
                    />
                  </div>
                )}
                <div className="px-3 py-2 rounded-2xl rounded-tr-sm bg-blue-600 text-white text-sm text-right">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div className="max-w-[90%] space-y-1">
                {msg.source && (
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${SOURCE_LABEL[msg.source].color}`}>
                    {SOURCE_LABEL[msg.source].label}
                  </span>
                )}
                <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-gray-800 text-sm leading-relaxed">
                  {formatAnswer(msg.text)}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl rounded-tl-sm bg-gray-800 text-gray-400 text-sm animate-pulse">
              분석 중...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <form
        onSubmit={(e) => { e.preventDefault(); submit(input); }}
        className="p-3 border-t border-gray-700 flex gap-2 items-center"
      >
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          title="사진 업로드로 손상 분석"
          className="p-2 rounded-lg bg-gray-800 hover:bg-purple-800 border border-gray-600 hover:border-purple-500 text-gray-400 hover:text-purple-300 transition-colors disabled:opacity-40 flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="질문을 입력하세요..."
          disabled={loading}
          className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 placeholder-gray-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
        >
          전송
        </button>
      </form>
    </div>
  );
}
