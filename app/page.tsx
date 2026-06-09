"use client";
import { useState } from "react";

const PROJECTS = [
  {
    id: 1,
    title: "Sistem Informasi Bantuan Sosial",
    company: "Dinas Sosial Kota Surabaya",
    link: "https://dbhcht-dinsos.surabaya.go.id/",
    desc: "Aplikasi untuk mencatat transaksi penyaluran bantuan sosial oleh Dinas Sosial Kota Surabaya, mencakup bantuan berupa Uang Tunai, Peralatan Modal Usaha, dan Alat Bantu Disabilitas.",
  },
  {
    id: 2,
    title: "Monitoring Penggunaan Bantuan Modal Usaha",
    company: "Dinas Sosial Kota Surabaya",
    link: "https://dbhcht-dinsos.surabaya.go.id/",
    desc: "Aplikasi untuk memonitoring penggunaan Bantuan Peralatan Modal Usaha, bertujuan mengetahui efektifitas bantuan terhadap sosial ekonomi penerima.",
  },
  {
    id: 3,
    title: "Aplikasi Inventory Gudang",
    company: "PT. Ayama",
    link: "https://pt-ayama.co.id/",
    desc: "Aplikasi untuk mengelola stok barang dalam gudang serta mencatat transaksi barang keluar dan barang masuk.",
  },
  {
    id: 4,
    title: "OCEAN – Operational Control, Evaluation & Analytics Network",
    company: "Pertamina Port and Logistic Surabaya",
    link: "https://ocean-ppl.com/",
    desc: "Aplikasi untuk controlling, evaluasi, dan analisa kegiatan dalam Port (pelabuhan) serta memonitoring kelengkapan sarana dan prasarana unit kapal.",
  },
  {
    id: 5,
    title: "ScoreKeeper",
    company: "Personal Project",
    link: "/scorekeeper",
    desc: "Aplikasi untuk menghitung skor permainan kartu jenis Remy / Gin / Jokeran.",
  },
  {
    id: 6,
    title: "Karaoke Lyric",
    company: "Personal Project",
    link: "#",
    desc: "Aplikasi untuk menampilkan lirik yang digunakan pada acara live music (sing-along).",
  },
];

const SKILLS = [
  {
    label: "Programming",
    value: "PHP, JavaScript, Java · Laravel, Livewire, Vue.js, React.js · HTML, CSS",
  },
  { label: "Database", value: "MySQL, PostgreSQL" },
  { label: "Data Analytics", value: "SQL, Microsoft Excel" },
  {
    label: "Dev Tools",
    value: "Git, Navicat, VS Code, Composer, Laragon, Node.js",
  },
  { label: "Office", value: "Excel, Word, PowerPoint, Visio" },
  { label: "Languages", value: "Indonesia (Native), English" },
];

export default function Home() {
  const [openProjects, setOpenProjects] = useState<Set<number>>(
    new Set(PROJECTS.map((p) => p.id)),
  );

  const toggleProject = (id: number) => {
    setOpenProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        .pf-body {
          font-family: 'Inter', system-ui, sans-serif;
          background: #f8f7f4;
          color: #1a1a1a;
          min-height: 100vh;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        /* ── NAV ── */
        .pf-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(248, 247, 244, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
        }

        .pf-nav-brand {
          font-weight: 800;
          font-size: 15px;
          letter-spacing: -0.3px;
          color: #1a1a1a;
          text-decoration: none;
        }

        .pf-nav-links {
          display: flex;
          align-items: center;
          gap: 18px;
          list-style: none;
        }

        .pf-nav-links a {
          color: #555;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }
        .pf-nav-links a:hover { color: #1a1a1a; }

        .pf-nav-links .icon-link svg {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }

        .pf-nav-pdf-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #ffffff;
          border: none;
          padding: 6px 14px;
          border-radius: 99px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
          outline: none;
        }
        .pf-nav-pdf-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
          background: linear-gradient(135deg, #4f46e5, #4338ca);
        }
        .pf-nav-pdf-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.15);
        }
        .pf-nav-pdf-btn svg {
          width: 14px;
          height: 14px;
          fill: currentColor;
          flex-shrink: 0;
        }

        /* ── PRINT MEDIA QUERY ── */
        @media print {
          .pf-nav,
          .pf-footer,
          .project-chevron {
            display: none !important;
          }

          .pf-body {
            background: #ffffff !important;
            color: #000000 !important;
          }

          .pf-main {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .project-body {
            display: block !important;
            padding-left: 20px !important;
            margin-top: 6px !important;
          }

          .project-header {
            cursor: default !important;
            pointer-events: none !important;
            padding: 6px 0 !important;
          }

          .project-item {
            border: none !important;
            border-bottom: 1px dashed #e5e7eb !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: transparent !important;
            margin-bottom: 12px !important;
            padding-bottom: 12px !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .project-item:hover {
            box-shadow: none !important;
          }

          .exp-item,
          .edu-item,
          .skill-row {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .pf-section {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 24px !important;
            padding-bottom: 24px !important;
          }

          .pf-section-heading {
            border-bottom: 1px solid #e5e7eb !important;
            padding-bottom: 4px !important;
            margin-bottom: 14px !important;
          }

          .pf-hero {
            border-bottom: 1px solid #e5e7eb !important;
            margin-bottom: 24px !important;
            padding-bottom: 20px !important;
          }

          .pf-hero-eyebrow {
            border: 1px solid #16a34a !important;
            background: transparent !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }

        /* ── MAIN LAYOUT ── */
        .pf-main {
          max-width: 760px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* ── HERO ── */
        .pf-hero {
          margin-bottom: 40px;
          padding-bottom: 32px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .pf-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #16a34a;
          background: #dcfce7;
          padding: 3px 10px;
          border-radius: 99px;
          letter-spacing: 0.4px;
          margin-bottom: 14px;
        }

        .pf-hero-eyebrow::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #16a34a;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .pf-name {
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1.1;
          color: #111;
          margin-bottom: 10px;
        }

        .pf-contact-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          font-size: 13px;
          color: #555;
          margin-bottom: 20px;
        }

        .pf-contact-row a {
          color: #555;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: color 0.2s;
        }
        .pf-contact-row a:hover { color: #1a1a1a; }

        .pf-contact-row svg {
          width: 14px;
          height: 14px;
          fill: currentColor;
          flex-shrink: 0;
        }

        .pf-dot { color: #ccc; }

        .pf-bio {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pf-bio p {
          font-size: 15px;
          color: #444;
          line-height: 1.7;
        }

        /* ── SECTION ── */
        .pf-section {
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        .pf-section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .pf-section-heading {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #9ca3af;
          margin-bottom: 20px;
        }

        /* ── EXPERIENCE ── */
        .exp-item {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2px 16px;
          margin-bottom: 24px;
        }
        .exp-item:last-child { margin-bottom: 0; }

        .exp-role {
          font-size: 15px;
          font-weight: 700;
          color: #111;
          line-height: 1.3;
          grid-column: 1;
        }

        .exp-company {
          font-size: 13px;
          color: #555;
          font-weight: 500;
          grid-column: 1;
          margin-bottom: 6px;
        }

        .exp-period {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
          grid-column: 2;
          grid-row: 1 / 3;
          align-self: start;
          white-space: nowrap;
          padding-top: 2px;
        }

        .exp-list {
          grid-column: 1 / -1;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .exp-list li {
          font-size: 14px;
          color: #555;
          padding-left: 16px;
          position: relative;
          line-height: 1.55;
        }

        .exp-list li::before {
          content: '·';
          position: absolute;
          left: 4px;
          color: #9ca3af;
          font-weight: 700;
        }

        /* ── SKILLS ── */
        .skill-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skill-row {
          display: flex;
          gap: 10px;
          align-items: baseline;
          flex-wrap: wrap;
        }

        .skill-label {
          font-size: 12px;
          font-weight: 700;
          color: #374151;
          min-width: 110px;
          flex-shrink: 0;
        }

        .skill-value {
          font-size: 13px;
          color: #555;
          line-height: 1.5;
        }

        /* ── PROJECTS ── */
        .project-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .project-item {
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
          transition: box-shadow 0.2s;
        }
        .project-item:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.07); }

        .project-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          cursor: pointer;
          user-select: none;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
        }

        .project-chevron {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          transition: transform 0.2s ease;
          fill: #9ca3af;
        }
        .project-chevron.open { transform: rotate(90deg); }

        .project-title-wrap {
          flex: 1;
          min-width: 0;
        }

        .project-title {
          font-size: 14px;
          font-weight: 600;
          color: #111;
          line-height: 1.35;
        }

        .project-company {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 400;
          margin-top: 1px;
        }

        .project-link {
          font-size: 12px;
          font-weight: 500;
          color: #6366f1;
          text-decoration: none;
          flex-shrink: 0;
          padding: 3px 8px;
          border-radius: 6px;
          background: rgba(99,102,241,0.06);
          transition: background 0.2s;
        }
        .project-link:hover { background: rgba(99,102,241,0.14); }

        .project-body {
          font-size: 13px;
          color: #555;
          line-height: 1.6;
          padding: 0 14px 12px 40px;
          display: none;
        }
        .project-body.open { display: block; }

        /* ── EDUCATION ── */
        .edu-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 14px;
        }
        .edu-item:last-child { margin-bottom: 0; }

        .edu-degree {
          font-size: 14px;
          font-weight: 600;
          color: #111;
        }

        .edu-school {
          font-size: 13px;
          color: #555;
        }

        .edu-period {
          font-size: 12px;
          color: #9ca3af;
        }

        /* ── FOOTER ── */
        .pf-footer {
          text-align: center;
          font-size: 12px;
          color: #9ca3af;
          padding: 24px;
          border-top: 1px solid rgba(0,0,0,0.06);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 600px) {
          .pf-nav { padding: 12px 16px; }
          .pf-main { padding: 32px 16px 60px; }

          .pf-name { letter-spacing: -1px; }

          .pf-contact-row { gap: 8px; font-size: 12px; }

          .exp-item { grid-template-columns: 1fr; }
          .exp-period { grid-column: 1; grid-row: auto; }

          .skill-label { min-width: 90px; font-size: 11px; }

          .project-title { font-size: 13px; }
          .project-link { display: none; }
        }
      `}</style>

      <div className="pf-body">
        {/* Nav */}
        <nav className="pf-nav">
          <span className="pf-nav-brand">SULLTAN</span>
          <ul className="pf-nav-links">
            <li>
              <button
                onClick={() => window.print()}
                className="pf-nav-pdf-btn"
                title="Unduh PDF"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" />
                </svg>
                <span>Unduh PDF</span>
              </button>
            </li>
            <li>
              <a href="mailto:sultaninot@gmail.com" className="icon-link" title="Email">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/sultan-aulia-7927901b5/" target="_blank" rel="noopener noreferrer" className="icon-link" title="LinkedIn">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/sull_a.a" target="_blank" rel="noopener noreferrer" className="icon-link" title="Instagram">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
            </li>
          </ul>
        </nav>

        {/* Main */}
        <main className="pf-main">

          {/* Hero */}
          <div className="pf-hero">
            <div className="pf-hero-eyebrow">Open to opportunities</div>
            <h1 className="pf-name">Sultan Aulia Alfarizki</h1>
            <div className="pf-contact-row">
              <a href="mailto:sultaninot@gmail.com">
                <svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
                sultaninot@gmail.com
              </a>
              <span className="pf-dot">·</span>
              <a href="https://www.linkedin.com/in/sultan-aulia-7927901b5/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
              <span className="pf-dot">·</span>
              <span>Surabaya, Indonesia</span>
            </div>

            <div className="pf-bio">
              <p>
                Fullstack Web Developer dengan pengalaman sejak 2019, berfokus pada membangun aplikasi web yang responsif dan efisien. Keahlian mencakup seluruh siklus pengembangan — dari desain UI/UX hingga arsitektur backend dan manajemen database.
              </p>
              <p>
                Berpengalaman dalam PHP, JavaScript, Laravel, Vue.js, React.js, MySQL, dan PostgreSQL. Juga mahir dalam analisis dan penyajian data menggunakan SQL dan Microsoft Excel.
              </p>
            </div>
          </div>

          {/* Experience */}
          <section className="pf-section">
            <p className="pf-section-heading">Pengalaman Kerja</p>

            <div className="exp-item">
              <span className="exp-role">Fullstack Web Developer</span>
              <span className="exp-period">2019 – Sekarang</span>
              <span className="exp-company">Dinas Sosial Kota Surabaya</span>
              <ul className="exp-list">
                <li>Merancang dan mengembangkan aplikasi pelayanan sosial yang responsif dan intuitif.</li>
                <li>Mengelola dan menyajikan data keluarga miskin menggunakan Excel dan SQL untuk mendukung pengambilan keputusan.</li>
              </ul>
            </div>

            <div className="exp-item">
              <span className="exp-role">Asisten Dosen Pemrograman & Pengembangan Website</span>
              <span className="exp-period">2019</span>
              <span className="exp-company">Universitas Dinamika (Stikom Surabaya)</span>
              <ul className="exp-list">
                <li>Merancang materi kuliah dan praktik pemrograman web (HTML, CSS, JavaScript, backend).</li>
                <li>Memberikan bimbingan teknis kepada mahasiswa dan mengadakan workshop pengembangan web.</li>
              </ul>
            </div>

            <div className="exp-item">
              <span className="exp-role">Asisten Laboran Praktikum Algoritma Pemrograman</span>
              <span className="exp-period">2018</span>
              <span className="exp-company">Universitas Dinamika (Stikom Surabaya)</span>
              <ul className="exp-list">
                <li>Membantu persiapan dan pelaksanaan sesi praktikum algoritma pemrograman.</li>
                <li>Memberikan bimbingan kepada mahasiswa dalam memahami konsep algoritma dan struktur data.</li>
              </ul>
            </div>
          </section>

          {/* Skills */}
          <section className="pf-section">
            <p className="pf-section-heading">Tools & Keahlian</p>
            <div className="skill-grid">
              {SKILLS.map((s) => (
                <div key={s.label} className="skill-row">
                  <span className="skill-label">{s.label}</span>
                  <span className="skill-value">{s.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section className="pf-section">
            <p className="pf-section-heading">Project</p>
            <div className="project-list">
              {PROJECTS.map((proj) => {
                const isOpen = openProjects.has(proj.id);
                return (
                  <div key={proj.id} className="project-item">
                    <button
                      className="project-header"
                      onClick={() => toggleProject(proj.id)}
                      aria-expanded={isOpen}
                    >
                      <svg
                        className={`project-chevron ${isOpen ? "open" : ""}`}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                      </svg>
                      <div className="project-title-wrap">
                        <div className="project-title">{proj.title}</div>
                        <div className="project-company">{proj.company}</div>
                      </div>
                      <a
                        href={proj.link}
                        className="project-link"
                        target={proj.link.startsWith("http") ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit ↗
                      </a>
                    </button>
                    <div className={`project-body ${isOpen ? "open" : ""}`}>
                      {proj.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Education */}
          <section className="pf-section">
            <p className="pf-section-heading">Pendidikan</p>

            <div className="edu-item">
              <span className="edu-degree">D3 Sistem Informasi</span>
              <span className="edu-school">Universitas Dinamika (Stikom Surabaya)</span>
              <span className="edu-period">2016 – 2019</span>
            </div>

            <div className="edu-item">
              <span className="edu-degree">Teknik Komputer & Jaringan / Multimedia</span>
              <span className="edu-school">SMK Muhammadiyah 1 Surabaya</span>
              <span className="edu-period">2013 – 2016</span>
            </div>

            <div className="edu-item">
              <span className="edu-degree">SMP Muhammadiyah 1 Surabaya</span>
              <span className="edu-period">2010 – 2013</span>
            </div>
          </section>

        </main>

        <footer className="pf-footer">
          © {new Date().getFullYear()} Sultan Aulia Alfarizki · Built with Next.js
        </footer>
      </div>
    </>
  );
}
