"use client";

import { useState } from "react";
import devicesData from "@/data/devices.json";
import { Device, Component } from "@/lib/queryHelper";
import Sidebar from "@/components/Sidebar";
import DeviceDiagram from "@/components/DeviceDiagram";
import ChatPanel from "@/components/ChatPanel";
import DiagnosisPanel from "@/components/DiagnosisPanel";

const devices = devicesData as Device[];

type RightPanel = "chat" | "diagnosis";

export default function Home() {
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0].id);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [rightPanel, setRightPanel] = useState<RightPanel>("chat");

  const device = devices.find((d) => d.id === selectedDeviceId) ?? devices[0];

  function handleDeviceSelect(id: string) {
    setSelectedDeviceId(id);
    setSelectedComponent(null);
    setRightPanel("chat");
  }

  function handleSelectComponent(component: Component | null) {
    setSelectedComponent(component);
    // 부품 클릭 시 자동으로 진단 모드 진입
    if (component) setRightPanel("diagnosis");
    else setRightPanel("chat");
  }

  function handleCloseDiagnosis() {
    setRightPanel("chat");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      <Sidebar
        devices={devices}
        selectedId={selectedDeviceId}
        onSelect={handleDeviceSelect}
      />
      <main className="flex flex-1 overflow-hidden">
        {/* 탭 전환 버튼 (부품 선택 시 표시) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedComponent && (
            <div className="flex bg-gray-900 border-b border-gray-700 px-4">
              <button
                onClick={() => setRightPanel("chat")}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  rightPanel === "chat"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                💬 FAQ / 질문
              </button>
              <button
                onClick={() => setRightPanel("diagnosis")}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  rightPanel === "diagnosis"
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                🔍 AI 진단
              </button>
            </div>
          )}
          <div className="flex flex-1 overflow-hidden">
            <DeviceDiagram
              device={device}
              selectedComponent={selectedComponent}
              onSelectComponent={handleSelectComponent}
            />
          </div>
        </div>

        {/* 오른쪽 패널 */}
        {rightPanel === "chat" || !selectedComponent ? (
          <ChatPanel device={device} component={selectedComponent} />
        ) : (
          <DiagnosisPanel
            device={device}
            component={selectedComponent}
            onClose={handleCloseDiagnosis}
          />
        )}
      </main>
    </div>
  );
}
