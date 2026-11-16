# DESIGN.md — Undangan Digital Tasyakuran Pelatihan Perawat Dialisis Angkatan 13

> Dokumen acuan desain & implementasi untuk undangan digital berbasis web (mobile-first).
> Bagian bertanda **[ISI]** adalah data yang belum ada dan harus dilengkapi sebelum rilis.

---

## 1. Ringkasan

| Item | Detail |
|---|---|
| Tujuan | Undangan digital acara tasyakuran, dibagikan lewat WhatsApp/tautan |
| Acara | Tasyakuran Pelatihan Perawat Dialisis Angkatan 13 |
| Institusi | Rumah Sakit Dr. Soetomo Surabaya |
| Hari/Tanggal | **Kamis, 19 November 2026** |
| Waktu | **13.30 WIB** |
| Lokasi | **Lantai 3 Instalasi Dialisis RSUD Dr. Soetomo Surabaya** |
| Dress code | Tidak dicantumkan (ditiadakan) |
| Narahubung | **[ISI]** nama + nomor WhatsApp panitia |
| Perangkat utama | Ponsel 360–430 px (portrait). Desktop hanya menampilkan bingkai ponsel di tengah |
| Bahasa | Bahasa Indonesia |
| Gaya | Minimalis kekinian, hangat, profesional, dengan ornamen tema dialisis/kesehatan |

---

## 2. Analisis Referensi

| Referensi | Yang diambil | Adaptasi untuk undangan ini |
|---|---|---|
| **Disconix (landing & undangan, pink–teal)** | Headline raksasa yang diulang dan dipotong (efek "echo"), garis gelombang kontur, badge bintang bergerigi "JOIN US!", garis tebal–tipis, kotak outline tipis, foto duotone, angka tanggal besar bertumpuk | Headline **TASYAKURAN** dengan efek echo; garis gelombang menjadi simbol aliran darah/dialisat; badge **ANGKATAN 13**; foto duotone burgundy–krem; tanggal besar bertumpuk `19 / 11` |
| **Waves Club – Night Party (holografik putih)** | Kartu bersih dengan banyak ruang kosong, label kotak di atas foto, strip diagonal, info dua kolom dengan garis pemisah vertikal, ikon sparkle ✦, kotak URL/tombol bergaris | Label "Tasyakuran" di atas foto, strip diagonal sebagai aksen kecil, blok info Hari/Waktu/Tempat dua kolom, ikon ✦ sebagai pemisah |

**Sengaja tidak diambil:** warna pink/ungu, gradien holografik, nuansa klub malam. Semuanya diganti palet burgundy–krem yang hangat dan layak untuk acara rumah sakit.

---

## 3. Konsep & Prinsip Desain

1. **Minimalis hangat.** Satu fokus per layar, ruang kosong lega, tidak ada elemen yang berebut perhatian.
2. **Tegas di tipografi, tenang di warna.** Judul besar dan berani (seperti referensi), tetapi hanya 3 warna utama.
3. **Ornamen = line-art tipis bertema dialisis.** Ginjal, tetesan, aliran gelombang, plus medis, topi perawat/stetoskop. Maksimal 2–3 ornamen per layar dan tidak boleh menutupi teks.
4. **Mobile-first.** Dirancang di 390 px lalu diuji di 360 dan 430 px. Konten di desktop dibatasi `max-width: 480px`.
5. **Profesional-hangat.** Ini acara rasa syukur sesama tenaga kesehatan, jadi hindari kesan pesta/klub.

---

## 4. Palet Warna (60 · 30 · 10)

| Peran | Porsi | Hex | Token | Penggunaan |
|---|---|---|---|---|
| Dominan | 60% | `#810B38` | `--burgundy` | Latar halaman, hero, blok besar, tombol utama pada kartu krem |
| Sekunder | 30% | `#F1E2D1` | `--cream` | Kartu/panel informasi, teks pada latar burgundy, tombol utama pada latar burgundy |
| Aksen | 10% | `#DCC3AA` | `--sand` | Garis ornamen, badge, ikon, pemisah, garis gelombang |
| Opsional | ≤5% | `#541A1A` | `--ink` | Teks pada kartu krem, footer, bayangan, status tekan tombol |

```css
:root{
  --burgundy:#810B38;
  --cream:#F1E2D1;
  --sand:#DCC3AA;
  --ink:#541A1A;

  --bg:var(--burgundy);
  --surface:var(--cream);
  --accent:var(--sand);
  --text-on-bg:var(--cream);
  --text-on-surface:var(--ink);
}
```

**Aturan pemakaian**
- Latar halaman selalu `--burgundy`. Informasi penting (detail acara, RSVP) ditaruh di kartu `--cream`.
- `--sand` hanya untuk dekorasi, garis, dan teks besar/bold di atas burgundy. **Jangan** dipakai sebagai teks di atas krem karena kontrasnya hanya sekitar 1,3:1.
- Hindari gradien. Bila perlu kedalaman, pakai tumpukan transparansi tipis dari warna yang sama (≤8%).

**Kontras (perkiraan WCAG)**

| Kombinasi | Rasio | Pemakaian |
|---|---|---|
| Krem di atas burgundy | ±8,1 : 1 | Teks utama, semua ukuran |
| Sand di atas burgundy | ±6,1 : 1 | Label, angka besar, ikon |
| Ink di atas krem | ±10,7 : 1 | Teks kartu |
| Burgundy di atas krem | ±8,1 : 1 | Judul pada kartu, tombol |

---

## 5. Tipografi

| Peran | Font | Fallback |
|---|---|---|
| Display (judul, angka besar) | **Unbounded** 700–800 (lebar/extended, mirip nuansa referensi) | `Syne`, `system-ui`, sans-serif |
| Body & label | **Montserrat** 400/500/600/700 | `system-ui`, sans-serif |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Skala (basis layar 390 px)**

| Level | Ukuran | Line-height | Catatan |
|---|---|---|---|
| Echo headline | `clamp(1.7rem, 9vw, 2.6rem)` | 0.82 | Unbounded 800, uppercase, letter-spacing −0.02em |
| Angka tanggal | 3rem | 0.9 | Unbounded 800, ditumpuk vertikal |
| H2 | 1.5rem | 1.2 | Unbounded 700 |
| Label/eyebrow | 0.75rem | 1.4 | Montserrat 700, uppercase, tracking 0.16em |
| Body | 0.9375rem (15 px) | 1.6 | Montserrat 400 |
| Caption | 0.75rem | 1.4 | Montserrat 500 |

**Aturan:** uppercase hanya untuk display dan label. Panjang baris body ≤ 38 karakter di ponsel. Uji agar "TASYAKURAN" muat satu baris di 360 px. Bila terlalu lebar, kecilkan ukuran sedikit atau gunakan "SYUKUR" sebagai kata echo dan tulis "Tasyakuran" di subjudul.

---

## 6. Layout & Spasi

- Container: `max-width: 480px; margin: 0 auto; padding-inline: 20px`.
- Skala spasi: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`.
- Padding vertikal antar-section: 64 px. Hero: `min-height: 100svh`.
- Radius: **2 px** (nyaris tajam, selaras kotak outline referensi). Pill hanya untuk chip kecil.
- Garis outline: 1–1,5 px (`--sand` di atas burgundy, `--burgundy` di atas krem).
- Safe area: `padding-bottom: max(16px, env(safe-area-inset-bottom))`.
- Area sentuh minimum 48 × 48 px.
- Di layar > 480 px: latar luar `--ink`, undangan tampil sebagai kolom ponsel di tengah.

---

## 7. Ornamen

| Ornamen | Makna | Bentuk | Penempatan | Warna |
|---|---|---|---|---|
| **Garis gelombang kontur** (dari referensi) | Aliran darah / membran dialisis | 14–18 garis, stroke 1 px, amplitudo bertahap | Bawah hero, pemisah section | Sand di atas burgundy |
| **Ginjal line-art** | Fokus keperawatan dialisis | Outline ginjal + ureter, stroke 1,5 px | Section pembuka & detail acara | Sand / krem |
| **Tetesan (droplet)** | Cairan dialisat | Ikon kecil 16–24 px | Bullet, pemisah, ikon info | Sand |
| **Plus medis & ✦ sparkle** | Kesehatan, rasa syukur | Ikon 12–16 px | Pojok kartu, pemisah | Sand / krem |
| **Topi perawat / stetoskop** | Profesi perawat | Line-art 1,5 px | Satu kali, di section ucapan terima kasih | Sand |
| **Badge bintang bergerigi** (dari "JOIN US!") | Identitas angkatan | Starburst 12–16 sudut, teks "ANGKATAN 13" | Hero, berputar pelan | Sand + teks krem |
| **Strip diagonal** (dari referensi 3) | Aksen dinamis | 6–8 garis miring tebal 3 px | Samping foto / label | Sand |
| **Garis tebal–tipis** (dari referensi 1 & 2) | Pemisah / indikator scroll | Segmen tebal 6 px + garis tipis 1 px | Bawah hero, penutup | Sand |

**Aturan ornamen**
- Hanya outline (stroke), tanpa isian, satu warna per ornamen.
- Maksimal 2–3 ornamen terlihat dalam satu layar.
- Semua dekorasi memakai `aria-hidden="true"`.
- Hindari ilustrasi realistis (jarum, darah, mesin) agar tetap nyaman dilihat.

```html
<!-- Contoh ikon tetesan -->
<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
  <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2Z"/>
</svg>
```

**Efek echo untuk headline** (inti identitas visual, diambil dari referensi):

```html
<h1 class="echo" aria-label="Tasyakuran">
  <span aria-hidden="true">TASYAKURAN</span>
  <span>TASYAKURAN</span>
  <span aria-hidden="true">TASYAKURAN</span>
</h1>
```
```css
.echo{font-family:'Unbounded',system-ui,sans-serif;font-weight:800;text-transform:uppercase;
  font-size:clamp(1.7rem,9vw,2.6rem);line-height:.82;letter-spacing:-.02em;color:var(--cream)}
.echo span{display:block}
.echo span:nth-child(1){clip-path:inset(48% 0 0 0);margin-bottom:-.06em}  /* hanya separuh bawah terlihat */
.echo span:nth-child(3){clip-path:inset(0 0 52% 0);margin-top:-.04em}    /* hanya separuh atas terlihat */
/* Opsional: efek "meleleh" pada baris 3 */
.echo span:nth-child(3){-webkit-mask-image:linear-gradient(#000 40%,transparent);mask-image:linear-gradient(#000 40%,transparent)}
```
Nilai `inset` perlu disetel visual agar potongan terlihat seperti referensi.

---

## 8. Struktur Halaman (Wireframe Mobile)

### 0) Cover / Hero (100svh, latar burgundy)
```
┌──────────────────────────┐
│ [logo RS]      ✦ [badge] │  logo kecil kiri, badge "ANGKATAN 13" kanan
│                          │
│  Kepada Yth.             │
│  {Nama Tamu}             │  dari ?to=Nama
│                          │
│  TASYAKURAN (echo ×3)    │
│  Pelatihan Perawat       │
│  Dialisis Angkatan 13    │
│  RS Dr. Soetomo Surabaya │
│                          │
│  ≈≈≈≈ garis gelombang ≈≈≈│
│  19 /                    │
│  11    Kamis · 2026      │
│  [ BUKA UNDANGAN ]       │
│  ▬▬▬▬────────────        │
└──────────────────────────┘
```

### 1) Pembuka
Ginjal line-art kecil, kalimat syukur 2–3 baris, rata tengah. Salam keagamaan bersifat opsional.

### 2) Detail Acara (kartu krem)
```
┌────────────────────────────┐
│ ✦ DETAIL ACARA             │
│ Hari/Tgl │ Kamis,          │
│          │ 19 November 2026│
│──────────┼─────────────────│  garis vertikal (gaya referensi 3)
│ Waktu    │ 13.30 WIB       │
│ Tempat   │ Lantai 3        │
│          │ Instalasi       │
│          │ Dialisis RSUD   │
│          │ Soetomo         │
│ [ Simpan ke Kalender ]     │
│ [ Buka Peta ]              │
└────────────────────────────┘
```

### 3) Hitung Mundur
Empat kotak outline (Hari · Jam · Menit · Detik), angka Unbounded warna sand. Target: 19 Nov 2026 pukul 13.30 WIB (`+07:00`). Setelah lewat, tampilkan "Acara telah berlangsung".

### 4) Kenangan Angkatan 13 (galeri)
Galeri foto dokumentasi (7 foto dari `public/foto_undangan`), rasio 3:2 dengan kartu spotlight, kontrol navigasi, bar thumbnail pilihan foto, dan opsi toggle filter duotone/warna asli.

### 5) Penutup
Ikon topi perawat/stetoskop, ucapan terima kasih, nama panitia, garis tebal–tipis, footer `--ink`.

---

## 9. Komponen UI

| Komponen | Spesifikasi |
|---|---|
| **Tombol utama (di atas burgundy)** | Isi `--cream`, teks `--burgundy`, tinggi 52 px, radius 2 px, uppercase 12 px, weight 700, tracking 0.12em |
| **Tombol utama (di atas krem)** | Isi `--burgundy`, teks `--cream`; status tekan memakai `--ink` |
| **Tombol sekunder** | Transparan, border 1,5 px (sand di burgundy / burgundy di krem) |
| **Kartu** | Latar `--cream`, teks `--ink`, padding 24 px, border 1 px burgundy, offset outline 4 px (gaya referensi) |
| **Badge ANGKATAN 13** | Starburst sand, teks krem 11 px bold |
| **Blok info** | Dua kolom, label di kiri (sand/burgundy), nilai di kanan, garis vertikal 1 px |
| **Countdown** | 4 kotak outline 1 px sand, angka 1,75rem Unbounded |
| **Input** | Tinggi 48 px, border 1 px burgundy, fokus: outline 2 px `--ink`, label selalu terlihat |

---

## 10. Motion

- **Echo headline:** tiap baris muncul berurutan (stagger 80 ms), 600 ms `ease-out`.
- **Garis gelombang:** bergeser pelan (loop 20 s).
- **Badge:** rotasi 24 s linear tanpa henti.
- **Reveal section:** fade + naik 16 px, 500 ms, sekali saja (`IntersectionObserver`).
- Animasikan hanya `transform` dan `opacity`.
- `@media (prefers-reduced-motion: reduce)`: matikan semua animasi, tampilkan keadaan akhir.

---

## 11. Fitur Fungsional

1. **Nama tamu dinamis:** `undangan.html?to=Nama%20Tamu`. Tampilkan lewat `textContent` (jangan `innerHTML`) agar aman dari injeksi.
2. **Buka Undangan:** tombol di cover membuka kunci scroll dan, bila ada, memulai musik.
3. **Simpan ke Kalender:** tautan Google Calendar + unduhan `.ics`, zona waktu `Asia/Jakarta`.
4. **Buka Peta:** tautan Google Maps ke lokasi **[ISI]**.
5. **RSVP via WhatsApp:**
   `https://wa.me/62XXXXXXXXXX?text=Halo%20panitia%2C%20saya%20{nama}%20konfirmasi%20hadir%20di%20Tasyakuran%20Angkatan%2013%20({jumlah}%20orang).`
6. **Bagikan:** Web Share API, dengan cadangan salin tautan.
7. **Musik latar (opsional):** default mati, tombol mute/unmute mengambang di pojok.
8. **Pratinjau WhatsApp:** meta Open Graph (`og:title`, `og:description`, `og:image` 1200×630 px, `og:url`).

---

## 12. Contoh Copywriting

- **Cover:** *Tasyakuran · Pelatihan Perawat Dialisis Angkatan 13*
- **Pembuka:** "Dengan penuh rasa syukur, kami mengundang Anda untuk berbagi kebahagiaan atas selesainya perjalanan belajar Pelatihan Perawat Dialisis Angkatan 13 di Rumah Sakit Dr. Soetomo Surabaya."
- **Detail:** "Kehadiran dan doa Anda adalah bagian dari kebahagiaan kami."
- **RSVP:** "Mohon konfirmasi kehadiran paling lambat **[ISI]** November 2026."
- **Penutup:** "Terima kasih telah menjadi bagian dari perjalanan kami. Sampai jumpa pada Kamis, 19 November 2026."
- **Salam (opsional):** *Assalamualaikum Wr. Wb.* Sesuaikan dengan kebiasaan panitia.

---

## 13. Aset & Fotografi

| Aset | Keterangan |
|---|---|
| Logo RS Dr. Soetomo | **[ISI]** Gunakan hanya versi resmi dengan izin panitia/institusi, versi mono krem untuk latar burgundy |
| Foto Angkatan 13 | 3–6 foto (kelas, praktik, foto bersama). Resolusi ≥ 1200 px sisi panjang |
| Ikon & ornamen | SVG inline (ringan, bisa diwarnai lewat `currentColor`) |
| Gambar OG | 1200 × 630 px, memuat echo headline + tanggal |

**Perlakuan foto (duotone, mengikuti referensi pink–teal):**
- Utama: *gradient map* di editor foto dengan `#541A1A → #810B38 → #F1E2D1`, ekspor WebP.
- Cadangan CSS:

```css
.duotone{position:relative;isolation:isolate;background:#000}
.duotone img{display:block;width:100%;filter:grayscale(1) contrast(1.1)}
.duotone::before,.duotone::after{content:"";position:absolute;inset:0;pointer-events:none}
.duotone::before{background:var(--burgundy);mix-blend-mode:lighten}
.duotone::after{background:var(--cream);mix-blend-mode:multiply}
```
- Pastikan semua orang pada foto berizin untuk dipublikasikan.

---

## 14. Teknis & Performa

- Disarankan satu halaman statis (HTML + CSS + JS ringan), bisa juga ditanam di Blade/Laravel.
- Target: LCP < 2,5 s di 4G, total halaman < 1 MB tanpa musik.
- Gambar WebP, `loading="lazy"` kecuali hero, tentukan `width`/`height` untuk mencegah layout shift.
- `font-display: swap`, hanya muat bobot yang dipakai.
- Satu file CSS, JS tanpa framework berat, tanpa pustaka animasi besar.
- Bahasa dokumen: `<html lang="id">`.

---

## 15. Aksesibilitas

- Kontras sesuai tabel di bagian 4.
- Teks alternatif untuk foto bermakna, dekorasi `aria-hidden="true"`.
- Navigasi keyboard dan fokus terlihat (outline 2 px).
- Countdown diperbarui dengan `aria-live="off"` (hindari bacaan berulang), tampilkan tanggal lengkap dalam teks biasa.
- Hormati `prefers-reduced-motion`.
- Ukuran teks tidak di bawah 12 px, tombol ≥ 48 px.

---

## 16. Checklist Sebelum Rilis

**Data yang harus dilengkapi**
- [x] Waktu acara: 13.30 WIB
- [x] Lokasi: Lantai 3 Instalasi Dialisis RSUD Soetomo Surabaya
- [-] Dress code (ditiadakan)
- [-] Konfirmasi kehadiran / RSVP (ditiadakan)
- [-] Rundown acara (ditiadakan)
- [ ] Logo resmi RS & izin penggunaan
- [x] Foto Angkatan 13 (7 foto di public/foto_undangan)

**QA**
- [ ] Tampilan rapi di 360, 390, 430 px dan saat landscape
- [ ] "TASYAKURAN" muat satu baris di 360 px
- [ ] Tautan `?to=` aman dan nama panjang tidak merusak layout
- [ ] Countdown benar pada zona `Asia/Jakarta`
- [ ] File `.ics`, tautan peta, dan RSVP WhatsApp berfungsi
- [ ] Pratinjau WhatsApp menampilkan gambar & judul yang benar
- [ ] Animasi mati saat `prefers-reduced-motion`
- [ ] Uji di Chrome Android, Safari iOS, dan browser dalam WhatsApp