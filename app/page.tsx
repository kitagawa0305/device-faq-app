"use client";

import { useState } from "react";
import devicesData from "@/data/devices.json";
import { Device, Component } from "@/lib/queryHelper";
import Sidebar from "@/components/Sidebar";
import DeviceDiagram from "@/components/DeviceDiagram";
import ChatPanel from "@/components/ChatPanel";

const devices = devicesData as Device[];

export default function Home() {
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0].id);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);

  const device = devices.find((d) => d.id === selectedDeviceId) ?? devices[0];

  function handleDeviceSelect(id: string) {
    setSelectedDeviceId(id);
    setSelectedComponent(null);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      <Sidebar
        devices={devices}
        selectedId={selectedDeviceId}
        onSelect={handleDeviceSelect}
      />
      <main className="flex flex-1 overflow-hidden">
        <DeviceDiagram
          device={device}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
        />
        <ChatPanel device={device} component={selectedComponent} />
      </main>
    </div>
  );
}
