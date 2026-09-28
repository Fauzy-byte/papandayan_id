# Papandayan.id — Platform Reservasi Trip Resmi PT. Pasak Outdoor

Aplikasi web modern berbasis **React 19 + TypeScript + Vite + Tailwind CSS** untuk platform reservasi trip Gunung Papandayan (Sunrise Trip, One Day Exploring, Camping VIP & Private), dilengkapi pemisahan mode pengunjung dan portal admin operasional.

---

## 📋 Prasyarat Sistem (Prerequisites)

Sebelum menjalankan proyek di VS Code pada komputer lokal Anda, pastikan telah menginstal:
1. **Node.js** (Versi 18 LTS atau 20+ disarankan) — Unduh di [nodejs.org](https://nodejs.org)
2. **NPM** (terbawa otomatis dengan Node.js) atau **Bun / PNPM / Yarn**
3. **Visual Studio Code (VS Code)** — Unduh di [code.visualstudio.com](https://code.visualstudio.com)
4. **Git** (opsional jika mengunduh via Git clone) — Unduh di [git-scm.com](https://git-scm.com)

---

## 🚀 Panduan Menjalankan Proyek di VS Code

### Langkah 1: Ekstrak / Buka Folder Proyek di VS Code
1. Jika mengunduh file `.zip` dari AI Studio:
   - Ekstrak folder zip tersebut di komputer Anda (misalnya di folder `D:/Projects/papandayan-id`).
2. Buka aplikasi **VS Code**.
3. Klik menu **File** > **Open Folder...** (atau tekan `Ctrl + K, Ctrl + O`).
4. Pilih folder hasil ekstrak proyek ini.

---

### Langkah 2: Buka Terminal Terintegrasi di VS Code
1. Pada menu bar atas VS Code, klik **Terminal** > **New Terminal** (atau gunakan pintasan tombol `Ctrl + \``).
2. Terminal akan terbuka di bagian bawah VS Code, mengarah langsung ke direktori proyek.

---

### Langkah 3: Install Dependensi (Package Dependencies)
Jalankan perintah berikut di terminal:

```bash
npm install --legacy-peer-deps
```
*(Atau cukup `npm install` karena proyek sudah menyertakan konfigurasi `.npmrc`, atau jika menggunakan `bun`: `bun install`)*

> 💡 **Jika Muncul `npm ERR! ERESOLVE unable to resolve dependency tree`:**
> Hal ini wajar terjadi pada React 19 karena pustaka pihak ketiga. Solusinya, jalankan:
> ```bash
> npm install --legacy-peer-deps
> ```
> Atau jika masih terkendala:
> ```bash
> npm install --force
> ```

Tunggu hingga proses pengunduhan seluruh pustaka (`react`, `vite`, `tailwindcss`, `lucide-react`, dll.) selesai dan folder `node_modules` terbentuk.

---

### Langkah 4: Jalankan Server Pengembangan (Development Server)
Setelah instalasi selesai, jalankan perintah:

```bash
npm run dev
```

Terminal akan menampilkan output seperti ini:
```bash
  VITE v5.x.x  ready in 350 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

Tekan tombol `Ctrl` lalu klik tautan `http://localhost:3000/` pada terminal, atau buka browser (Chrome / Edge / Safari) dan ketik alamat:
👉 **`http://localhost:3000`**

Aplikasi Papandayan.id siap digunakan dan diuji secara lokal!

---

## 🛠️ Perintah Berguna Lainnya (Scripts)

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan local development server (live reload) |
| `npm run build` | Melakukan kompilasi file statis produksi ke dalam folder `/dist` |
| `npm run lint` | Melakukan pengecekan tipe TypeScript (`tsc --noEmit`) tanpa error |

---

## 🔐 Kredensial Mode Admin Operasional

Sistem dilengkapi pemisahan akses untuk melindungi privasi data pelanggan:
- **Username / Email Admin**: `admin@papandayan.id` atau `admin`
- **Kata Sandi / PIN**: `admin123` atau `papandayan2026`

Akses admin dapat dibuka melalui tautan **Portal Staf & Admin** di bagian paling bawah (*Footer*) atau melalui navigasi menu.

---

## 🧩 Rekomendasi Ekstensi VS Code (Opsional)

Untuk pengalaman *coding* terbaik di VS Code:
1. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) — Autocomplete kelas CSS
2. **ESLint** (`dbaeumer.vscode-eslint`) — Deteksi otomatis gaya kode
3. **Prettier - Code formatter** (`esbenp.prettier-vscode`) — Format kode otomatis rapi
4. **Pretty TypeScript Errors** (`yoavbls.pretty-ts-errors`) — Penjelasan error TypeScript yang mudah dibaca

---

## 📂 Struktur Direktori Proyek

```text
├── index.html              # Entry point HTML aplikasi
├── package.json            # Daftar dependensi & script runner
├── vite.config.js          # Konfigurasi bundler Vite
├── tailwind.config.js      # Konfigurasi tema warna Tailwind CSS
├── public/                 # Asset statis, logo, favicon
└── src/
    ├── main.tsx            # Entry point React
    ├── App.tsx             # Root Router & State Management Utama
    ├── types.ts            # Definisi Interface & Tipe TypeScript
    ├── data/
    │   └── mockData.ts     # Data paket trip, artikel, testimoni, FAQ
    ├── components/
    │   ├── Navbar.tsx      # Navigasi utama & fullscreen menu
    │   ├── Footer.tsx      # Footer lengkap legalitas PT. Pasak Outdoor
    │   ├── AdminTopBar.tsx # Bar kontrol saat mode admin aktif
    │   ├── AdminLoginModal.tsx # Modal login terenkripsi untuk staf/admin
    │   ├── BookingLookupModal.tsx # Verifikasi & pelacakan status tiket
    │   └── HelpModal.tsx   # Pusat bantuan & FAQ
    └── views/
        ├── HomeView.tsx    # Halaman beranda interaktif & pencarian trip
        ├── TripPackagesView.tsx # Katalog semua paket trip
        ├── PackageDetailView.tsx # Detail itinerary & fasilitas paket
        ├── BookingFormView.tsx   # Formulir pemesanan & DP tiket
        ├── BookingDetailView.tsx # E-tiket & konfirmasi WhatsApp
        ├── AdminView.tsx   # Panel manajemen pemesanan & verifikasi pembayaran
        ├── ArticlesView.tsx # Blog & tips pendakian
        └── GalleryView.tsx # Dokumentasi foto kegiatan
```
