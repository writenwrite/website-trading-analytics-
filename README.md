<div align="center">

# TradingView Analysis Dashboard

### Real-Time Trading Analytics Platform

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TradingView](https://img.shields.io/badge/TradingView-FF6600?style=for-the-badge&logo=tradingview&logoColor=white)](https://www.tradingview.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

**English** | [Bahasa Indonesia](README_ID.md)

</div>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Setup](#api-setup)
- [Usage](#usage)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

TradingView Analysis Dashboard is a comprehensive web-based platform for real-time financial market analysis. It integrates TradingView charts with live cryptocurrency, forex, and stock data to provide traders with accurate and timely market insights.

### Key Highlights

- **Real-time cryptocurrency data** via Binance WebSocket
- **Interactive TradingView charts** with technical indicators
- **Forex and stock data** via Alpha Vantage API
- **Professional dark theme** optimized for trading
- **Responsive design** for desktop and mobile devices

---

## Features

### Market Analysis
| Feature | Description |
|---------|-------------|
| Interactive Charts | TradingView-powered charts with multiple timeframes |
| Technical Indicators | RSI, MACD, Moving Averages, Bollinger Bands |
| Market Overview | Real-time price cards for all tracked assets |
| Watchlist | Customizable list of assets to monitor |

### Real-Time Data
| Feature | Description |
|---------|-------------|
| WebSocket Streaming | Live crypto prices from Binance |
| Auto-Refresh | Configurable data refresh intervals |
| Price Animations | Visual feedback on price changes |
| Market Status | Trading hours indicator |

### Analysis Tools
| Feature | Description |
|---------|-------------|
| Technical Analysis | Automated signal generation (Buy/Sell) |
| Fundamental Data | Market cap, volume, price changes |
| Sentiment Analysis | Fear & Greed Index visualization |
| News Feed | Latest market news and analysis |

---

## Demo

**Live Demo:** [Click here to view](https://writenwrite.github.io/website-trading-analytics-/)

---

## Installation

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection for real-time data
- Text editor (VS Code recommended)

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/writenwrite/website-trading-analytics-.git
cd website-trading-analytics-
```

2. **Open in browser**

```bash
# Simply open index.html in your browser
# No server required - runs directly from file

# Or use a local server (optional)
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

3. **Access the application**

```
http://localhost:8000
```

---

## Configuration

### API Key Setup

#### Alpha Vantage (Free)

1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Click "Request an API Key"
3. Fill in the form
4. Copy your API key
5. Click the ⚙️ button in the app
6. Paste your API key and save

> **Note:** Without an API key, the app uses fallback data for forex and stocks. Cryptocurrency data remains real-time.

### Application Settings

| Setting | Options | Default |
|---------|---------|---------|
| Auto Refresh | 10s, 30s, 1m, 5m | 30s |
| API Key | Alpha Vantage key | None |
| Theme | Dark | Dark |

---

## API Setup

### Free APIs Used

| API | Purpose | Rate Limit |
|-----|---------|------------|
| Binance WebSocket | Crypto real-time | Unlimited |
| CoinGecko | Crypto market data | 10-30 req/min |
| Alpha Vantage | Forex & Stock data | 5 req/day (free) |

### Getting API Keys

#### Binance (No key needed)
- WebSocket connection is free and unlimited
- No registration required

#### CoinGecko (No key needed)
- Free tier available
- No registration for basic usage

#### Alpha Vantage (Free key)
1. Go to https://www.alphavantage.co/support/#api-key
2. Select "free" tier
3. Fill in your details
4. Receive key instantly via email

---

## Usage

### Navigation

| Action | How To |
|--------|--------|
| Switch Market | Click Crypto/Forex/Saham buttons |
| Search Asset | Type symbol in search box |
| Change Timeframe | Click 1D/1W/1M/3M/1Y buttons |
| View Details | Click any asset card or watchlist row |
| Open Settings | Click ⚙️ button (bottom-left) |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Execute search |
| `Escape` | Close settings modal |

### Symbol Formats

| Market | Format | Example |
|--------|--------|---------|
| Crypto | SYMBOLUSD | BTCUSD, ETHUSD |
| Forex | BASEQUOTE | EURUSD, GBPUSD |
| Stock | TICKER | AAPL, MSFT, GOOGL |

---

## Architecture

### File Structure

```
website-trading-analytics-/
├── index.html              # Main HTML file
├── README.md               # Documentation (English)
├── README_ID.md            # Documentation (Indonesian)
├── css/
│   └── style.css           # Styles and animations
└── js/
    ├── config.js           # Configuration management
    ├── api.js              # API integrations
    ├── charts.js           # TradingView integration
    └── app.js              # Application logic
```

### Module Overview

| Module | Responsibility |
|--------|----------------|
| `config.js` | API keys, settings, local storage |
| `api.js` | REST APIs, WebSocket, data fetching |
| `charts.js` | TradingView widget management |
| `app.js` | UI rendering, event handling, state |

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                      User Interface                      │
├─────────────────────────────────────────────────────────┤
│                         app.js                           │
│    ┌─────────────┬─────────────┬─────────────┐          │
│    │   Charts    │   Watchlist │   Analysis  │          │
│    └─────────────┴─────────────┴─────────────┘          │
├─────────────────────────────────────────────────────────┤
│                       api.js                             │
│    ┌─────────────┬─────────────┬─────────────┐          │
│    │   Binance   │  CoinGecko  │   Alpha V.  │          │
│    │  WebSocket  │     REST    │     REST    │          │
│    └─────────────┴─────────────┴─────────────┘          │
├─────────────────────────────────────────────────────────┤
│                      External APIs                       │
└─────────────────────────────────────────────────────────┘
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Commit Convention

| Prefix | Description |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation |
| `style:` | UI/Style changes |
| `refactor:` | Code refactoring |
| `test:` | Tests |
| `chore:` | Maintenance |

---

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome | ✅ Fully Supported |
| Firefox | ✅ Fully Supported |
| Edge | ✅ Fully Supported |
| Safari | ✅ Fully Supported |
| Opera | ✅ Fully Supported |

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [TradingView](https://www.tradingview.com/) - Chart widgets
- [Binance](https://www.binance.com/) - Cryptocurrency data
- [CoinGecko](https://www.coingecko.com/) - Crypto market data
- [Alpha Vantage](https://www.alphavantage.co/) - Forex & Stock data

---

<div align="center">

**Made with ❤️ for traders worldwide**

[⬆ Back to Top](#tradingview-analysis-dashboard)

</div>
