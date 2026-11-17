"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// Color constants based on DESIGN.md (60-30-10 palette)
// Burgundy dominant: #810B38
// Cream secondary: #F1E2D1
// Sand accent: #DCC3AA
// Ink text/depth: #541A1A

// Medical and theme line-art icons (stroke-only, 1.5px stroke, no fill)
function KidneyIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Anatomical kidney outline and ureter */}
      <path d="M24 6C16 6 10 12 10 22C10 32 16 42 24 42C28 42 32 38 34 32C36 26 38 23 38 18C38 10 32 6 24 6Z" />
      <path d="M23 18C20 18 18 21 18 24C18 27 20 29 23 29" />
      <path d="M23 29C25 31 26 35 27 41" />
    </svg>
  );
}

function DropletIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5C12 2.5 5 10.5 5 15.5a7 7 0 0 0 14 0c0-5-7-13-7-13Z" />
    </svg>
  );
}

function StethoscopeIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 6v6a7 7 0 0 0 14 0V6" />
      <path d="M5 6h4M19 6h4" />
      <path d="M14 19v3a5 5 0 0 0 10 0v-4" />
      <circle cx="24" cy="18" r="2.5" />
    </svg>
  );
}

function SparkleMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z" />
    </svg>
  );
}

function PlusMedicalMark({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 2v12M2 8h12" />
    </svg>
  );
}

// 16-point starburst badge representing Angkatan 13
function StarburstBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      aria-label="Badge Angkatan 13"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#DCC3AA] animate-[spin_24s_linear_infinite] motion-reduce:animate-none"
        aria-hidden="true"
      >
        <polygon
          points="
            50,2 62,10 74,6 80,18 92,20 92,33 100,40 95,52 98,65 89,74 
            86,87 73,88 66,98 52,94 40,99 33,90 20,91 17,79 5,74 8,61 
            1,50 8,39 4,26 16,21 18,9 31,10 38,2 50,2
          "
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className="text-[9px] uppercase tracking-wider text-[#F1E2D1] font-semibold"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          Angkatan
        </span>
        <span
          className="text-lg font-extrabold text-[#F1E2D1] leading-none"
          style={{ fontFamily: "var(--font-unbounded, sans-serif)" }}
        >
          13
        </span>
      </div>
    </div>
  );
}

// Contour wave lines representing blood and dialysate flow (16 lines)
function ContourWaveSection() {
  return (
    <div
      className="w-full overflow-hidden py-3 select-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 440 70"
        fill="none"
        className="w-full h-auto text-[#DCC3AA] opacity-50"
      >
        {[...Array(16)].map((_, i) => {
          const yOffset = i * 4.2;
          const amp = 8 + (i % 5) * 2;
          return (
            <path
              key={i}
              d={`M-20 ${10 + yOffset} C 90 ${10 + yOffset + amp}, 210 ${
                10 + yOffset - amp
              }, 330 ${10 + yOffset + amp}, 460 ${10 + yOffset}`}
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity={0.25 + (i / 16) * 0.55}
            />
          );
        })}
      </svg>
    </div>
  );
}

// Thick-thin divider line as specified in DESIGN.md
function ThickThinDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-1.5 w-full my-6 select-none ${className}`}
      aria-hidden="true"
    >
      <div className="h-1.5 w-12 bg-[#DCC3AA]" />
      <div className="h-[1px] flex-1 bg-[#DCC3AA] opacity-60" />
      <div className="w-1.5 h-1.5 rotate-45 bg-[#DCC3AA]" />
    </div>
  );
}

// Diagonal strip accent
function DiagonalStripes({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex gap-1 items-center select-none ${className}`}
      aria-hidden="true"
    >
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className="inline-block w-1 h-3.5 bg-[#DCC3AA] -skew-x-[25deg] opacity-70"
        />
      ))}
    </div>
  );
}

// Main interactive content
function InvitationContent() {
  const searchParams = useSearchParams();
  const rawGuestParam =
    searchParams.get("to") ||
    searchParams.get("nama") ||
    searchParams.get("penerima") ||
    "";
  const guestName = rawGuestParam.trim() || "Bapak / Ibu / Rekan Sejawat";

  const [hasOpened, setHasOpened] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gallery active slide state and duotone toggle
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDuotone, setIsDuotone] = useState(false);

  // MP3 audio reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/foto_undangan/sheila.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Countdown target: 19 November 2026, 13:30 WIB (UTC+7)
  const targetDate = new Date("2026-11-19T13:30:00+07:00").getTime();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const startAmbientAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.play().then(() => {
      setIsPlayingAudio(true);
      setAudioStarted(true);
    }).catch(() => {
      setIsPlayingAudio(false);
    });
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
        setAudioStarted(true);
      }).catch(() => setIsPlayingAudio(false));
    }
  };

  const handleOpenInvitation = () => {
    setHasOpened(true);
    if (!audioStarted) {
      startAmbientAudio();
    }
    // Smooth scroll into main content container
    setTimeout(() => {
      const contentEl = document.getElementById("undangan-utama");
      if (contentEl) {
        contentEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(
      "Tasyakuran Pelatihan Perawat Dialisis Angkatan 13 RS Dr. Soetomo"
    );
    // 19 November 2026 13:30 - 16:30 WIB (UTC+7) = 06:30 - 09:30 UTC
    const dates = "20261119T063000Z/20261119T093000Z";
    const details = encodeURIComponent(
      "Tasyakuran Pelatihan Perawat Dialisis Angkatan 13 Rumah Sakit Dr. Soetomo Surabaya.\n\nKehadiran dan doa restu Anda merupakan kehormatan dan kebahagiaan bagi kami."
    );
    const location = encodeURIComponent(
      "Lantai 3 Instalasi Dialisis, RSUD Dr. Soetomo Surabaya, Jl. Mayjen Prof. Dr. Moestopo No. 6-8, Surabaya, Jawa Timur"
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // Download real iCalendar file (.ics)
  const handleDownloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//RS Dr. Soetomo//Pelatihan Perawat Dialisis Angkatan 13//ID",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:tasyakuran-dialisis-13-20261119@rsudsoetomo.id",
      "DTSTAMP:20261111T000000Z",
      "DTSTART:20261119T063000Z",
      "DTEND:20261119T093000Z",
      "SUMMARY:Tasyakuran Pelatihan Perawat Dialisis Angkatan 13 RS Dr. Soetomo",
      "DESCRIPTION:Tasyakuran Pelatihan Perawat Dialisis Angkatan 13 Rumah Sakit Dr. Soetomo Surabaya.",
      "LOCATION:Lantai 3 Instalasi Dialisis, RSUD Dr. Soetomo Surabaya, Jl. Mayjen Prof. Dr. Moestopo No. 6-8, Surabaya",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Tasyakuran-Dialisis-Angkatan-13.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("File kalender (.ics) berhasil diunduh.");
  };

  // Web Share or Clipboard Copy
  const handleShare = async () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: "Undangan Tasyakuran Pelatihan Perawat Dialisis Angkatan 13",
      text: "Undangan resmi Tasyakuran Pelatihan Perawat Dialisis Angkatan 13 RS Dr. Soetomo Surabaya.",
      url: currentUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("Undangan berhasil dibagikan.");
        return;
      } catch {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(currentUrl);
      showToast("Tautan undangan berhasil disalin ke papan klip.");
    }
  };

  // Gallery documentation photos from public/foto_undangan (1.jpeg - 7.jpeg)
  const galleryPhotos = [
    {
      src: "1.jpeg",
      title: "Dokumentasi Praktik & Kebersamaan",
      category: "Praktik Klinis",
      desc: "Momen proses pembelajaran dan praktik klinis hemodialisis Angkatan 13.",
    },
    {
      src: "2.jpeg",
      title: "Kegiatan Pelatihan Dialisis",
      category: "Aktivitas Pelatihan",
      desc: "Aktivitas pelatihan di Instalasi Dialisis RSUD Dr. Soetomo Surabaya.",
    },
    {
      src: "3.jpeg",
      title: "Praktik Keterampilan Klinis",
      category: "Keterampilan Klinis",
      desc: "Pendalaman teknik dan prosedur asuhan keperawatan dialisis.",
    },
    {
      src: "4.jpeg",
      title: "Sesi Pembelajaran Kelas",
      category: "Kelas Teori",
      desc: "Diskusi dan bimbingan bersama dokter spesialis dan instruktur.",
    },
    {
      src: "5.jpeg",
      title: "Keluarga Besar Angkatan 13",
      category: "Kebersamaan",
      desc: "Persaudaraan dan kebersamaan seluruh peserta pelatihan perawat dialisis.",
    },
    {
      src: "6.jpeg",
      title: "Momen Kebersamaan Pelatihan",
      category: "Dedikasi",
      desc: "Dedikasi dan semangat belajar tenaga keperawatan nefrologi.",
    },
    {
      src: "7.jpeg",
      title: "Kenangan Angkatan 13",
      category: "Kenangan",
      desc: "Langkah awal mengabdi dengan kompetensi keperawatan dialisis terbaik.",
    },
  ];

  return (
    <div className="w-full flex justify-center bg-[#541A1A] min-h-screen text-[#F1E2D1]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 z-50 px-4 py-2.5 bg-[#F1E2D1] text-[#541A1A] text-xs font-semibold uppercase tracking-wider shadow-lg border border-[#810B38] animate-fade-in"
        >
          {toastMessage}
        </div>
      )}

      {/* Floating Audio Button */}
      <button
        onClick={toggleAudio}
        aria-label={
          isPlayingAudio ? "Heningkan audio latar" : "Putar audio latar"
        }
        className="fixed top-4 right-4 z-40 w-11 h-11 bg-[#F1E2D1] text-[#810B38] border border-[#810B38] flex items-center justify-center shadow-md hover:bg-[#DCC3AA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1E2D1] transition-colors"
      >
        {isPlayingAudio ? (
          <span className="flex items-center gap-0.5" aria-hidden="true">
            <span className="w-1 h-4 bg-[#810B38] animate-pulse" />
            <span className="w-1 h-3 bg-[#810B38] animate-pulse delay-75" />
            <span className="w-1 h-5 bg-[#810B38] animate-pulse delay-150" />
          </span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>

      {/* Main Single Mobile-First Container (max 480px, bg #810B38) */}
      <main className="w-full max-w-[480px] bg-[#810B38] text-[#F1E2D1] min-h-screen relative flex flex-col shadow-2xl">
        {/* ============================================================== */}
        {/* 0) COVER / HERO SECTION (min-h-[100svh])                       */}
        {/* ============================================================== */}
        <section
          aria-label="Sampul Undangan"
          className="min-h-[100svh] px-5 py-8 flex flex-col justify-between relative border-b border-[#DCC3AA]/25"
        >
          {/* Top Bar: Institution Logo Marker & Starburst Badge */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#DCC3AA]">
                Rumah Sakit Dr. Soetomo
              </span>
              <span className="text-xs uppercase font-medium tracking-wider text-[#F1E2D1] mt-0.5">
                Surabaya, Jawa Timur
              </span>
            </div>
            <StarburstBadge />
          </div>

          {/* Guest Greeting Box */}
          <div className="my-3 py-3 px-4 border-l-2 border-[#DCC3AA] bg-[#541A1A]/30">
            <p className="text-[11px] uppercase tracking-widest text-[#DCC3AA] font-semibold">
              Kepada Yth.
            </p>
            <h2 className="text-lg font-bold text-[#F1E2D1] tracking-wide mt-0.5 break-words">
              {guestName}
            </h2>
            <p className="text-[11px] text-[#DCC3AA]/80 mt-1">
              Di Tempat
            </p>
          </div>

          {/* Echo Headline Block */}
          <div className="my-2 select-none">
            <div className="flex flex-col">
              {/* Echo Layer 1 (Top cut) */}
              <span
                aria-hidden="true"
                className="font-extrabold uppercase text-[#F1E2D1] opacity-35 leading-[0.82] tracking-tight"
                style={{
                  fontFamily: "var(--font-unbounded, sans-serif)",
                  fontSize: "clamp(2rem, 11vw, 2.75rem)",
                  clipPath: "inset(48% 0 0 0)",
                  marginBottom: "-0.06em",
                }}
              >
                TASYAKURAN
              </span>

              {/* Echo Layer 2 (Primary headline) */}
              <h1
                className="font-extrabold uppercase text-[#F1E2D1] leading-[0.82] tracking-tight"
                style={{
                  fontFamily: "var(--font-unbounded, sans-serif)",
                  fontSize: "clamp(2rem, 11vw, 2.75rem)",
                }}
              >
                TASYAKURAN
              </h1>

              {/* Echo Layer 3 (Bottom cut with melt gradient mask) */}
              <span
                aria-hidden="true"
                className="font-extrabold uppercase text-[#F1E2D1] opacity-35 leading-[0.82] tracking-tight"
                style={{
                  fontFamily: "var(--font-unbounded, sans-serif)",
                  fontSize: "clamp(2rem, 11vw, 2.75rem)",
                  clipPath: "inset(0 0 52% 0)",
                  marginTop: "-0.04em",
                  maskImage:
                    "linear-gradient(to bottom, #000 40%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, #000 40%, transparent 100%)",
                }}
              >
                TASYAKURAN
              </span>
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold tracking-wide text-[#F1E2D1] uppercase">
                Pelatihan Perawat Dialisis Angkatan 13
              </p>
              <p className="text-xs text-[#DCC3AA] mt-1 font-medium">
                Pusat Pembinaan & Pelatihan Keperawatan Nefrologi
              </p>
            </div>
          </div>

          {/* Contour Wave Lines Divider */}
          <ContourWaveSection />

          {/* Big Date Block & Open Button */}
          <div className="mt-2 flex flex-col gap-4">
            <div className="flex items-baseline justify-between border-t border-[#DCC3AA]/30 pt-3">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-4xl font-extrabold text-[#DCC3AA] leading-none"
                  style={{ fontFamily: "var(--font-unbounded, sans-serif)" }}
                >
                  19
                </span>
                <span className="text-2xl font-light text-[#DCC3AA]/70">/</span>
                <span
                  className="text-4xl font-extrabold text-[#DCC3AA] leading-none"
                  style={{ fontFamily: "var(--font-unbounded, sans-serif)" }}
                >
                  11
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-[#F1E2D1]">
                  Kamis
                </p>
                <p className="text-xs text-[#DCC3AA] font-medium tracking-wide">
                  Tahun 2026
                </p>
              </div>
            </div>

            {/* Primary Action Button (Cream on Burgundy) */}
            <button
              onClick={handleOpenInvitation}
              className="w-full h-[52px] bg-[#F1E2D1] text-[#810B38] font-bold text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 hover:bg-[#DCC3AA] active:bg-[#DCC3AA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1E2D1] transition-all cursor-pointer shadow-md rounded-[2px]"
            >
              <span>{hasOpened ? "GULIR KE ISI UNDANGAN" : "BUKA UNDANGAN"}</span>
              <SparkleMark className="w-3.5 h-3.5 text-[#810B38]" />
            </button>

            {/* Thick-thin segment indicator */}
            <div className="flex items-center gap-1.5 opacity-80" aria-hidden="true">
              <span className="h-1.5 w-12 bg-[#DCC3AA]" />
              <span className="h-[1px] flex-1 bg-[#DCC3AA]/50" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* MAIN BODY CONTENT (Revealed and accessible)                    */}
        {/* ============================================================== */}
        <div id="undangan-utama" className="flex flex-col">
          {/* ============================================================ */}
          {/* 1) PEMBUKA (Salam & Rasa Syukur)                             */}
          {/* ============================================================ */}
          <section
            aria-label="Kata Pembuka"
            className="px-5 py-12 flex flex-col items-center text-center relative border-b border-[#DCC3AA]/20"
          >
            <div className="p-3 border border-[#DCC3AA]/40 text-[#DCC3AA] mb-4 rounded-[2px]">
              <KidneyIcon className="w-7 h-7" />
            </div>

            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#DCC3AA]">
              Rasa Syukur & Doa
            </span>

            <p className="text-sm leading-relaxed text-[#F1E2D1] max-w-[380px] mt-3 font-normal">
              Dengan penuh rasa syukur, kami mengundang Anda untuk berbagi
              kebahagiaan atas selesainya perjalanan belajar Pelatihan Perawat
              Dialisis Angkatan 13 di Rumah Sakit Dr. Soetomo Surabaya.
            </p>

            <div className="flex items-center gap-2 text-[#DCC3AA] text-xs font-medium mt-4">
              <PlusMedicalMark />
              <span>Komitmen Pelayanan Hemodialisis Profesional</span>
              <PlusMedicalMark />
            </div>
          </section>

          {/* ============================================================ */}
          {/* 2) DETAIL ACARA (Kartu Krem dengan Offset Outline)           */}
          {/* ============================================================ */}
          <section aria-label="Detail Acara" className="px-5 py-12">
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#DCC3AA]">
                Informasi Pelaksanaan
              </span>
              <h2
                className="text-xl font-bold uppercase text-[#F1E2D1] mt-1"
                style={{ fontFamily: "var(--font-unbounded, sans-serif)" }}
              >
                Detail Acara
              </h2>
            </div>

            {/* Cream Card with Burgundy Border and 4px crisp offset outline */}
            <div className="bg-[#F1E2D1] text-[#541A1A] p-6 border border-[#810B38] shadow-[4px_4px_0px_0px_#541A1A] rounded-[2px]">
              <div className="flex items-center justify-between border-b border-[#810B38]/30 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <SparkleMark className="w-4 h-4 text-[#810B38]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#810B38]">
                    Jadwal & Lokasi
                  </span>
                </div>
                <DiagonalStripes />
              </div>

              {/* Two-column info layout with vertical line separator */}
              <div className="flex flex-col divide-y divide-[#810B38]/20 text-xs">
                {/* Row: Hari & Tanggal */}
                <div className="grid grid-cols-[80px_1px_1fr] gap-3 py-3 items-baseline">
                  <span className="font-bold uppercase tracking-wide text-[#810B38]">
                    Hari / Tgl
                  </span>
                  <span className="w-full h-full bg-[#810B38]/20" aria-hidden="true" />
                  <div className="text-[#541A1A]">
                    <p className="font-bold text-sm">Kamis, 19 November 2026</p>
                    <p className="text-[11px] text-[#541A1A]/80 mt-0.5">
                      {/* Kalender Masehi */}
                    </p>
                  </div>
                </div>

                {/* Row: Waktu */}
                <div className="grid grid-cols-[80px_1px_1fr] gap-3 py-3 items-baseline">
                  <span className="font-bold uppercase tracking-wide text-[#810B38]">
                    Waktu
                  </span>
                  <span className="w-full h-full bg-[#810B38]/20" aria-hidden="true" />
                  <div className="text-[#541A1A]">
                    <p className="font-bold text-sm">
                      13.30 WIB
                    </p>
                    <p className="text-[11px] text-[#541A1A]/80 mt-0.5">
                      Diharapkan hadir 15 menit sebelum acara dimulai
                    </p>
                  </div>
                </div>

                {/* Row: Tempat */}
                <div className="grid grid-cols-[80px_1px_1fr] gap-3 py-3 items-baseline">
                  <span className="font-bold uppercase tracking-wide text-[#810B38]">
                    Tempat
                  </span>
                  <span className="w-full h-full bg-[#810B38]/20" aria-hidden="true" />
                  <div className="text-[#541A1A]">
                    <p className="font-bold text-sm leading-snug">
                      Lantai 3 Instalasi Dialisis
                    </p>
                    <p className="text-[11px] text-[#541A1A]/80 mt-0.5 leading-relaxed">
                      RSUD Dr. Soetomo Surabaya, Jl. Mayjen Prof. Dr. Moestopo No.
                      6-8, Gubeng, Surabaya
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons on Cream Card (Burgundy Primary & Secondary) */}
              <div className="flex flex-col gap-2.5 mt-6 pt-4 border-t border-[#810B38]/30">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-[#810B38] text-[#F1E2D1] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#541A1A] active:bg-[#541A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#810B38] transition-colors rounded-[2px]"
                >
                  <SparkleMark className="w-3.5 h-3.5 text-[#F1E2D1]" />
                  <span>Simpan ke Google Calendar</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDownloadIcs}
                    className="h-11 bg-transparent text-[#810B38] border border-[#810B38] font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center hover:bg-[#810B38]/10 active:bg-[#810B38]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#810B38] transition-colors rounded-[2px]"
                  >
                    Unduh Kalender (.ics)
                  </button>

                  <a
                    href="https://maps.google.com/?q=RSUD+Dr.+Soetomo+Surabaya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 bg-transparent text-[#810B38] border border-[#810B38] font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center hover:bg-[#810B38]/10 active:bg-[#810B38]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#810B38] transition-colors rounded-[2px]"
                  >
                    Buka Google Maps
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 3) HITUNG MUNDUR (Countdown 4 Box Outline)                   */}
          {/* ============================================================ */}
          <section
            aria-label="Hitung Mundur Waktu Acara"
            className="px-5 py-8 border-y border-[#DCC3AA]/25 bg-[#541A1A]/35 text-center"
          >
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <DropletIcon className="w-4 h-4 text-[#DCC3AA]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#DCC3AA]">
                Menuju Hari Tasyakuran
              </span>
              <DropletIcon className="w-4 h-4 text-[#DCC3AA]" />
            </div>

            <p className="text-xs text-[#F1E2D1]/80 mb-5 font-normal">
              Kamis, 19 November 2026 pukul 13.30 WIB
            </p>

            {timeLeft.isPast ? (
              <div className="p-4 border border-[#DCC3AA] bg-[#541A1A]/50">
                <p
                  className="text-base font-bold text-[#F1E2D1] uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-unbounded, sans-serif)" }}
                >
                  Acara Telah Berlangsung
                </p>
                <p className="text-xs text-[#DCC3AA] mt-1">
                  Terima kasih atas doa restu dan partisipasi Anda.
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-4 gap-2 max-w-[360px] mx-auto"
                aria-live="off"
              >
                {/* Hari */}
                <div className="border border-[#DCC3AA] py-3 px-1 flex flex-col items-center bg-[#810B38]/60 rounded-[2px]">
                  <span
                    className="text-2xl font-extrabold text-[#DCC3AA] leading-none"
                    style={{ fontFamily: "var(--font-unbounded, sans-serif)" }}
                  >
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#F1E2D1] mt-2">
                    Hari
                  </span>
                </div>

                {/* Jam */}
                <div className="border border-[#DCC3AA] py-3 px-1 flex flex-col items-center bg-[#810B38]/60 rounded-[2px]">
                  <span
                    className="text-2xl font-extrabold text-[#DCC3AA] leading-none"
                    style={{ fontFamily: "var(--font-unbounded, sans-serif)" }}
                  >
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#F1E2D1] mt-2">
                    Jam
                  </span>
                </div>

                {/* Menit */}
                <div className="border border-[#DCC3AA] py-3 px-1 flex flex-col items-center bg-[#810B38]/60 rounded-[2px]">
                  <span
                    className="text-2xl font-extrabold text-[#DCC3AA] leading-none"
                    style={{ fontFamily: "var(--font-unbounded, sans-serif)" }}
                  >
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#F1E2D1] mt-2">
                    Menit
                  </span>
                </div>

                {/* Detik */}
                <div className="border border-[#DCC3AA] py-3 px-1 flex flex-col items-center bg-[#810B38]/60 rounded-[2px]">
                  <span
                    className="text-2xl font-extrabold text-[#DCC3AA] leading-none"
                    style={{ fontFamily: "var(--font-unbounded, sans-serif)" }}
                  >
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#F1E2D1] mt-2">
                    Detik
                  </span>
                </div>
              </div>
            )}
          </section>



          {/* ============================================================ */}
          {/* 4) KENANGAN ANGKATAN 13 (Galeri Dokumentasi Foto)            */}
          {/* ============================================================ */}
          <section
            aria-label="Dokumentasi Pelatihan Angkatan 13"
            className="px-5 py-12 border-t border-[#DCC3AA]/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#DCC3AA]">
                  Dokumentasi Kegiatan
                </span>
                <h2
                  className="text-xl font-bold uppercase text-[#F1E2D1] mt-0.5"
                  style={{ fontFamily: "var(--font-unbounded, sans-serif)" }}
                >
                  Kenangan Angkatan 13
                </h2>
              </div>
              <div className="px-2.5 py-1 border border-[#DCC3AA] text-[10px] uppercase font-bold text-[#DCC3AA] tracking-wider rounded-[2px]">
                {galleryPhotos.length} Foto
              </div>
            </div>

            <p className="text-xs text-[#F1E2D1]/80 mb-5 leading-relaxed font-normal">
              Perjalanan dedikasi, pembelajaran klinis, dan persaudaraan selama
              menempuh pelatihan perawat dialisis di RS Dr. Soetomo.
            </p>

            {/* Main Spotlight Card */}
            <div className="relative overflow-hidden border border-[#DCC3AA]/50 bg-[#541A1A] p-4 sm:p-5 shadow-lg rounded-[2px]">
              {/* Card Header: Category Tag, Duotone Toggle, and Stripes */}
              <div className="flex items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2.5 py-0.5 bg-[#810B38] text-[#F1E2D1] text-[10px] uppercase font-bold tracking-wider border border-[#DCC3AA]/40 rounded-[2px]">
                    {galleryPhotos[activeSlide].category}
                  </span>
                  <span className="text-[10px] text-[#DCC3AA] font-semibold">
                    Foto {activeSlide + 1} dari {galleryPhotos.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsDuotone(!isDuotone)}
                    className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border border-[#DCC3AA]/60 text-[#F1E2D1] hover:bg-[#DCC3AA]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1E2D1] transition-colors rounded-[2px]"
                  >
                    {isDuotone ? "Warna Asli" : "Filter Duotone"}
                  </button>
                  <DiagonalStripes className="hidden sm:flex" />
                </div>
              </div>

              {/* Photo Display Frame (Aspect 3:2 Landscape matching 1280x854) */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#810B38] border border-[#DCC3AA]/30 rounded-[2px]">
                <Image
                  src={`/foto_undangan/${galleryPhotos[activeSlide].src}`}
                  alt={galleryPhotos[activeSlide].title}
                  width={1280}
                  height={854}
                  priority={activeSlide === 0}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isDuotone
                      ? "grayscale contrast-125 brightness-95"
                      : "contrast-105"
                  }`}
                />

                {/* Duotone Overlay Layer (Burgundy lighten & Cream multiply) */}
                {isDuotone && (
                  <>
                    <div
                      className="absolute inset-0 bg-[#810B38] mix-blend-lighten pointer-events-none"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute inset-0 bg-[#F1E2D1] mix-blend-multiply opacity-80 pointer-events-none"
                      aria-hidden="true"
                    />
                  </>
                )}

                {/* Corner watermark badge */}
                <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-[#541A1A]/80 backdrop-blur-xs border border-[#DCC3AA]/40 text-[9px] uppercase font-bold tracking-widest text-[#F1E2D1] rounded-[2px]">
                  RSUD Dr. Soetomo
                </div>
              </div>

              {/* Caption and Information */}
              <div className="mt-3">
                <h3
                  className="text-sm sm:text-base font-extrabold text-[#F1E2D1] uppercase tracking-wide leading-snug"
                  style={{ fontFamily: "var(--font-unbounded, sans-serif)" }}
                >
                  {galleryPhotos[activeSlide].title}
                </h3>
                <p className="text-xs text-[#DCC3AA] mt-1 leading-relaxed">
                  {galleryPhotos[activeSlide].desc}
                </p>
              </div>

              {/* Navigation Controls: Prev, Next & Thumbnails */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#DCC3AA]/25">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setActiveSlide((prev) =>
                        prev === 0 ? galleryPhotos.length - 1 : prev - 1
                      )
                    }
                    aria-label="Foto sebelumnya"
                    className="h-9 px-3 border border-[#DCC3AA] text-[#F1E2D1] text-xs font-semibold flex items-center justify-center gap-1 hover:bg-[#DCC3AA]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1E2D1] transition-colors rounded-[2px]"
                  >
                    &larr; <span>Sebelumnya</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveSlide((prev) =>
                        prev === galleryPhotos.length - 1 ? 0 : prev + 1
                      )
                    }
                    aria-label="Foto berikutnya"
                    className="h-9 px-3 border border-[#DCC3AA] text-[#F1E2D1] text-xs font-semibold flex items-center justify-center gap-1 hover:bg-[#DCC3AA]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1E2D1] transition-colors rounded-[2px]"
                  >
                    <span>Berikutnya</span> &rarr;
                  </button>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#DCC3AA]">
                  {activeSlide + 1} / {galleryPhotos.length}
                </span>
              </div>

              {/* Thumbnail Strip: Jump to Any of the 7 Photos */}
              <div className="mt-3 pt-3 border-t border-[#DCC3AA]/20">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#DCC3AA] mb-2">
                  Pilih Foto:
                </p>
                <div className="grid grid-cols-7 gap-1.5">
                  {galleryPhotos.map((photo, idx) => (
                    <button
                      key={photo.src}
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Lihat foto ${idx + 1}: ${photo.title}`}
                      className={`relative aspect-[3/2] overflow-hidden rounded-[2px] transition-all cursor-pointer ${
                        activeSlide === idx
                          ? "ring-2 ring-[#F1E2D1] border border-white opacity-100 scale-105"
                          : "opacity-60 hover:opacity-90 border border-[#DCC3AA]/30"
                      }`}
                    >
                      <Image
                        src={`/foto_undangan/${photo.src}`}
                        alt={photo.title}
                        width={128}
                        height={85}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 5) BAGIKAN UNDANGAN                                          */}
          {/* ============================================================ */}
          <section
            aria-label="Bagikan Tautan Undangan"
            className="px-5 py-6 bg-[#541A1A]/40 border-y border-[#DCC3AA]/25 text-center"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#DCC3AA]">
              Berbagi Tautan
            </span>
            <p className="text-xs text-[#F1E2D1] mt-1 mb-4">
              Bagikan undangan ini kepada rekan sejawat dan keluarga.
            </p>

            <button
              onClick={handleShare}
              className="h-12 px-6 bg-[#DCC3AA] text-[#541A1A] font-bold text-xs uppercase tracking-wider hover:bg-[#F1E2D1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1E2D1] transition-colors rounded-[2px] mx-auto flex items-center justify-center gap-2"
            >
              <SparkleMark className="w-3.5 h-3.5" />
              <span>Salin atau Bagikan Undangan</span>
            </button>
          </section>

          {/* ============================================================ */}
          {/* 6) PENUTUP & FOOTER                                          */}
          {/* ============================================================ */}
          <footer
            aria-label="Penutup Undangan"
            className="px-5 pt-12 pb-16 text-center flex flex-col items-center bg-[#810B38]"
          >
            <div className="p-3 border border-[#DCC3AA]/40 text-[#DCC3AA] mb-4 rounded-[2px]">
              <StethoscopeIcon className="w-7 h-7" />
            </div>

            <p className="text-xs text-[#DCC3AA] uppercase tracking-widest font-bold">
              Ucapan Terima Kasih
            </p>

            <p className="text-sm text-[#F1E2D1] leading-relaxed max-w-[360px] mt-3 font-normal">
              Terima kasih telah menjadi bagian dari perjalanan kami. Kehadiran
              dan doa restu Anda merupakan kehormatan yang mendalam bagi kami.
            </p>

            <div className="my-6">
              <p
                className="text-sm font-extrabold uppercase text-[#F1E2D1] tracking-wide"
                style={{ fontFamily: "var(--font-unbounded, sans-serif)" }}
              >
                Panitia Pelatihan Perawat Dialisis
              </p>
              <p className="text-xs text-[#DCC3AA] font-semibold mt-0.5">
                Angkatan 13 · RSUD Dr. Soetomo Surabaya
              </p>
            </div>

            <ThickThinDivider className="max-w-[280px]" />

            <div className="text-[11px] text-[#DCC3AA]/70 space-y-1">
              <p>Kamis, 19 November 2026 · Surabaya, Indonesia</p>
              <p className="text-[10px]">
                Dokumen undangan digital resmi berbasis web
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

// Fallback skeleton loader for Suspense
function InvitationFallback() {
  return (
    <div className="min-h-screen bg-[#541A1A] flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] bg-[#810B38] text-[#F1E2D1] p-8 text-center border border-[#DCC3AA]/30">
        <div className="w-8 h-8 border-2 border-[#DCC3AA] border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-xs uppercase tracking-widest font-bold text-[#DCC3AA]">
          Memuat Undangan Digital...
        </p>
      </div>
    </div>
  );
}

export default function InvitationPage() {
  return (
    <Suspense fallback={<InvitationFallback />}>
      <InvitationContent />
    </Suspense>
  );
}
