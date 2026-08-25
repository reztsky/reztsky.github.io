"use client";

import { useRef, useState } from "react";

type Layout = "side-by-side" | "stacked";

export default function LirikLaguPage() {
  const lyricsRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [bgColor, setBgColor] = useState<string>("#ffa500"); // default orange, sama seperti CSS asli
  const [fontSize, setFontSize] = useState<number>(3); // dalam "em", default 3em seperti aslinya
  const [layout, setLayout] = useState<Layout>("side-by-side");

  function processLyrics() {
    const rawText = lyricsRef.current?.innerText.trim() ?? "";
    const splitLines = rawText.split("\n").filter((line) => line.trim() !== "");
    setLines(splitLines);
  }

  const isStacked = layout === "stacked";

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        margin: 0,
        padding: 20,
        backgroundColor: "#f4f4f4",
        color: "#333",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#1db954", marginBottom: 20 }}>
        Lirik Lagu
      </h1>

      <div
        style={{
          background: "white",
          border: "1px solid #ddd",
          padding: 30,
          borderRadius: 15,
          maxWidth: 1300,
          width: "100%",
          margin: "20px auto",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ fontSize: "1.1em", color: "#666" }}>
          Salin dan tempel lirik lagu Anda ke kotak di bawah ini:
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: isStacked ? "column" : "row",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {/* Kotak input lirik (contentEditable) */}
          <div
            ref={lyricsRef}
            contentEditable
            suppressContentEditableWarning
            className="lyrics-scroll"
            style={{
              width: isStacked ? "100%" : "48%",
              minWidth: 280,
              height: isStacked ? 300 : 600,
              border: "2px solid #ccc",
              padding: 15,
              borderRadius: 10,
              backgroundColor: "#fdfdfd",
              whiteSpace: "pre-wrap",
              overflowY: "auto",
              fontSize: "1em",
              color: "#444",
              lineHeight: 1.8,
            }}
            data-placeholder="Tempel lirik di sini..."
          >
            Tempel lirik di sini...
          </div>

          {/* Kotak tampilan lirik yang sudah diproses */}
          <div
            className="lyrics-scroll"
            style={{
              width: isStacked ? "100%" : "48%",
              minWidth: 280,
              overflow: "auto",
              backgroundColor: bgColor,
              fontSize: `${fontSize}em`,
              lineHeight: 1.6,
              height: isStacked ? 400 : 600,
              border: "1px dashed #ccc",
              padding: 10,
              marginBottom: 10,
              whiteSpace: "pre-wrap",
              fontWeight: "bold",
              scrollBehavior: "smooth",
              position: "relative",
            }}
          >
            {lines.map((line, i) => (
              <span
                key={i}
                className="lyric-span"
                style={{
                  display: "inline-block",
                  padding: 5,
                  paddingBottom: 25,
                  lineHeight: "1.4em",
                  transition: "color 0.2s",
                }}
              >
                {line}
                <br />
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={processLyrics}
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#1db954",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Proses Lirik
        </button>

        <hr
          style={{
            margin: "20px 0",
            border: "none",
            height: 2,
            background: "#ddd",
          }}
        />

        {/* Pengaturan tambahan: warna latar, ukuran font, layout */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              title="Pilih Warna Latar Belakang"
              style={{
                cursor: "pointer",
                width: 50,
                height: 50,
                border: "none",
              }}
            />
            <span style={{ fontSize: "0.9em", color: "#666" }}>
              Warna latar
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label
              htmlFor="font-size"
              style={{ fontSize: "0.9em", color: "#666" }}
            >
              Ukuran font
            </label>
            <input
              id="font-size"
              type="range"
              min={1}
              max={6}
              step={0.5}
              value={fontSize}
              onChange={(e) => setFontSize(parseFloat(e.target.value))}
              style={{ width: 150 }}
            />
            <span style={{ fontSize: "0.9em", color: "#666", minWidth: 40 }}>
              {fontSize}em
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label
              htmlFor="layout"
              style={{ fontSize: "0.9em", color: "#666" }}
            >
              Layout
            </label>
            <select
              id="layout"
              value={layout}
              onChange={(e) => setLayout(e.target.value as Layout)}
              style={{
                padding: "8px 10px",
                border: "1px solid #ccc",
                borderRadius: 8,
                fontSize: "0.9em",
              }}
            >
              <option value="side-by-side">Berdampingan</option>
              <option value="stacked">Bertumpuk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scrollbar disembunyikan (setara scrollbar-width: none) + hover effect span */}
      <style jsx global>{`
        .lyrics-scroll {
          scrollbar-width: none;
        }
        .lyrics-scroll::-webkit-scrollbar {
          display: none;
        }
        .lyric-span:hover {
          color: white;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          .lyrics-scroll {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
