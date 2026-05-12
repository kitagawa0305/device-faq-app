"use client";

import { Device } from "@/lib/queryHelper";

interface Props {
  devices: Device[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function Sidebar({ devices, selectedId, onSelect }: Props) {
  return (
    <aside className="w-44 flex-shrink-0 bg-gray-900 text-white flex flex-col gap-1 p-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
        기기 선택
      </p>
      {devices.map((d) => (
        <button
          key={d.id}
          onClick={() => onSelect(d.id)}
          className={`flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
            d.id === selectedId
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          <span className="text-xl">{d.icon}</span>
          <span className="font-medium">{d.name}</span>
        </button>
      ))}
    </aside>
  );
}
