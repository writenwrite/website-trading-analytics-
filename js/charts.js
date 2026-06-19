const Charts = {
    widget: null,
    currentSymbol: 'BINANCE:BTCUSD',
    currentTimeframe: 'D',

    init(symbol, containerId) {
        this.currentSymbol = symbol || 'BINANCE:BTCUSD';
        this.renderWidget(containerId || 'tradingViewChart');
    },

    renderWidget(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        if (typeof TradingView !== 'undefined') {
            this.widget = new TradingView.widget({
                'container_id': containerId,
                'symbol': this.currentSymbol,
                'interval': this.currentTimeframe === 'D' ? 'D' : 
                           this.currentTimeframe === 'W' ? 'W' : 
                           this.currentTimeframe === 'M' ? 'M' : 'D',
                'timezone': 'Asia/Jakarta',
                'theme': 'dark',
                'style': '1',
                'locale': 'id_ID',
                'toolbar_bg': '#161b22',
                'enable_publishing': false,
                'allow_symbol_change': true,
                'hide_side_toolbar': false,
                'hide_top_toolbar': false,
                'studies': [
                    'MASimple@tv-basicstudies',
                    'RSI@tv-basicstudies',
                    'MACD@tv-basicstudies',
                    'BB@tv-basicstudies'
                ],
                'show_popup_button': true,
                'popup_width': '1000',
                'popup_height': '650',
                'no_overlays': false,
                'width': '100%',
                'height': '100%',
                'save_image': false,
                'calendar': false,
                'support_host': 'https://www.tradingview.com'
            });
        } else {
            this.renderFallbackChart(containerId);
        }
    },

    renderFallbackChart(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                background: #0d1117;
                color: #e6edf3;
                text-align: center;
                padding: 20px;
            ">
                <div style="font-size: 3rem; margin-bottom: 20px;">📈</div>
                <h3 style="margin-bottom: 10px;">TradingView Chart</h3>
                <p style="color: #8b949e; margin-bottom: 20px;">
                    Simbol: ${this.currentSymbol}<br>
                    Interval: ${this.currentTimeframe}
                </p>
                <div style="
                    background: #161b22;
                    border: 1px solid #30363d;
                    border-radius: 8px;
                    padding: 30px;
                    width: 100%;
                    max-width: 600px;
                ">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <span style="color: #8b949e;">Open</span>
                        <span>$43,125.50</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <span style="color: #8b949e;">High</span>
                        <span style="color: #3fb950;">$44,250.00</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <span style="color: #8b949e;">Low</span>
                        <span style="color: #f85149;">$42,380.00</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <span style="color: #8b949e;">Close</span>
                        <span>$43,850.75</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #8b949e;">Volume</span>
                        <span>$28.3B</span>
                    </div>
                </div>
                <p style="margin-top: 20px; color: #8b949e; font-size: 0.85rem;">
                    TradingView widget akan dimuat di sini
                </p>
            </div>
        `;
    },

    changeSymbol(symbol) {
        this.currentSymbol = symbol;
        if (this.widget && this.widget.chart) {
            this.widget.chart().setSymbol(symbol);
        } else {
            this.renderWidget('tradingViewChart');
        }
    },

    changeTimeframe(timeframe) {
        this.currentTimeframe = timeframe;
        const intervalMap = {
            '1': '1',
            '5': '5',
            '15': '15',
            '60': '60',
            'D': 'D',
            'W': 'W',
            'M': 'M'
        };
        if (this.widget && this.widget.chart) {
            this.widget.chart().setInterval(intervalMap[timeframe] || 'D');
        }
    },

    getSymbolForCategory(category, ticker) {
        const symbolMap = {
            crypto: {
                'BTCUSD': 'BINANCE:BTCUSD',
                'ETHUSD': 'BINANCE:ETHUSD',
                'BNBUSD': 'BINANCE:BNBUSD',
                'XRPUSD': 'BINANCE:XRPUSD',
                'ADAUSD': 'BINANCE:ADAUSD',
                'SOLUSD': 'BINANCE:SOLUSD',
                'DOTUSD': 'BINANCE:DOTUSD',
                'DOGEUSD': 'BINANCE:DOGEUSD'
            },
            forex: {
                'EURUSD': 'FX:EURUSD',
                'GBPUSD': 'FX:GBPUSD',
                'USDJPY': 'FX:USDJPY',
                'AUDUSD': 'FX:AUDUSD',
                'USDCAD': 'FX:USDCAD',
                'USDCHF': 'FX:USDCHF',
                'NZDUSD': 'FX:NZDUSD',
                'EURGBP': 'FX:EURGBP'
            },
            stock: {
                'AAPL': 'NASDAQ:AAPL',
                'MSFT': 'NASDAQ:MSFT',
                'GOOGL': 'NASDAQ:GOOGL',
                'AMZN': 'NASDAQ:AMZN',
                'TSLA': 'NASDAQ:TSLA',
                'META': 'NASDAQ:META',
                'NVDA': 'NASDAQ:NVDA',
                'JPM': 'NYSE:JPM'
            }
        };
        return symbolMap[category]?.[ticker] || ticker;
    },

    generateTechnicalData() {
        const rsi = (Math.random() * 40 + 30).toFixed(2);
        const macd = ((Math.random() - 0.5) * 0.1).toFixed(4);
        const ma20 = (43000 + Math.random() * 2000).toFixed(0);
        const ma50 = (41500 + Math.random() * 1500).toFixed(0);
        const ma200 = (38000 + Math.random() * 3000).toFixed(0);
        
        let signal = 'Netral';
        let signalClass = 'neutral';
        if (rsi > 70) {
            signal = 'Jual';
            signalClass = 'sell';
        } else if (rsi < 30) {
            signal = 'Beli';
            signalClass = 'buy';
        } else if (rsi > 55) {
            signal = 'Strong Buy';
            signalClass = 'strong-buy';
        } else if (rsi < 45) {
            signal = 'Strong Sell';
            signalClass = 'strong-sell';
        }

        return {
            rsi,
            macd,
            ma20,
            ma50,
            ma200,
            signal,
            signalClass,
            bollinger: Math.random() > 0.5 ? 'Atas Tengah' : 'Tengah Bawah'
        };
    }
};
