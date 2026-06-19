<div align="center">

# TradingView Analysis Dashboard

### Platform Analisa Trading Real-Time

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TradingView](https://img.shields.io/badge/TradingView-FF6600?style=for-the-badge&logo=tradingview&logoColor=white)](https://www.tradingview.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

[English](README.md) | **Bahasa Indonesia**

</div>

## Daftar Isi

- [Ringkasan](#ringkasan)
- [Fitur](#fitur)
- [Demo](#demo)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Pengaturan API](#pengaturan-api)
- [Cara Penggunaan](#cara-penggunaan)
- [Arsitektur](#arsitektur)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## Ringkasan

TradingView Analysis Dashboard adalah platform berbasis web komprehensif untuk analisa pasar keuangan real-time. Platform ini mengintegrasikan chart TradingView dengan data cryptocurrency, forex, dan saham secara langsung untuk memberikan wawasan pasar yang akurat dan tepat waktu kepada para trader.

### Sorotan Utama

- **Data cryptocurrency real-time** melalui Binance WebSocket
- **Chart TradingView interaktif** dengan indikator teknikal
- **Data forex dan saham** melalui API Alpha Vantage
- **Tema gelap profesional** yang dioptimalkan untuk trading
- **Desain responsif** untuk desktop dan perangkat mobile

---

## Fitur

### Analisa Pasar
| Fitur | Deskripsi |
|-------|-----------|
| Chart Interaktif | Chart bertenaga TradingView dengan berbagai timeframe |
| Indikator Teknikal | RSI, MACD, Moving Averages, Bollinger Bands |
| Ringkasan Pasar | Kartu harga real-time untuk semua aset yang dilacak |
| Watchlist | Daftar aset yang dapat dikustomisasi untuk dipantau |

### Data Real-Time
| Fitur | Deskripsi |
|-------|-----------|
| WebSocket Streaming | Harga crypto langsung dari Binance |
| Auto-Refresh | Interval refresh data yang dapat dikonfigurasi |
| Animasi Harga | Umpan balik visual saat harga berubah |
| Status Pasar | Indikator jam perdagangan |

### Alat Analisa
| Fitur | Deskripsi |
|-------|-----------|
| Analisa Teknikal | Pembuatan sinyal otomatis (Beli/Jual) |
| Data Fundamental | Market cap, volume, perubahan harga |
| Analisa Sentimen | Visualisasi Fear & Greed Index |
| Feed Berita | Berita dan analisa pasar terbaru |

---

## Demo

**Demo Langsung:** [Klik di sini untuk melihat](https://writenwrite.github.io/website-trading-analytics-/)

---

## Instalasi

### Prasyarat

- Browser web modern (Chrome, Firefox, Edge, Safari)
- Koneksi internet untuk data real-time
- Teks editor (VS Code direkomendasikan)

### Mulai Cepat

1. **Clone repository**

```bash
git clone https://github.com/writenwrite/website-trading-analytics-.git
cd website-trading-analytics-
```

2. **Buka di browser**

```bash
# Cukup buka index.html di browser Anda
# Tidak perlu server - berjalan langsung dari file

# Atau gunakan server lokal (opsional)
# Menggunakan Python
python -m http.server 8000

# Menggunakan Node.js
npx serve .
```

3. **Akses aplikasi**

```
http://localhost:8000
```

---

## Konfigurasi

### Pengaturan API Key

#### Alpha Vantage (Gratis)

1. Kunjungi [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Klik "Request an API Key"
3. Isi formulir
4. Salin API key Anda
5. Klik tombol ⚙️ di aplikasi
6. Paste API key dan simpan

> **Catatan:** Tanpa API key, aplikasi menggunakan data fallback untuk forex dan saham. Data cryptocurrency tetap real-time.

### Pengaturan Aplikasi

| Pengaturan | Opsi | Default |
|------------|------|---------|
| Auto Refresh | 10d, 30d, 1m, 5m | 30d |
| API Key | Alpha Vantage key | Tidak ada |
| Tema | Gelap | Gelap |

---

## Pengaturan API

### API Gratis yang Digunakan

| API | Keperluan | Batas Rate |
|-----|-----------|------------|
| Binance WebSocket | Crypto real-time | Tidak terbatas |
| CoinGecko | Data pasar crypto | 10-30 req/menit |
| Alpha Vantage | Data Forex & Saham | 5 req/hari (gratis) |

### Mendapatkan API Key

#### Binance (Tidak perlu key)
- Koneksi WebSocket gratis dan tidak terbatas
- Tidak perlu registrasi

#### CoinGecko (Tidak perlu key)
- Tersedia tier gratis
- Tidak perlu registrasi untuk penggunaan dasar

#### Alpha Vantage (Key gratis)
1. Buka https://www.alphavantage.co/support/#api-key
2. Pilih tier "free"
3. Isi data Anda
4. Terima key langsung melalui email

---

## Cara Penggunaan

### Navigasi

| Aksi | Cara |
|------|------|
| Ganti Pasar | Klik tombol Crypto/Forex/Saham |
| Cari Aset | Ketik simbol di kotak pencarian |
| Ganti Timeframe | Klik tombol 1D/1W/1M/3M/1Y |
| Lihat Detail | Klik kartu aset atau baris watchlist |
| Buka Pengaturan | Klik tombol ⚙️ (kiri bawah) |

### Pintasan Keyboard

| Tombol | Aksi |
|--------|------|
| `Enter` | Eksekusi pencarian |
| `Escape` | Tutup modal pengaturan |

### Format Simbol

| Pasar | Format | Contoh |
|-------|--------|--------|
| Crypto | SIMBOLUSD | BTCUSD, ETHUSD |
| Forex | BASEQUOT | EURUSD, GBPUSD |
| Saham | TICKER | AAPL, MSFT, GOOGL |

---

## Arsitektur

### Struktur File

```
website-trading-analytics-/
├── index.html              # File HTML utama
├── README.md               # Dokumentasi (Inggris)
├── README_ID.md            # Dokumentasi (Indonesia)
├── css/
│   └── style.css           # Gaya dan animasi
└── js/
    ├── config.js           # Manajemen konfigurasi
    ├── api.js              # Integrasi API
    ├── charts.js           # Integrasi TradingView
    └── app.js              # Logika aplikasi
```

### Ringkasan Modul

| Modul | Tanggung Jawab |
|-------|----------------|
| `config.js` | API key, pengaturan, local storage |
| `api.js` | REST API, WebSocket, pengambilan data |
| `charts.js` | Manajemen widget TradingView |
| `app.js` | Rendering UI, penanganan event, state |

### Alur Data

```
┌─────────────────────────────────────────────────────────┐
│                    Antarmuka Pengguna                    │
├─────────────────────────────────────────────────────────┤
│                       app.js                            │
│    ┌─────────────┬─────────────┬─────────────┐          │
│    │   Charts    │   Watchlist │   Analisa   │          │
│    └─────────────┴─────────────┴─────────────┘          │
├─────────────────────────────────────────────────────────┤
│                        api.js                           │
│    ┌─────────────┬─────────────┬─────────────┐          │
│    │   Binance   │  CoinGecko  │   Alpha V.  │          │
│    │  WebSocket  │     REST    │     REST    │          │
│    └─────────────┴─────────────┴─────────────┘          │
├─────────────────────────────────────────────────────────┤
│                    API Eksternal                         │
└─────────────────────────────────────────────────────────┘
```

---

## Kontribusi

Kontribusi sangat diterima! Silakan ikuti langkah-langkah berikut:

1. **Fork** repository
2. **Buat** branch fitur baru
   ```bash
   git checkout -b feature/fitur-luar-biasa
   ```
3. **Commit** perubahan Anda
   ```bash
   git commit -m 'feat: Tambah fitur luar biasa'
   ```
4. **Push** ke branch
   ```bash
   git push origin feature/fitur-luar-biasa
   ```
5. **Buka** Pull Request

### Konvensi Commit

| Awalan | Deskripsi |
|--------|-----------|
| `feat:` | Fitur baru |
| `fix:` | Perbaikan bug |
| `docs:` | Dokumentasi |
| `style:` | Perubahan UI/Gaya |
| `refactor:` | Refaktoring kode |
| `test:` | Pengujian |
| `chore:` | Pemeliharaan |

---

## Dukungan Browser

| Browser | Status |
|---------|--------|
| Chrome | ✅ Didukung Penuh |
| Firefox | ✅ Didukung Penuh |
| Edge | ✅ Didukung Penuh |
| Safari | ✅ Didukung Penuh |
| Opera | ✅ Didukung Penuh |

---

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.

---

## Pengakuan

- [TradingView](https://www.tradingview.com/) - Widget chart
- [Binance](https://www.binance.com/) - Data cryptocurrency
- [CoinGecko](https://www.coingecko.com/) - Data pasar crypto
- [Alpha Vantage](https://www.alphavantage.co/) - Data Forex & Saham

---

<div align="center">

**Dibuat dengan ❤️ untuk trader di seluruh dunia**

[⬆ Kembali ke Atas](#tradingview-analysis-dashboard)

</div>
