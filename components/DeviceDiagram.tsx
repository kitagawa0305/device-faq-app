"use client";

import { Device, Component, RepairDifficulty } from "@/lib/queryHelper";

interface Props {
  device: Device;
  selectedComponent: Component | null;
  onSelectComponent: (c: Component | null) => void;
}

const DIFFICULTY_STYLE: Record<RepairDifficulty, { bg: string; text: string; dot: string; label: string }> = {
  DIY:        { bg: "bg-emerald-900/60", text: "text-emerald-300", dot: "bg-emerald-400", label: "DIY 가능" },
  전문가권장: { bg: "bg-amber-900/60",   text: "text-amber-300",   dot: "bg-amber-400",   label: "전문가 권장" },
  전문가필요: { bg: "bg-red-900/60",     text: "text-red-300",     dot: "bg-red-400",     label: "전문가 필요" },
};

const DEVICE_SHAPES: Record<string, React.ReactNode> = {
  smartphone: (
    <>
      <rect x="30" y="10" width="140" height="380" rx="22" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <rect x="38" y="40" width="124" height="240" rx="6" fill="#0f172a" />
      <circle cx="100" cy="26" r="5" fill="#0f172a" />
      <rect x="70" y="350" width="60" height="4" rx="2" fill="#334155" />
      <rect x="130" y="40" width="32" height="52" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <rect x="170" y="130" width="4" height="30" rx="2" fill="#475569" />
      <rect x="26" y="120" width="4" height="20" rx="2" fill="#475569" />
      <rect x="26" y="148" width="4" height="20" rx="2" fill="#475569" />
      <rect x="80" y="375" width="40" height="8" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <rect x="26" y="152" width="4" height="14" rx="2" fill="#64748b" />
    </>
  ),
  laptop: (
    <>
      <rect x="20" y="10" width="320" height="195" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <rect x="28" y="18" width="304" height="179" rx="4" fill="#0f172a" />
      <rect x="20" y="200" width="320" height="8" rx="2" fill="#475569" />
      <rect x="10" y="208" width="340" height="42" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <rect x="22" y="214" width="220" height="28" rx="3" fill="#0f172a" />
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
        <rect key={`k${i}`} x={25 + i * 19} y="217" width="16" height="10" rx="2" fill="#1e293b" />
      ))}
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <rect key={`k2${i}`} x={27 + i * 21} y="230" width="18" height="10" rx="2" fill="#1e293b" />
      ))}
      <rect x="142" y="214" width="60" height="24" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <rect x="255" y="214" width="90" height="28" rx="3" fill="#0f172a" />
      {[0,1,2,3,4].map(i => (
        <circle key={`s${i}`} cx={265 + i * 16} cy="228" r="3" fill="#1e293b" />
      ))}
      <circle cx="180" cy="14" r="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
    </>
  ),
  tablet: (
    <>
      <rect x="20" y="15" width="240" height="350" rx="18" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <rect x="28" y="50" width="224" height="270" rx="4" fill="#0f172a" />
      <circle cx="140" cy="30" r="7" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <circle cx="140" cy="30" r="4" fill="#1e293b" />
      <rect x="118" y="335" width="44" height="16" rx="8" fill="#0f172a" />
      <rect x="118" y="352" width="44" height="8" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
      <rect x="260" y="80" width="4" height="22" rx="2" fill="#475569" />
      <rect x="260" y="110" width="4" height="16" rx="2" fill="#475569" />
      <rect x="260" y="130" width="4" height="16" rx="2" fill="#475569" />
      {[0,1,2].map(i => (
        <circle key={`sc${i}`} cx={118 + i * 12} cy="340" r="2" fill="#475569" />
      ))}
    </>
  ),
};

export default function DeviceDiagram({ device, selectedComponent, onSelectComponent }: Props) {
  const repairStyle = selectedComponent
    ? DIFFICULTY_STYLE[selectedComponent.repairInfo.difficulty]
    : null;

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-950 p-6 overflow-y-auto">
      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        <h2 className="text-white font-semibold text-lg">{device.icon} {device.name} 부품 도해</h2>
        <p className="text-gray-400 text-xs">부품 점을 클릭하면 수리 정보가 나타납니다</p>

        <svg
          viewBox={device.svgViewBox}
          className="w-full max-w-[260px] drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 0 20px rgba(59,130,246,0.15))" }}
        >
          {DEVICE_SHAPES[device.id]}

          {device.components.map((comp) => {
            const isSelected = selectedComponent?.id === comp.id;
            const ds = DIFFICULTY_STYLE[comp.repairInfo.difficulty];
            const dotColor =
              comp.repairInfo.difficulty === "DIY" ? "#34d399" :
              comp.repairInfo.difficulty === "전문가권장" ? "#fbbf24" : "#f87171";

            return (
              <g
                key={comp.id}
                onClick={() => onSelectComponent(isSelected ? null : comp)}
                style={{ cursor: "pointer" }}
              >
                {isSelected && (
                  <circle
                    cx={comp.cx} cy={comp.cy} r={22}
                    fill="rgba(59,130,246,0.15)"
                    stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2"
                  />
                )}
                <circle
                  cx={comp.cx} cy={comp.cy} r={14}
                  fill={isSelected ? "rgba(59,130,246,0.3)" : "rgba(30,41,59,0.7)"}
                  stroke={isSelected ? "#60a5fa" : "#475569"}
                  strokeWidth="1.5"
                />
                {/* 난이도 색상 내부 점 */}
                <circle cx={comp.cx} cy={comp.cy} r={5} fill={isSelected ? "#60a5fa" : dotColor} />
                <rect
                  x={comp.cx - 28} y={comp.cy + 17} width={56} height={14}
                  rx={4} fill="rgba(15,23,42,0.85)"
                />
                <text
                  x={comp.cx} y={comp.cy + 27}
                  textAnchor="middle"
                  fill={isSelected ? "#93c5fd" : "#cbd5e1"}
                  fontSize="8"
                  fontWeight={isSelected ? "700" : "400"}
                >
                  {comp.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 범례 */}
        <div className="flex gap-3 text-xs">
          {(Object.keys(DIFFICULTY_STYLE) as RepairDifficulty[]).map((d) => (
            <span key={d} className="flex items-center gap-1 text-gray-400">
              <span className={`w-2 h-2 rounded-full ${DIFFICULTY_STYLE[d].dot}`} />
              {DIFFICULTY_STYLE[d].label}
            </span>
          ))}
        </div>

        {/* 선택된 부품 정보 */}
        {selectedComponent && repairStyle && (
          <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 space-y-3">
            <div>
              <p className="text-blue-400 font-semibold text-sm mb-0.5">
                {selectedComponent.name}
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                {selectedComponent.description}
              </p>
            </div>

            {/* 수리 정보 카드 */}
            <div className={`rounded-lg p-2.5 ${repairStyle.bg} border border-white/5`}>
              <p className={`text-xs font-bold mb-2 flex items-center gap-1.5 ${repairStyle.text}`}>
                <span className={`w-2 h-2 rounded-full ${repairStyle.dot}`} />
                수리 난이도: {selectedComponent.repairInfo.difficulty}
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <div>
                  <span className="text-gray-500">예상 비용</span>
                  <p className="text-gray-200 font-medium">{selectedComponent.repairInfo.cost}</p>
                </div>
                <div>
                  <span className="text-gray-500">소요 시간</span>
                  <p className="text-gray-200 font-medium">{selectedComponent.repairInfo.time}</p>
                </div>
              </div>
              <p className="mt-2 text-gray-400 text-xs leading-relaxed border-t border-white/10 pt-2">
                {selectedComponent.repairInfo.note}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
