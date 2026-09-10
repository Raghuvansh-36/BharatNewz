import React from "react";
import { AlertOctagon, Flame, Waves, Wind, Zap } from "lucide-react";

export default function ThreatBanner({ threats = [], onSelectThreat }) {
  if (!threats || threats.length === 0) return null;

  const getThreatIcon = (type) => {
    switch (type.toLowerCase()) {
      case "hurricane":
      case "storm":
        return <Wind className="w-3.5 h-3.5 text-cyan-400" />;
      case "flood":
        return <Waves className="w-3.5 h-3.5 text-blue-400" />;
      case "wildfire":
        return <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />;
      case "earthquake":
        return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
      default:
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-20 max-w-sm hidden md:block">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-3.5 shadow-2xl space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active Threat Monitor</h3>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{threats.length} Active Alerts</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {threats.slice(0, 4).map((threat) => (
            <button
              key={threat.id}
              onClick={() => onSelectThreat(threat)}
              className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/50 hover:border-blue-500/40 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-200 group-hover:text-blue-300">
                  {getThreatIcon(threat.threat_type)}
                  <span className="truncate">{threat.country_name}</span>
                </div>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                    threat.severity === "critical"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : threat.severity === "high"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                  }`}
                >
                  {threat.severity}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{threat.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
