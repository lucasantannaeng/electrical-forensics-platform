import React, { useRef, useEffect, useState } from 'react';
import { TimeSeriesData, AnalogChannel } from '@/types/forensics';
import { Activity, Maximize2, RefreshCw, Layers } from 'lucide-react';

interface OscillogramViewerProps {
  timeSeries: TimeSeriesData;
  channels: AnalogChannel[];
}

export const OscillogramViewer: React.FC<OscillogramViewerProps> = ({ timeSeries, channels }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    channels.forEach(ch => { initial[ch.id] = true; });
    return initial;
  });

  const channelKeys = Object.keys(timeSeries.analog);
  const time = timeSeries.time;
  const numPoints = time.length;

  const colors = ['#38bdf8', '#fbbf24', '#f43f5e', '#a78bfa', '#34d399', '#f97316'];

  const toggleChannel = (id: string) => {
    setSelectedChannels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || numPoints === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 25, right: 30, bottom: 35, left: 65 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Clear background
    ctx.fillStyle = '#0a0f18';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(30, 44, 69, 0.6)';
    ctx.lineWidth = 1;

    // Horizontal grid
    const numGridY = 6;
    for (let i = 0; i <= numGridY; i++) {
      const y = padding.top + (chartH / numGridY) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Vertical grid
    const numGridX = 10;
    for (let i = 0; i <= numGridX; i++) {
      const x = padding.left + (chartW / numGridX) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }

    // Find min / max across active channels
    let minVal = -100;
    let maxVal = 100;

    channelKeys.forEach(k => {
      if (!selectedChannels[k]) return;
      const arr = timeSeries.analog[k];
      arr.forEach(v => {
        if (v < minVal) minVal = v;
        if (v > maxVal) maxVal = v;
      });
    });

    const valRange = maxVal - minVal || 1;
    const margin = valRange * 0.1;
    const yMin = minVal - margin;
    const yMax = maxVal + margin;
    const ySpan = yMax - yMin;

    // Draw Y-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= numGridY; i++) {
      const y = padding.top + (chartH / numGridY) * i;
      const v = yMax - (ySpan / numGridY) * i;
      ctx.fillText(`${v.toFixed(0)}V`, padding.left - 8, y + 3);
    }

    // Draw X-axis labels (time)
    ctx.textAlign = 'center';
    for (let i = 0; i <= numGridX; i++) {
      const x = padding.left + (chartW / numGridX) * i;
      const tIdx = Math.min(Math.floor((numPoints / numGridX) * i), numPoints - 1);
      const tVal = time[tIdx] || 0;
      ctx.fillText(`${(tVal / 1000).toFixed(1)}ms`, x, height - padding.bottom + 16);
    }

    // Draw Waveforms
    channelKeys.forEach((k, chIdx) => {
      if (!selectedChannels[k]) return;
      const data = timeSeries.analog[k];
      if (!data || data.length === 0) return;

      ctx.strokeStyle = colors[chIdx % colors.length];
      ctx.lineWidth = 1.8;
      ctx.beginPath();

      for (let i = 0; i < data.length; i++) {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        const y = padding.top + chartH - ((data[i] - yMin) / ySpan) * chartH;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    // Draw measurement cursor if hovered
    if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < numPoints) {
      const curX = padding.left + (hoverIndex / (numPoints - 1)) * chartW;

      ctx.strokeStyle = '#22d3ee';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(curX, padding.top);
      ctx.lineTo(curX, height - padding.bottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Highlight points
      channelKeys.forEach((k, chIdx) => {
        if (!selectedChannels[k]) return;
        const val = timeSeries.analog[k][hoverIndex];
        const curY = padding.top + chartH - ((val - yMin) / ySpan) * chartH;

        ctx.fillStyle = colors[chIdx % colors.length];
        ctx.beginPath();
        ctx.arc(curX, curY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }
  }, [timeSeries, selectedChannels, hoverIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || numPoints === 0) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 65;
    const chartW = rect.width - 95;
    if (x >= 0 && x <= chartW) {
      const idx = Math.round((x / chartW) * (numPoints - 1));
      setHoverIndex(idx);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div className="glass-panel rounded-xl p-4 border border-industrial-700/80 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-industrial-700/60">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
            Oscilografia Trifásica IEEE COMTRADE
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/40">
            {numPoints} Amostras
          </span>
        </div>

        {/* Channel selector badges */}
        <div className="flex items-center gap-2">
          {channelKeys.map((k, idx) => (
            <button
              key={k}
              onClick={() => toggleChannel(k)}
              style={{
                borderColor: selectedChannels[k] ? colors[idx % colors.length] : 'rgba(71, 85, 105, 0.4)',
                backgroundColor: selectedChannels[k] ? `${colors[idx % colors.length]}18` : 'transparent',
                color: selectedChannels[k] ? colors[idx % colors.length] : '#64748b',
              }}
              className="text-xs font-mono px-2.5 py-1 rounded-md border transition-all flex items-center gap-1.5"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedChannels[k] ? colors[idx % colors.length] : '#64748b' }}
              />
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-72 rounded-lg overflow-hidden border border-industrial-700 bg-industrial-950">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-crosshair"
        />

        {/* Real-time Cursor Readout HUD */}
        {hoverIndex !== null && hoverIndex >= 0 && (
          <div className="absolute top-2 right-2 bg-industrial-900/90 backdrop-blur-md border border-cyan-500/40 rounded-lg p-2 text-[11px] font-mono shadow-xl space-y-0.5">
            <div className="text-slate-400 border-b border-industrial-700 pb-0.5 mb-1">
              t = {((time[hoverIndex] || 0) / 1000).toFixed(2)} ms (Amostra #{hoverIndex + 1})
            </div>
            {channelKeys.map((k, idx) => (
              <div key={k} className="flex items-center justify-between gap-3" style={{ color: colors[idx % colors.length] }}>
                <span>{k}:</span>
                <span className="font-bold">{timeSeries.analog[k][hoverIndex]?.toFixed(1)} V</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
