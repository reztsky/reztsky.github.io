"use client";
import { useState, useRef, useEffect } from "react";

const INITIAL_GAMES = 10;
const LS_KEY = "scorekeeper_v1";

const SCORE_PRESETS = [5, 10, 25, 50, 100];

const getTotalScore = (scores: number[]) => scores.reduce((t, s) => t + s, 0);

type Player = { name: string; scores: number[] };

const DEFAULT_PLAYERS: Player[] = [
  { name: "Player 1", scores: Array(INITIAL_GAMES).fill(0) },
  { name: "Player 2", scores: Array(INITIAL_GAMES).fill(0) },
  { name: "Player 3", scores: Array(INITIAL_GAMES).fill(0) },
  { name: "Player 4", scores: Array(INITIAL_GAMES).fill(0) },
];

function loadPlayers(): Player[] {
  if (typeof window === "undefined") return DEFAULT_PLAYERS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_PLAYERS;
    const parsed = JSON.parse(raw) as Player[];
    if (
      Array.isArray(parsed) &&
      parsed.length >= 2 &&
      parsed.every(
        (p) =>
          typeof p.name === "string" && Array.isArray(p.scores),
      )
    ) {
      return parsed;
    }
  } catch {
    // corrupted data — fall back to defaults
  }
  return DEFAULT_PLAYERS;
}

export default function ScoreKeeper() {
  // Always start with defaults so server & client render identically (no hydration mismatch).
  // localStorage is loaded client-side only, after hydration, in the useEffect below.
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [restored, setRestored] = useState(false);
  const [selected, setSelected] = useState<{ p: number; g: number } | null>(
    null,
  );
  const [customVal, setCustomVal] = useState("");
  const [flash, setFlash] = useState<{
    p: number;
    g: number;
    sign: "+" | "-";
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // After hydration: load saved state from localStorage, then keep in sync on every change.
  useEffect(() => {
    // 1. Load saved data once on mount
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Player[];
        if (
          Array.isArray(parsed) &&
          parsed.length >= 2 &&
          parsed.every((p) => typeof p.name === "string" && Array.isArray(p.scores))
        ) {
          setPlayers(parsed);
          setRestored(true);
          setTimeout(() => setRestored(false), 2800);
        }
      }
    } catch {
      // corrupted — keep defaults
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once after first render

  // 2. Persist on every subsequent change
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(players));
    } catch {
      // storage full or unavailable — fail silently
    }
  }, [players]);

  const numGames = players[0]?.scores.length ?? 0;

  const rankedPlayers = [...players]
    .map((p, i) => ({ ...p, originalIndex: i, total: getTotalScore(p.scores) }))
    .sort((a, b) => b.total - a.total)
    .map((p, i) => ({ ...p, rank: i + 1 }));

  const triggerFlash = (p: number, g: number, sign: "+" | "-") => {
    setFlash({ p, g, sign });
    setTimeout(() => setFlash(null), 600);
  };

  const updateScore = (amount: number) => {
    if (!selected) return;
    const { p, g } = selected;
    setPlayers((prev) => {
      const next = prev.map((pl) => ({ ...pl, scores: [...pl.scores] }));
      next[p].scores[g] += amount;
      return next;
    });
    triggerFlash(p, g, amount >= 0 ? "+" : "-");
  };

  const handleCustomScore = (sign: 1 | -1) => {
    const val = parseInt(customVal);
    if (!isNaN(val) && val > 0) {
      updateScore(sign * val);
      setCustomVal("");
    }
  };

  const handleNameChange = (index: number, name: string) => {
    setPlayers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], name };
      return next;
    });
  };

  const addPlayer = () => {
    setPlayers((prev) => [
      ...prev,
      { name: `Player ${prev.length + 1}`, scores: Array(numGames).fill(0) },
    ]);
  };

  const removePlayer = (index: number) => {
    if (players.length <= 2) return;
    setPlayers((prev) => prev.filter((_, i) => i !== index));
    if (selected?.p === index) setSelected(null);
  };

  const addGame = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, scores: [...p.scores, 0] })));
  };

  const removeGame = () => {
    if (numGames <= 1) return;
    setPlayers((prev) =>
      prev.map((p) => ({ ...p, scores: p.scores.slice(0, -1) })),
    );
    if (selected && selected.g >= numGames - 1) setSelected(null);
  };

  const resetAll = () => {
    setPlayers(DEFAULT_PLAYERS);
    setSelected(null);
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'Inter', sans-serif; }

        .sk-root {
          min-height: 100vh;
          background: #0a0e1a;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.25) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(16,185,129,0.12) 0%, transparent 50%);
          color: #e2e8f0;
          display: flex;
          flex-direction: column;
          padding-bottom: var(--panel-height, 220px);
        }

        .sk-header {
          padding: 28px 16px 12px;
          text-align: center;
        }

        .sk-title {
          font-size: clamp(24px, 6vw, 48px);
          font-weight: 900;
          letter-spacing: -1.5px;
          background: linear-gradient(135deg, #a5b4fc 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
        }

        .sk-subtitle {
          margin-top: 6px;
          font-size: 12px;
          color: #64748b;
          letter-spacing: 0.5px;
        }

        .sk-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
          padding: 0 12px 16px;
        }

        .sk-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 8px 14px;
          border-radius: 10px;
          border: none;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.2px;
          white-space: nowrap;
        }

        .sk-btn:active { transform: scale(0.95); }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
        }
        .btn-primary:hover { background: linear-gradient(135deg, #818cf8, #6366f1); box-shadow: 0 4px 20px rgba(99,102,241,0.5); }

        .btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          box-shadow: 0 4px 14px rgba(16,185,129,0.3);
        }
        .btn-success:hover { background: linear-gradient(135deg, #34d399, #10b981); }

        .btn-danger {
          background: rgba(239,68,68,0.15);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.25);
        }
        .btn-danger:hover { background: rgba(239,68,68,0.25); }

        .btn-ghost {
          background: rgba(255,255,255,0.06);
          color: #94a3b8;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }

        .sk-content {
          padding: 0 12px;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }

        /* Table */
        .sk-table-wrap {
          overflow-x: auto;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          -webkit-overflow-scrolling: touch;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 320px;
        }

        thead th {
          padding: 0;
          position: sticky;
          top: 0;
          z-index: 10;
          background: rgba(15,20,40,0.95);
          backdrop-filter: blur(12px);
        }

        .th-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px 8px 8px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .th-name-input {
          background: transparent;
          border: none;
          outline: none;
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
          width: 100%;
          letter-spacing: 0.2px;
          border-bottom: 1.5px solid transparent;
          transition: border-color 0.2s;
          padding: 2px 0;
          min-width: 0;
        }

        .th-name-input:focus {
          border-bottom-color: #6366f1;
        }

        .th-total-badge {
          font-size: 11px;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          padding: 2px 7px;
          border-radius: 20px;
          background: rgba(99,102,241,0.2);
          color: #a5b4fc;
          letter-spacing: 0.5px;
        }

        .th-remove-btn {
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          font-size: 13px;
          line-height: 1;
          padding: 2px 4px;
          border-radius: 4px;
          transition: color 0.2s;
        }
        .th-remove-btn:hover { color: #f87171; }

        tbody tr {
          border-top: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }

        tbody tr:hover { background: rgba(255,255,255,0.02); }
        tbody tr:nth-child(even) { background: rgba(255,255,255,0.015); }

        td.score-cell {
          padding: 10px 6px;
          text-align: center;
          cursor: pointer;
          transition: all 0.15s;
          position: relative;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 600;
          color: #cbd5e1;
        }

        td.score-cell:hover { background: rgba(99,102,241,0.1); color: #a5b4fc; }

        td.score-cell.selected {
          background: rgba(99,102,241,0.2);
          color: #a5b4fc;
          box-shadow: inset 0 0 0 2px rgba(99,102,241,0.6);
        }

        td.score-cell.flash-pos { animation: flashPos 0.5s ease; }
        td.score-cell.flash-neg { animation: flashNeg 0.5s ease; }

        @keyframes flashPos {
          0% { background: rgba(16,185,129,0.4); }
          100% { background: transparent; }
        }
        @keyframes flashNeg {
          0% { background: rgba(239,68,68,0.35); }
          100% { background: transparent; }
        }

        tfoot tr {
          border-top: 2px solid rgba(255,255,255,0.1);
          background: rgba(15,20,40,0.8);
        }

        tfoot .foot-total {
          padding: 10px 6px;
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          color: #34d399;
        }

        /* Bottom panel */
        .sk-panel {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: rgba(10,14,26,0.94);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 10px 12px env(safe-area-inset-bottom, 12px);
          z-index: 100;
        }

        .panel-hint {
          text-align: center;
          font-size: 11px;
          color: #334155;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .panel-hint span {
          color: #6366f1;
          font-weight: 600;
        }

        .panel-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 5px;
          max-width: 640px;
          margin: 0 auto 8px;
        }

        .preset-btn {
          padding: 9px 4px;
          border-radius: 9px;
          border: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.3px;
        }

        .preset-btn:active { transform: scale(0.92); }

        .preset-add {
          background: linear-gradient(135deg, #1e3a5f, #1e3a8a);
          color: #93c5fd;
          border: 1px solid rgba(59,130,246,0.25);
        }
        .preset-add:hover { background: linear-gradient(135deg, #1e40af, #2563eb); color: #bfdbfe; }

        .preset-sub {
          background: linear-gradient(135deg, #3b1219, #7f1d1d);
          color: #fca5a5;
          border: 1px solid rgba(239,68,68,0.2);
        }
        .preset-sub:hover { background: linear-gradient(135deg, #7f1d1d, #991b1b); color: #fecaca; }

        .panel-custom {
          display: flex;
          gap: 6px;
          max-width: 640px;
          margin: 0 auto;
          align-items: center;
        }

        .custom-input {
          flex: 1;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 9px 10px;
          color: #e2e8f0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          outline: none;
          transition: border-color 0.2s;
          min-width: 0;
        }

        .custom-input:focus { border-color: #6366f1; }
        .custom-input::placeholder { color: #334155; }

        .custom-add {
          background: linear-gradient(135deg, #1e3a8a, #2563eb);
          color: #bfdbfe;
          border: none;
          border-radius: 10px;
          padding: 9px 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .custom-add:hover { background: linear-gradient(135deg, #2563eb, #3b82f6); }

        .custom-sub {
          background: linear-gradient(135deg, #7f1d1d, #b91c1c);
          color: #fecaca;
          border: none;
          border-radius: 10px;
          padding: 9px 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .custom-sub:hover { background: linear-gradient(135deg, #b91c1c, #dc2626); }
        .custom-add:active, .custom-sub:active { transform: scale(0.93); }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .sk-root { padding-bottom: 200px; }

          .sk-header { padding: 20px 12px 8px; }
          .sk-subtitle { font-size: 11px; }

          .sk-toolbar { gap: 5px; padding: 0 10px 12px; }
          .sk-btn { padding: 7px 11px; font-size: 12px; }

          /* 5 presets become 3-column on xs, 2-row each side */
          .panel-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 4px;
          }

          .preset-btn {
            padding: 8px 2px;
            font-size: 11px;
            border-radius: 8px;
          }

          .custom-input { font-size: 13px; padding: 8px 8px; }
          .custom-add, .custom-sub { padding: 8px 12px; font-size: 14px; }

          .th-name-input { font-size: 12px; }
          .th-total-badge { font-size: 10px; padding: 1px 5px; }
          td.score-cell { font-size: 13px; padding: 9px 4px; }
          tfoot .foot-total { font-size: 13px; padding: 8px 4px; }
        }

        @media (max-width: 360px) {
          .panel-grid { grid-template-columns: repeat(5, 1fr); gap: 3px; }
          .preset-btn { font-size: 10px; padding: 7px 1px; }
          .sk-btn { padding: 6px 9px; font-size: 11px; }
        }

        /* ── Toast ── */
        .sk-toast {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%) translateY(-80px);
          background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.35);
          color: #34d399;
          backdrop-filter: blur(12px);
          padding: 8px 18px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.4px;
          z-index: 200;
          pointer-events: none;
          transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.35s ease;
          opacity: 0;
          white-space: nowrap;
        }
        .sk-toast.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      `}</style>

      <div className="sk-root">
        {/* Restore toast */}
        <div className={`sk-toast ${restored ? "show" : ""}`}>
          ✦ Session restored
        </div>
        <div className="sk-header">
          <h1 className="sk-title">ScoreKeeper</h1>
          <p className="sk-subtitle">Tap a cell · Apply score below</p>
        </div>

        <div className="sk-toolbar">
          <button className="sk-btn btn-primary" onClick={addPlayer}>
            ＋ Player
          </button>
          <button className="sk-btn btn-success" onClick={addGame}>
            ＋ Round
          </button>
          <button className="sk-btn btn-ghost" onClick={removeGame}>
            － Round
          </button>
          <button className="sk-btn btn-danger" onClick={resetAll}>
            ↺ Reset
          </button>
        </div>

        <div className="sk-content">
          <div className="sk-table-wrap">
            <table>
              <thead>
                <tr>
                  {players.map((player, i) => (
                    <th key={i}>
                      <div className="th-inner">
                        <input
                          className="th-name-input"
                          value={player.name}
                          onChange={(e) => handleNameChange(i, e.target.value)}
                          maxLength={18}
                        />
                        <span className="th-total-badge">
                          {getTotalScore(player.scores)}
                        </span>
                        <button
                          className="th-remove-btn"
                          onClick={() => removePlayer(i)}
                          title="Remove player"
                        >
                          ✕
                        </button>
                      </div>
                    </th>
                  ))}
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
                      return (
                        <td
                          key={col}
                          className={`score-cell ${isSelected ? "selected" : ""} ${flashClass}`}
                          onClick={() => setSelected({ p: col, g: row })}
                        >
                          {p.scores[row]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  {players.map((p, i) => (
                    <td key={i} className="foot-total">
                      {getTotalScore(p.scores)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Score Panel */}
        <div className="sk-panel">
          <div className="panel-hint">
            {selected ? (
              <>
                <span>{players[selected.p]?.name}</span> · Round{" "}
                {selected.g + 1}
              </>
            ) : (
              "Tap a cell to update score"
            )}
          </div>

          <div className="panel-grid">
            {SCORE_PRESETS.map((v) => (
              <button
                key={v}
                className="preset-btn preset-add"
                onClick={() => updateScore(v)}
              >
                +{v}
              </button>
            ))}
            {SCORE_PRESETS.map((v) => (
              <button
                key={v}
                className="preset-btn preset-sub"
                onClick={() => updateScore(-v)}
              >
                -{v}
              </button>
            ))}
          </div>

          <div className="panel-custom">
            <input
              ref={inputRef}
              className="custom-input"
              placeholder="Custom…"
              value={customVal}
              onChange={(e) => setCustomVal(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCustomScore(1);
              }}
              type="text"
              inputMode="numeric"
            />
            <button className="custom-add" onClick={() => handleCustomScore(1)}>
              ＋
            </button>
            <button
              className="custom-sub"
              onClick={() => handleCustomScore(-1)}
            >
              －
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
