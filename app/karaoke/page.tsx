"use client";

import { useState, useRef, useEffect, useMemo } from "react";

type Layout = "side-by-side" | "stacked" | "prompter-only";

const COLOR_PRESETS = [
  { name: "Panggung Gelap", bg: "#0c1017", text: "#f1f5f9" },
  { name: "Emas Konser", bg: "#231808", text: "#fde68a" },
  { name: "Biru Studio", bg: "#091a32", text: "#bfdbfe" },
  { name: "Merah Panggung", bg: "#280b11", text: "#fecdd3" },
  { name: "Layar Terang", bg: "#f8fafc", text: "#0f172a" },
];

const SAMPLE_LYRICS = `Bintang di surga
Dan air mata ini terlanjur jatuh
Membasahi seluruh rasa ragu

Waktu yang terus berganti
Membawaku ke dalam sepi
Mencari arti hadirmu di sini

Kini semua telah berlalu
Menyisakan kenangan dalam kalbu
Kutatap langit malam yang membisu`;

function getLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length !== 6) return 0.5;
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
  const [lr, lg, lb] = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export default function KaraokePage() {
  const [rawText, setRawText] = useState(SAMPLE_LYRICS);
  const [bgColor, setBgColor] = useState<string>("#0c1017");
  const [fontSize, setFontSize] = useState<number>(2.2);
  const [layout, setLayout] = useState<Layout>("side-by-side");
  const [activeLineIdx, setActiveLineIdx] = useState<number>(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2);

  const displayRef = useRef<HTMLDivElement>(null);

  const lines = useMemo(() => {
    return rawText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  }, [rawText]);

  // Compute text color based on luminance for WCAG AA compliance
  const textColor = useMemo(() => {
    return getLuminance(bgColor) > 0.4 ? "#0f172a" : "#f8fafc";
  }, [bgColor]);

  const activeHighlightBg = useMemo(() => {
    return getLuminance(bgColor) > 0.4
      ? "rgba(15, 23, 42, 0.08)"
      : "rgba(255, 255, 255, 0.12)";
  }, [bgColor]);

  useEffect(() => {
    if (!isAutoScrolling) return;

    let animId: number;
    const scrollStep = () => {
      if (displayRef.current) {
        displayRef.current.scrollTop += scrollSpeed * 0.7;
        if (
          displayRef.current.scrollTop + displayRef.current.clientHeight >=
          displayRef.current.scrollHeight - 4
        ) {
          setIsAutoScrolling(false);
          return;
        }
      }
      animId = window.requestAnimationFrame(scrollStep);
    };

    animId = window.requestAnimationFrame(scrollStep);
    return () => {
      window.cancelAnimationFrame(animId);
    };
  }, [isAutoScrolling, scrollSpeed]);

  const handleLineClick = (index: number) => {
    setActiveLineIdx(index);
  };

  const handleClear = () => {
    setRawText("");
    setActiveLineIdx(0);
    setIsAutoScrolling(false);
  };

  const handleLoadSample = () => {
    setRawText(SAMPLE_LYRICS);
    setActiveLineIdx(0);
  };

  const isDarkCanvas = getLuminance(bgColor) <= 0.4;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          touch-action: manipulation;
        }

        :focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        body {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          background: #090d16;
          color: #f1f5f9;
          -webkit-text-size-adjust: 100%;
        }

        .kr-container {
          min-height: 100vh;
          padding: 24px 16px 40px;
          max-width: 1320px;
          margin: 0 auto;
        }

        .kr-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .kr-title {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 800;
          letter-spacing: -0.8px;
          color: #ffffff;
        }

        .kr-subtitle {
          margin-top: 4px;
          font-size: 14px;
          color: #94a3b8;
        }

        .kr-main-card {
          background: #0f1422;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 20px;
        }

        .kr-controls-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          margin-bottom: 16px;
          border-bottom: 1px solid #1e293b;
        }

        .kr-btn-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .kr-btn {
          min-height: 38px;
          padding: 8px 14px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: background-color 0.15s, border-color 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          user-select: none;
        }

        .kr-btn:active {
          transform: translateY(1px);
        }

        .btn-play {
          background: #10b981;
          color: #ffffff;
          border-color: #059669;
        }
        .btn-play:hover {
          background: #059669;
        }

        .btn-pause {
          background: #b45309;
          color: #ffffff;
          border-color: #d97706;
        }
        .btn-pause:hover {
          background: #92400e;
        }

        .btn-outline {
          background: #172033;
          color: #cbd5e1;
          border-color: #24324c;
        }
        .btn-outline:hover {
          background: #1e293b;
          color: #ffffff;
        }

        .kr-workspace {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .kr-workspace.stacked {
          flex-direction: column;
        }

        .kr-pane {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .kr-pane-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .kr-pane-label {
          font-size: 13px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.2px;
          text-transform: uppercase;
        }

        .kr-editor {
          width: 100%;
          height: 520px;
          background: #090d16;
          border: 1px solid #1e293b;
          border-radius: 8px;
          padding: 16px;
          color: #e2e8f0;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 15px;
          line-height: 1.8;
          resize: none;
          outline: none;
          transition: border-color 0.15s;
        }

        .kr-editor:focus {
          border-color: #2563eb;
        }

        .kr-display {
          width: 100%;
          height: 520px;
          border-radius: 8px;
          padding: 24px;
          overflow-y: auto;
          scroll-behavior: smooth;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: background-color 0.2s, color 0.2s;
        }

        .kr-display::-webkit-scrollbar {
          width: 6px;
        }
        .kr-display::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .kr-lyric-line {
          display: block;
          margin-bottom: 0.6em;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 700;
          transition: background-color 0.15s, opacity 0.15s;
          user-select: none;
          opacity: 0.75;
        }

        .kr-lyric-line:hover {
          opacity: 1;
        }

        .kr-lyric-line.active-line {
          opacity: 1;
          transform: translateX(4px);
        }

        .kr-settings-panel {
          background: #141b2a;
          border: 1px solid #1e293b;
          border-radius: 8px;
          padding: 16px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          align-items: center;
        }

        .kr-setting-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .kr-setting-label {
          font-size: 12px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .kr-preset-colors {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .kr-color-chip {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: transform 0.1s, border-color 0.15s;
        }

        .kr-color-chip.selected {
          border-color: #2563eb;
          transform: scale(1.1);
        }

        .kr-native-color {
          width: 32px;
          height: 28px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 4px;
        }

        .kr-range-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .kr-range-slider {
          flex: 1;
          accent-color: #2563eb;
          cursor: pointer;
        }

        .kr-range-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #cbd5e1;
          min-width: 44px;
          text-align: right;
        }

        .kr-select {
          min-height: 38px;
          padding: 6px 12px;
          border-radius: 6px;
          background: #090d16;
          border: 1px solid #233044;
          color: #f1f5f9;
          font-family: inherit;
          font-size: 13px;
          cursor: pointer;
          outline: none;
        }
        .kr-select:focus {
          border-color: #2563eb;
        }

        @media (max-width: 840px) {
          .kr-workspace {
            flex-direction: column;
          }
          .kr-editor {
            height: 280px;
          }
          .kr-display {
            height: 400px;
          }
          .kr-controls-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .kr-btn-group {
            justify-content: stretch;
          }
          .kr-btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>

      <div className="kr-container">
        <header className="kr-header">
          <h1 className="kr-title">Karaoke & Prompter Lirik</h1>
          <p className="kr-subtitle">
            Format lirik dengan penyesuaian panggung, ukuran teks, dan auto-scroll
          </p>
        </header>

        <main className="kr-main-card">
          <div className="kr-controls-bar">
            <div className="kr-btn-group">
              <button
                type="button"
                className={`kr-btn ${isAutoScrolling ? "btn-pause" : "btn-play"}`}
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                aria-label={isAutoScrolling ? "Hentikan gulir otomatis" : "Mulai gulir otomatis"}
              >
                {isAutoScrolling ? "⏸ Jeda Prompter" : "▶ Mulai Prompter"}
              </button>

              <button
                type="button"
                className="kr-btn btn-outline"
                onClick={handleLoadSample}
                aria-label="Muat lirik contoh"
              >
                Contoh Lirik
              </button>

              <button
                type="button"
                className="kr-btn btn-outline"
                onClick={handleClear}
                aria-label="Bersihkan kotak input"
              >
                Bersihkan
              </button>
            </div>

            <div className="kr-btn-group">
              <label htmlFor="layout-select" className="kr-setting-label" style={{ margin: "auto 0" }}>
                Tampilan:
              </label>
              <select
                id="layout-select"
                className="kr-select"
                value={layout}
                onChange={(e) => setLayout(e.target.value as Layout)}
                aria-label="Pilih susunan tampilan"
              >
                <option value="side-by-side">Berdampingan</option>
                <option value="stacked">Bertumpuk</option>
                <option value="prompter-only">Layar Penuh Prompter</option>
              </select>
            </div>
          </div>

          <div className={`kr-workspace ${layout === "stacked" ? "stacked" : ""}`}>
            {layout !== "prompter-only" && (
              <section className="kr-pane" aria-label="Editor input lirik">
                <div className="kr-pane-header">
                  <span className="kr-pane-label">Input Lirik Lagu</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    {lines.length} baris
                  </span>
                </div>
                <textarea
                  className="kr-editor"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Tempel atau ketik lirik lagu di sini..."
                  aria-label="Teks lirik lagu"
                />
              </section>
            )}

            <section className="kr-pane" aria-label="Tampilan panggung karaoke">
              <div className="kr-pane-header">
                <span className="kr-pane-label">Tampilan Panggung</span>
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  Ketuk baris untuk menandai posisi nyanyi
                </span>
              </div>

              <div
                ref={displayRef}
                className="kr-display"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  fontSize: `${fontSize}rem`,
                  lineHeight: 1.5,
                }}
                tabIndex={0}
                aria-label="Area penampil lirik karaoke"
              >
                {lines.length === 0 ? (
                  <p style={{ color: isDarkCanvas ? "#64748b" : "#94a3b8", fontSize: "1rem" }}>
                    Lirik belum dimasukkan. Ketik atau tempel lirik di sebelah kiri.
                  </p>
                ) : (
                  lines.map((line, idx) => {
                    const isActive = idx === activeLineIdx;
                    return (
                      <span
                        key={idx}
                        className={`kr-lyric-line ${isActive ? "active-line" : ""}`}
                        style={{
                          backgroundColor: isActive ? activeHighlightBg : "transparent",
                          borderLeft: isActive ? `3px solid ${isDarkCanvas ? "#38bdf8" : "#0284c7"}` : "3px solid transparent",
                        }}
                        onClick={() => handleLineClick(idx)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleLineClick(idx);
                          }
                        }}
                        aria-current={isActive ? "step" : undefined}
                      >
                        {line}
                      </span>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          <footer className="kr-settings-panel" aria-label="Pengaturan tampilan lirik">
            <div className="kr-setting-group">
              <span className="kr-setting-label">Tema Panggung</span>
              <div className="kr-preset-colors">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.bg}
                    type="button"
                    className={`kr-color-chip ${bgColor === preset.bg ? "selected" : ""}`}
                    style={{ backgroundColor: preset.bg }}
                    onClick={() => setBgColor(preset.bg)}
                    title={preset.name}
                    aria-label={`Tema ${preset.name}`}
                  />
                ))}
                <input
                  type="color"
                  className="kr-native-color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  title="Pilih warna kustom"
                  aria-label="Pilih warna latar kustom"
                />
              </div>
            </div>

            <div className="kr-setting-group">
              <label htmlFor="font-size-slider" className="kr-setting-label">
                Ukuran Teks
              </label>
              <div className="kr-range-row">
                <input
                  id="font-size-slider"
                  type="range"
                  className="kr-range-slider"
                  min={1.2}
                  max={4}
                  step={0.2}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseFloat(e.target.value))}
                  aria-label="Ukuran teks lirik"
                />
                <span className="kr-range-val">{fontSize.toFixed(1)}rem</span>
              </div>
            </div>

            <div className="kr-setting-group">
              <label htmlFor="speed-slider" className="kr-setting-label">
                Kecepatan Gulir
              </label>
              <div className="kr-range-row">
                <input
                  id="speed-slider"
                  type="range"
                  className="kr-range-slider"
                  min={0.5}
                  max={6}
                  step={0.5}
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
                  aria-label="Kecepatan gulir prompter"
                />
                <span className="kr-range-val">{scrollSpeed}x</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
