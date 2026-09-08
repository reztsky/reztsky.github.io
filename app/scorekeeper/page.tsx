"use client";
import { useState, useRef, useEffect, useMemo } from "react";

const INITIAL_GAMES = 10;
const LS_KEY = "scorekeeper_v1";

const SCORE_PRESETS = [5, 10, 25, 50, 100];

type Player = { name: string; scores: number[] };

const createDefaultPlayers = (): Player[] => [
  { name: "Pemain 1", scores: Array(INITIAL_GAMES).fill(0) },
  { name: "Pemain 2", scores: Array(INITIAL_GAMES).fill(0) },
  { name: "Pemain 3", scores: Array(INITIAL_GAMES).fill(0) },
  { name: "Pemain 4", scores: Array(INITIAL_GAMES).fill(0) },
];

const getTotalScore = (scores?: number[]): number => {
  if (!Array.isArray(scores)) return 0;
  return scores.reduce((t, s) => t + (typeof s === "number" && !isNaN(s) ? s : 0), 0);
};

export default function ScoreKeeper() {
  const [players, setPlayers] = useState<Player[]>(createDefaultPlayers);
  const [restored, setRestored] = useState(false);
  const [selected, setSelected] = useState<{ p: number; g: number } | null>(null);
  const [customVal, setCustomVal] = useState("");
  const [flash, setFlash] = useState<{
    p: number;
    g: number;
    sign: "+" | "-";
  } | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const stickyBarRef = useRef<HTMLDivElement>(null);
  const isSyncingScrollRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          Array.isArray(parsed) &&
          parsed.length >= 2 &&
          parsed.every(
            (p) =>
              p &&
              typeof p === "object" &&
              typeof p.name === "string" &&
              Array.isArray(p.scores)
          )
        ) {
          const targetLength = Math.max(
            1,
            Array.isArray(parsed[0]?.scores) ? parsed[0].scores.length : INITIAL_GAMES
          );
          const normalized: Player[] = parsed.map((p, idx) => ({
            name: typeof p.name === "string" && p.name.trim() ? p.name : `Pemain ${idx + 1}`,
            scores: Array.from({ length: targetLength }, (_, i) =>
              typeof p.scores[i] === "number" && !isNaN(p.scores[i]) ? p.scores[i] : 0
            ),
          }));
          requestAnimationFrame(() => {
            setPlayers(normalized);
            setRestored(true);
          });
          const t = setTimeout(() => setRestored(false), 2800);
          return () => clearTimeout(t);
        }
      }
    } catch {
      // Corrupted data fallback
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(players));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }, [players]);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!tableWrapRef.current) return;
      const rect = tableWrapRef.current.getBoundingClientRect();
      setShowStickyBar(rect.top <= 16);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTableScroll = () => {
    if (isSyncingScrollRef.current) return;
    if (tableWrapRef.current && stickyBarRef.current) {
      isSyncingScrollRef.current = true;
      stickyBarRef.current.scrollLeft = tableWrapRef.current.scrollLeft;
      requestAnimationFrame(() => {
        isSyncingScrollRef.current = false;
      });
    }
  };

  const handleStickyBarScroll = () => {
    if (isSyncingScrollRef.current) return;
    if (tableWrapRef.current && stickyBarRef.current) {
      isSyncingScrollRef.current = true;
      tableWrapRef.current.scrollLeft = stickyBarRef.current.scrollLeft;
      requestAnimationFrame(() => {
        isSyncingScrollRef.current = false;
      });
    }
  };

  const numGames = players[0]?.scores?.length ?? 0;

  const playerTotals = useMemo(
    () => players.map((p) => getTotalScore(p.scores)),
    [players]
  );

  const maxScore = useMemo(
    () => (playerTotals.length > 0 ? Math.max(...playerTotals) : 0),
    [playerTotals]
  );

  const hasGameStarted = useMemo(
    () => players.some((p) => p.scores.some((s) => typeof s === "number" && s !== 0)),
    [players]
  );

  const triggerFlash = (p: number, g: number, sign: "+" | "-") => {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setFlash({ p, g, sign });
    flashTimerRef.current = setTimeout(() => {
      setFlash(null);
      flashTimerRef.current = null;
    }, 450);
  };

  const updateScore = (amount: number) => {
    if (!selected) return;
    const { p, g } = selected;

    setPlayers((prev) => {
      if (
        !prev[p] ||
        !Array.isArray(prev[p].scores) ||
        g < 0 ||
        g >= prev[p].scores.length
      ) {
        return prev;
      }
      return prev.map((pl, idx) => {
        if (idx !== p) return pl;
        const newScores = [...pl.scores];
        newScores[g] = (newScores[g] ?? 0) + amount;
        return { ...pl, scores: newScores };
      });
    });

    triggerFlash(p, g, amount >= 0 ? "+" : "-");
  };

  const handleCustomScore = (sign: 1 | -1) => {
    if (!selected) return;
    const val = parseInt(customVal, 10);
    if (!isNaN(val) && val > 0) {
      updateScore(sign * val);
      setCustomVal("");
    }
  };

  const handleNameChange = (index: number, name: string) => {
    setPlayers((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const next = [...prev];
      next[index] = { ...next[index], name };
      return next;
    });
  };

  const addPlayer = () => {
    setPlayers((prev) => {
      const currentGameCount = prev[0]?.scores?.length ?? INITIAL_GAMES;
      return [
        ...prev,
        {
          name: `Pemain ${prev.length + 1}`,
          scores: Array(currentGameCount).fill(0),
        },
      ];
    });
  };

  const removePlayer = (index: number) => {
    if (players.length <= 2) return;
    setPlayers((prev) => prev.filter((_, i) => i !== index));
    setSelected((prev) => {
      if (!prev) return null;
      if (prev.p === index) return null;
      if (prev.p > index) return { ...prev, p: prev.p - 1 };
      return prev;
    });
  };

  const addGame = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, scores: [...p.scores, 0] })));
  };

  const removeGame = () => {
    if (numGames <= 1) return;
    setPlayers((prev) =>
      prev.map((p) => ({ ...p, scores: p.scores.slice(0, -1) }))
    );
    setSelected((prev) => {
      if (!prev) return null;
      if (prev.g >= numGames - 1) return null;
      return prev;
    });
  };

  const resetAll = () => {
    setPlayers(createDefaultPlayers());
    setSelected(null);
    setCustomVal("");
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // Ignored
    }
  };

  const isSelectedLeader = Boolean(
    selected &&
      hasGameStarted &&
      playerTotals[selected.p] !== undefined &&
      playerTotals[selected.p] === maxScore
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          touch-action: manipulation;
        }

        :focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        body {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          background: #090d16;
          color: #f1f5f9;
          -webkit-text-size-adjust: 100%;
        }

        .sk-root {
          min-height: 100vh;
          background-color: #090d16;
          display: flex;
          flex-direction: column;
          padding-bottom: var(--panel-height, 240px);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .sk-sticky-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 90;
          background: rgba(14, 20, 32, 0.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #1e293b;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
          padding: 8px 14px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          touch-action: manipulation;
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease;
        }

        .sk-sticky-bar.visible {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .sk-sticky-bar-track {
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 1040px;
          margin: 0 auto;
          min-width: min-content;
        }

        .sticky-player-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 9999px;
          background: #151d2c;
          border: 1px solid #233044;
          cursor: pointer;
          transition: background-color 0.15s, border-color 0.15s;
          white-space: nowrap;
          user-select: none;
        }

        .sticky-player-pill:hover {
          background: #1b263b;
        }

        .sticky-player-pill.selected-pill {
          border-color: #3b82f6;
          background: #172554;
        }

        .sticky-player-pill.leader-pill {
          border-color: #d97706;
          background: #2b1f0c;
        }

        .sticky-crown {
          font-size: 14px;
          line-height: 1;
        }

        .sticky-player-name {
          font-size: 13px;
          font-weight: 600;
          color: #f1f5f9;
        }

        .sticky-player-score {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          color: #93c5fd;
          background: #1e3a8a;
          padding: 2px 7px;
          border-radius: 9999px;
        }

        .sticky-player-score.leader-score {
          color: #fef08a;
          background: #78350f;
        }

        .sk-header {
          padding: 28px 16px 14px;
          text-align: center;
        }

        .sk-title {
          font-size: clamp(24px, 5vw, 38px);
          font-weight: 800;
          letter-spacing: -0.8px;
          color: #ffffff;
          line-height: 1.15;
        }

        .sk-subtitle {
          margin-top: 4px;
          font-size: 13px;
          color: #94a3b8;
        }

        .sk-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          padding: 0 12px 18px;
        }

        .sk-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 40px;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid transparent;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s, border-color 0.15s, transform 0.1s;
          white-space: nowrap;
          user-select: none;
        }

        .sk-btn:active {
          transform: translateY(1px);
        }

        .btn-primary {
          background: #2563eb;
          color: #ffffff;
          border-color: #3b82f6;
        }
        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-success {
          background: #059669;
          color: #ffffff;
          border-color: #10b981;
        }
        .btn-success:hover {
          background: #047857;
        }

        .btn-danger {
          background: #1f1d24;
          color: #f87171;
          border-color: #451a1a;
        }
        .btn-danger:hover {
          background: #2d1e1e;
        }

        .btn-ghost {
          background: #151d2c;
          color: #cbd5e1;
          border-color: #233044;
        }
        .btn-ghost:hover:not(:disabled) {
          background: #1e293b;
        }
        .btn-ghost:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .sk-content {
          padding: 0 14px;
          max-width: 1040px;
          margin: 0 auto;
          width: 100%;
        }

        .sk-table-wrap {
          overflow-x: auto;
          overflow-y: auto;
          max-height: calc(100dvh - var(--panel-height, 240px) - 110px);
          min-height: 250px;
          border-radius: 10px;
          background: #0e1422;
          border: 1px solid #1e293b;
          -webkit-overflow-scrolling: touch;
          position: relative;
        }

        table {
          width: 100%;
          border-spacing: 0;
          border-collapse: separate;
          min-width: 320px;
        }

        thead th {
          padding: 0;
          position: sticky;
          top: 0;
          z-index: 30;
          background: #0e1422;
          border-bottom: 2px solid #1e293b;
        }

        .th-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 8px;
          position: relative;
          background: #0e1422;
          border-right: 1px solid #172033;
        }

        .th-crown-slot {
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .th-crown-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          line-height: 1;
          user-select: none;
        }

        .th-crown-empty {
          height: 14px;
        }

        .th-inner.is-leader-header {
          background: #141c2c;
          border-bottom-color: #d97706;
        }

        .th-name-input {
          background: transparent;
          border: none;
          outline: none;
          color: #f1f5f9;
          font-family: inherit;
          font-size: 16px;
          font-weight: 700;
          text-align: center;
          width: 100%;
          border-bottom: 2px solid transparent;
          transition: border-color 0.15s;
          padding: 2px 0;
          min-width: 0;
        }

        .th-name-input:focus {
          border-bottom-color: #3b82f6;
        }

        .th-total-badge {
          font-size: 12px;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          padding: 2px 8px;
          border-radius: 9999px;
          background: #1e293b;
          color: #93c5fd;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
        }

        .th-total-badge.badge-leader {
          background: #78350f;
          color: #fef08a;
          border: 1px solid #d97706;
        }

        .mini-crown-text {
          font-size: 11px;
          line-height: 1;
        }

        .th-remove-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 12px;
          line-height: 1;
          padding: 4px 6px;
          border-radius: 4px;
          transition: color 0.15s, background-color 0.15s;
        }
        .th-remove-btn:hover:not(:disabled) {
          color: #f87171;
          background: #241417;
        }
        .th-remove-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }

        tbody tr {
          border-top: 1px solid #141b2b;
        }

        tbody tr:nth-child(even) {
          background: rgba(255, 255, 255, 0.015);
        }

        td.score-cell {
          padding: 11px 6px;
          text-align: center;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 600;
          color: #cbd5e1;
          border-bottom: 1px solid #141b2b;
          border-right: 1px solid #141b2b;
          user-select: none;
          transition: background-color 0.12s;
        }

        td.score-cell:hover {
          background: #1e293b;
          color: #ffffff;
        }

        td.score-cell.selected {
          background: #1e3a8a;
          color: #ffffff;
          box-shadow: inset 0 0 0 2px #3b82f6;
        }

        td.score-cell.flash-pos {
          animation: flashPos 0.45s ease;
        }
        td.score-cell.flash-neg {
          animation: flashNeg 0.45s ease;
        }

        @keyframes flashPos {
          0% { background: #064e3b; color: #6ee7b7; }
          100% { background: transparent; }
        }
        @keyframes flashNeg {
          0% { background: #7f1d1d; color: #fca5a5; }
          100% { background: transparent; }
        }

        tfoot tr {
          border-top: 2px solid #1e293b;
          background: #0b101c;
        }

        tfoot .foot-total {
          padding: 12px 6px;
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          color: #34d399;
          border-right: 1px solid #172033;
        }

        tfoot .foot-total.leader-total {
          color: #fef08a;
          background: #19160d;
        }

        .foot-crown {
          font-size: 13px;
          line-height: 1;
        }

        .sk-panel {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(11, 16, 26, 0.96);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-top: 1px solid #1e293b;
          padding: 10px 14px calc(12px + env(safe-area-inset-bottom, 0px));
          z-index: 80;
        }

        .panel-hint {
          text-align: center;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .panel-hint span {
          color: #60a5fa;
          font-weight: 700;
        }

        .panel-hint span.leader-hint {
          color: #fbbf24;
        }

        .panel-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
          max-width: 580px;
          margin: 0 auto 8px;
        }

        .preset-btn {
          min-height: 44px;
          border-radius: 8px;
          border: 1px solid transparent;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.12s, transform 0.1s;
          user-select: none;
        }

        .preset-btn:active {
          transform: scale(0.96);
        }

        .preset-add {
          background: #172554;
          color: #93c5fd;
          border-color: #1e40af;
        }
        .preset-add:hover {
          background: #1e3a8a;
          color: #dbeafe;
        }

        .preset-sub {
          background: #3b1414;
          color: #fca5a5;
          border-color: #7f1d1d;
        }
        .preset-sub:hover {
          background: #501919;
          color: #fee2e2;
        }

        .panel-custom {
          display: flex;
          gap: 8px;
          max-width: 580px;
          margin: 0 auto;
          align-items: center;
        }

        .custom-input {
          flex: 1;
          min-height: 42px;
          background: #131a28;
          border: 1px solid #233044;
          border-radius: 8px;
          padding: 8px 12px;
          color: #f1f5f9;
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px;
          font-weight: 600;
          text-align: center;
          outline: none;
          transition: border-color 0.15s;
          min-width: 0;
        }

        .custom-input:focus {
          border-color: #3b82f6;
        }
        .custom-input::placeholder {
          color: #475569;
        }

        .custom-add {
          min-height: 42px;
          min-width: 54px;
          background: #2563eb;
          color: #ffffff;
          border: 1px solid #3b82f6;
          border-radius: 8px;
          font-family: inherit;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.12s;
        }
        .custom-add:hover {
          background: #1d4ed8;
        }

        .custom-sub {
          min-height: 42px;
          min-width: 54px;
          background: #991b1b;
          color: #ffffff;
          border: 1px solid #b91c1c;
          border-radius: 8px;
          font-family: inherit;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.12s;
        }
        .custom-sub:hover {
          background: #7f1d1d;
        }

        @media (max-width: 600px) {
          .sk-root {
            padding-bottom: 230px;
          }
          .sk-header {
            padding: 20px 12px 10px;
          }
          .sk-toolbar {
            gap: 6px;
            padding: 0 10px 12px;
          }
          .sk-btn {
            min-height: 36px;
            padding: 6px 11px;
            font-size: 12px;
          }
          .panel-grid {
            gap: 4px;
          }
          .preset-btn {
            font-size: 12px;
            min-height: 42px;
          }
          .sk-table-wrap {
            max-height: calc(100dvh - var(--panel-height, 230px) - 90px);
          }
        }

        .sk-toast {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%) translateY(-80px);
          background: #064e3b;
          border: 1px solid #059669;
          color: #6ee7b7;
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          z-index: 200;
          pointer-events: none;
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), opacity 0.25s ease;
          opacity: 0;
          white-space: nowrap;
        }
        .sk-toast.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      `}</style>

      <div className="sk-root">
        <div
          ref={stickyBarRef}
          className={`sk-sticky-bar ${showStickyBar ? "visible" : ""}`}
          onScroll={handleStickyBarScroll}
          aria-label="Papan skor tersemat"
        >
          <div className="sk-sticky-bar-track">
            {players.map((player, i) => {
              const total = playerTotals[i] ?? 0;
              const isLeader = hasGameStarted && total === maxScore;
              const isSelected = selected?.p === i;

              return (
                <button
                  key={i}
                  type="button"
                  className={`sticky-player-pill ${isLeader ? "leader-pill" : ""} ${isSelected ? "selected-pill" : ""}`}
                  onClick={() => {
                    const row = selected ? selected.g : 0;
                    setSelected({ p: i, g: row });
                  }}
                  title={`Pilih ${player.name}`}
                >
                  {isLeader && <span className="sticky-crown">👑</span>}
                  <span className="sticky-player-name">{player.name}</span>
                  <span className={`sticky-player-score ${isLeader ? "leader-score" : ""}`}>
                    {total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`sk-toast ${restored ? "show" : ""}`} role="status">
          Sesi permainan berhasil dipulihkan
        </div>

        <header className="sk-header">
          <h1 className="sk-title">ScoreKeeper</h1>
          <p className="sk-subtitle">Pilih kotak ronde lalu tentukan nilai skor</p>
        </header>

        <nav className="sk-toolbar" aria-label="Aksi permainan">
          <button type="button" className="sk-btn btn-primary" onClick={addPlayer}>
            ＋ Pemain
          </button>
          <button type="button" className="sk-btn btn-success" onClick={addGame}>
            ＋ Ronde
          </button>
          <button
            type="button"
            className="sk-btn btn-ghost"
            onClick={removeGame}
            disabled={numGames <= 1}
          >
            － Ronde
          </button>
          <button type="button" className="sk-btn btn-danger" onClick={resetAll}>
            ↺ Atur Ulang
          </button>
        </nav>

        <main className="sk-content">
          <div
            ref={tableWrapRef}
            className="sk-table-wrap"
            onScroll={handleTableScroll}
            tabIndex={0}
            aria-label="Tabel skor pertandingan"
          >
            <table>
              <thead>
                <tr>
                  {players.map((player, i) => {
                    const total = playerTotals[i] ?? 0;
                    const isLeader = hasGameStarted && total === maxScore;

                    return (
                      <th key={i} scope="col">
                        <div className={`th-inner ${isLeader ? "is-leader-header" : ""}`}>
                          <div className="th-crown-slot">
                            {isLeader ? (
                              <span className="th-crown-badge" title="Skor tertinggi saat ini">
                                👑
                              </span>
                            ) : (
                              <span className="th-crown-empty" />
                            )}
                          </div>

                          <input
                            className="th-name-input"
                            value={player.name}
                            onChange={(e) => handleNameChange(i, e.target.value)}
                            maxLength={18}
                            placeholder={`P${i + 1}`}
                            aria-label={`Nama pemain ${i + 1}`}
                          />
                          <span
                            className={`th-total-badge ${
                              isLeader ? "badge-leader" : ""
                            }`}
                          >
                            {isLeader && <span className="mini-crown-text">👑 </span>}
                            {total}
                          </span>
                          <button
                            type="button"
                            className="th-remove-btn"
                            onClick={() => removePlayer(i)}
                            title="Hapus pemain"
                            aria-label={`Hapus ${player.name}`}
                            disabled={players.length <= 2}
                          >
                            ✕
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: numGames }, (_, row) => (
                  <tr key={row}>
                    {players.map((p, col) => {
                      const isSelected =
                        selected?.p === col && selected?.g === row;
                      const isFlash = flash?.p === col && flash?.g === row;
                      const flashClass = isFlash
                        ? flash?.sign === "+"
                          ? "flash-pos"
                          : "flash-neg"
                        : "";
                      const cellScore = p.scores?.[row] ?? 0;

                      return (
                        <td
                          key={col}
                          className={`score-cell ${
                            isSelected ? "selected" : ""
                          } ${flashClass}`}
                          onClick={() => setSelected({ p: col, g: row })}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelected({ p: col, g: row });
                            }
                          }}
                          aria-label={`${p.name}, Ronde ${row + 1}: ${cellScore} poin`}
                        >
                          {cellScore}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  {players.map((p, i) => {
                    const total = playerTotals[i] ?? 0;
                    const isLeader = hasGameStarted && total === maxScore;

                    return (
                      <td
                        key={i}
                        className={`foot-total ${
                          isLeader ? "leader-total" : ""
                        }`}
                      >
                        {isLeader && <span className="foot-crown">👑 </span>}
                        {total}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </main>

        <section className="sk-panel" aria-label="Kontrol input skor">
          <div className="panel-hint">
            {selected && players[selected.p] ? (
              <>
                <span className={isSelectedLeader ? "leader-hint" : ""}>
                  {isSelectedLeader && "👑 "}
                  {players[selected.p].name}
                  {isSelectedLeader && " (Pemimpin)"}
                </span>{" "}
                · Ronde {selected.g + 1}
              </>
            ) : (
              "Ketuk salah satu kotak ronde untuk mengisi skor"
            )}
          </div>

          <div className="panel-grid">
            {SCORE_PRESETS.map((v) => (
              <button
                key={v}
                type="button"
                className="preset-btn preset-add"
                onClick={() => updateScore(v)}
                aria-label={`Tambah ${v} poin`}
              >
                +{v}
              </button>
            ))}
            {SCORE_PRESETS.map((v) => (
              <button
                key={v}
                type="button"
                className="preset-btn preset-sub"
                onClick={() => updateScore(-v)}
                aria-label={`Kurangi ${v} poin`}
              >
                -{v}
              </button>
            ))}
          </div>

          <div className="panel-custom">
            <input
              ref={inputRef}
              className="custom-input"
              placeholder="Skor kustom…"
              value={customVal}
              onChange={(e) => setCustomVal(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCustomScore(1);
              }}
              type="text"
              inputMode="numeric"
              aria-label="Nilai skor kustom"
            />
            <button
              type="button"
              className="custom-add"
              onClick={() => handleCustomScore(1)}
              title="Tambah nilai kustom"
              aria-label="Tambahkan skor kustom"
            >
              ＋
            </button>
            <button
              type="button"
              className="custom-sub"
              onClick={() => handleCustomScore(-1)}
              title="Kurangi nilai kustom"
              aria-label="Kurangkan skor kustom"
            >
              －
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
