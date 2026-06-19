const App = {
    currentCategory: 'crypto',
    currentSymbol: 'BTCUSD',
    data: {
        crypto: [],
        forex: [],
        stock: []
    },
    previousPrices: new Map(),
    isRealTimeActive: false,
    refreshInterval: null,
    settingsOpen: false,

    async init() {
        this.bindEvents();
        this.loadSettings();
        await this.loadInitialData();
        this.renderOverviewCards();
        this.renderWatchlist();
        this.renderMarketStatus();
        Charts.init('BINANCE:BTCUSD', 'tradingViewChart');
        this.updateAnalysis();
        this.startRealTimeUpdates();
        this.updateConnectionStatus();
    },

    bindEvents() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCategoryChange(e));
        });

        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTimeframeChange(e));
        });

        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
    },

    async loadInitialData() {
        const loading = document.getElementById('overviewCards');
        loading.innerHTML = '<div class="loading"></div>';

        this.data.crypto = await API.fetchCryptoData();
        
        try {
            this.data.forex = await API.fetchAllForexData();
        } catch (error) {
            this.data.forex = API.getForexData();
        }
        
        try {
            this.data.stock = await API.fetchAllStockData();
        } catch (error) {
            this.data.stock = API.getStockData();
        }
    },

    handleCategoryChange(e) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentCategory = e.target.dataset.category;
        
        const firstSymbol = this.getFirstSymbol(this.currentCategory);
        this.currentSymbol = firstSymbol;
        
        this.renderOverviewCards();
        this.renderWatchlist();
        this.changeChart();
        this.updateAnalysis();
    },

    handleTimeframeChange(e) {
        document.querySelectorAll('.timeframe-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        Charts.changeTimeframe(e.target.dataset.tf);
    },

    handleSearch() {
        const input = document.getElementById('searchInput').value.toUpperCase().trim();
        if (!input) return;

        const category = this.determineCategory(input);
        if (category) {
            this.currentCategory = category;
            this.currentSymbol = input;
            
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === category);
            });
            
            this.changeChart();
            this.updateAnalysis();
            document.getElementById('searchInput').value = '';
        }
    },

    determineCategory(symbol) {
        if (/^(BTC|ETH|BNB|XRP|ADA|SOL|DOT|DOGE)/i.test(symbol)) return 'crypto';
        if (/^(EUR|GBP|USD|AUD|CAD|CHF|NZD|JPY)/i.test(symbol)) return 'forex';
        return 'stock';
    },

    getFirstSymbol(category) {
        const symbols = {
            crypto: 'BTCUSD',
            forex: 'EURUSD',
            stock: 'AAPL'
        };
        return symbols[category];
    },

    renderOverviewCards() {
        const container = document.getElementById('overviewCards');
        let items = [];

        switch (this.currentCategory) {
            case 'crypto':
                items = this.data.crypto.map(coin => ({
                    symbol: coin.symbol.toUpperCase() + 'USD',
                    name: coin.name,
                    price: API.formatPrice(coin.current_price, 'crypto'),
                    change: coin.price_change_percentage_24h,
                    icon: this.getCryptoIcon(coin.symbol)
                }));
                break;
            case 'forex':
                items = this.data.forex.map(fx => ({
                    symbol: fx.symbol,
                    name: fx.name,
                    price: fx.price,
                    change: parseFloat(fx.change_24h),
                    icon: '💱'
                }));
                break;
            case 'stock':
                items = this.data.stock.map(stock => ({
                    symbol: stock.symbol,
                    name: stock.name,
                    price: API.formatPrice(stock.price, 'stock'),
                    change: stock.change,
                    icon: '📊'
                }));
                break;
        }

        container.innerHTML = items.map(item => `
            <div class="overview-card" data-symbol="${item.symbol}" onclick="App.selectSymbol('${item.symbol}')">
                <div class="symbol">${item.icon} ${item.symbol}</div>
                <div class="price">${item.price}</div>
                <div class="change ${item.change >= 0 ? 'positive' : 'negative'}">
                    ${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%
                </div>
                <div class="live-indicator" id="live-${item.symbol}">
                    <span class="live-dot"></span>
                </div>
            </div>
        `).join('');
    },

    getCryptoIcon(symbol) {
        const icons = {
            btc: '₿',
            eth: 'Ξ',
            bnb: 'BNB',
            xrp: '✕',
            ada: '₳',
            sol: 'SOL',
            dot: '●',
            doge: 'Ð'
        };
        return icons[symbol.toLowerCase()] || '🪙';
    },

    selectSymbol(symbol) {
        this.currentSymbol = symbol;
        this.changeChart();
        this.updateAnalysis();
    },

    changeChart() {
        const tvSymbol = Charts.getSymbolForCategory(this.currentCategory, this.currentSymbol);
        Charts.changeSymbol(tvSymbol);
        
        const names = {
            crypto: this.data.crypto.find(c => c.symbol.toUpperCase() + 'USD' === this.currentSymbol)?.name || '',
            forex: this.data.forex.find(f => f.symbol === this.currentSymbol)?.name || '',
            stock: this.data.stock.find(s => s.symbol === this.currentSymbol)?.name || ''
        };
        
        document.getElementById('currentSymbol').textContent = 
            `${this.currentSymbol} - ${names[this.currentCategory] || this.currentSymbol}`;
    },

    updateAnalysis() {
        const techData = Charts.generateTechnicalData();
        
        document.querySelector('.signal-value').textContent = techData.signal;
        document.querySelector('.signal').className = `signal ${techData.signalClass}`;
        
        document.getElementById('rsiValue').textContent = techData.rsi;
        document.getElementById('macdValue').textContent = techData.macd;
        document.getElementById('ma20Value').textContent = '$' + parseInt(techData.ma20).toLocaleString();
        document.getElementById('ma50Value').textContent = '$' + parseInt(techData.ma50).toLocaleString();
        document.getElementById('ma200Value').textContent = '$' + parseInt(techData.ma200).toLocaleString();
        document.getElementById('bollingerValue').textContent = techData.bollinger;

        this.updateFundamentalData();
        this.updateSentiment();
    },

    updateFundamentalData() {
        let coinData;
        
        switch (this.currentCategory) {
            case 'crypto':
                coinData = this.data.crypto.find(c => c.symbol.toUpperCase() + 'USD' === this.currentSymbol);
                if (coinData) {
                    document.getElementById('marketCap').textContent = '$' + API.formatNumber(coinData.market_cap);
                    document.getElementById('volume24h').textContent = '$' + API.formatNumber(coinData.total_volume);
                    this.updateChangeElement('change24h', coinData.price_change_percentage_24h);
                    this.updateChangeElement('change7d', coinData.price_change_percentage_7d_in_currency);
                    this.updateChangeElement('change30d', coinData.price_change_percentage_30d_in_currency);
                    document.getElementById('ath').textContent = '$' + coinData.ath.toLocaleString();
                }
                break;
            case 'forex':
                const fxData = this.data.forex.find(f => f.symbol === this.currentSymbol);
                if (fxData) {
                    document.getElementById('marketCap').textContent = 'N/A';
                    document.getElementById('volume24h').textContent = '$' + API.formatNumber(parseInt(fxData.volume));
                    this.updateChangeElement('change24h', parseFloat(fxData.change_24h));
                    document.getElementById('change7d').textContent = 'N/A';
                    document.getElementById('change30d').textContent = 'N/A';
                    document.getElementById('ath').textContent = 'N/A';
                }
                break;
            case 'stock':
                const stockData = this.data.stock.find(s => s.symbol === this.currentSymbol);
                if (stockData) {
                    document.getElementById('marketCap').textContent = '$' + API.formatNumber(parseInt(stockData.market_cap));
                    document.getElementById('volume24h').textContent = API.formatNumber(parseInt(stockData.volume));
                    this.updateChangeElement('change24h', stockData.change);
                    document.getElementById('change7d').textContent = 'N/A';
                    document.getElementById('change30d').textContent = 'N/A';
                    document.getElementById('ath').textContent = '$' + (stockData.price * 1.3).toFixed(2);
                }
                break;
        }
    },

    updateChangeElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (value === null || value === undefined) {
            element.textContent = 'N/A';
            element.className = 'fund-value';
            return;
        }
        element.textContent = (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
        element.className = `fund-value ${value >= 0 ? 'positive' : 'negative'}`;
    },

    updateSentiment() {
        const sentiment = Math.floor(Math.random() * 100);
        const gaugeValue = document.getElementById('gaugeValue');
        const gaugeFill = document.querySelector('.gauge-fill');
        const gaugeStatus = document.querySelector('.gauge-status');
        
        gaugeValue.textContent = sentiment;
        gaugeFill.style.width = sentiment + '%';
        
        if (sentiment >= 75) {
            gaugeStatus.textContent = 'Extreme Greed';
            gaugeStatus.style.color = '#3fb950';
            gaugeValue.style.color = '#3fb950';
        } else if (sentiment >= 55) {
            gaugeStatus.textContent = 'Greed';
            gaugeStatus.style.color = '#d29922';
            gaugeValue.style.color = '#d29922';
        } else if (sentiment >= 45) {
            gaugeStatus.textContent = 'Neutral';
            gaugeStatus.style.color = '#8b949e';
            gaugeValue.style.color = '#8b949e';
        } else if (sentiment >= 25) {
            gaugeStatus.textContent = 'Fear';
            gaugeStatus.style.color = '#f85149';
            gaugeValue.style.color = '#f85149';
        } else {
            gaugeStatus.textContent = 'Extreme Fear';
            gaugeStatus.style.color = '#f85149';
            gaugeValue.style.color = '#f85149';
        }

        document.querySelectorAll('.factor-value').forEach(el => {
            const value = Math.random();
            if (value > 0.66) {
                el.textContent = 'Tinggi';
                el.className = 'factor-value high';
            } else if (value > 0.33) {
                el.textContent = 'Sedang';
                el.className = 'factor-value medium';
            } else {
                el.textContent = 'Rendah';
                el.className = 'factor-value low';
            }
        });
    },

    renderWatchlist() {
        const tbody = document.getElementById('watchlistBody');
        let items = [];

        switch (this.currentCategory) {
            case 'crypto':
                items = this.data.crypto.map(coin => ({
                    symbol: coin.symbol.toUpperCase() + 'USD',
                    name: coin.name,
                    price: API.formatPrice(coin.current_price, 'crypto'),
                    change: coin.price_change_percentage_24h,
                    volume: '$' + API.formatNumber(coin.total_volume),
                    marketCap: '$' + API.formatNumber(coin.market_cap)
                }));
                break;
            case 'forex':
                items = this.data.forex.map(fx => ({
                    symbol: fx.symbol,
                    name: fx.name,
                    price: fx.price,
                    change: parseFloat(fx.change_24h),
                    volume: '$' + API.formatNumber(parseInt(fx.volume)),
                    marketCap: 'N/A'
                }));
                break;
            case 'stock':
                items = this.data.stock.map(stock => ({
                    symbol: stock.symbol,
                    name: stock.name,
                    price: API.formatPrice(stock.price, 'stock'),
                    change: stock.change,
                    volume: API.formatNumber(parseInt(stock.volume)),
                    marketCap: '$' + API.formatNumber(parseInt(stock.market_cap))
                }));
                break;
        }

        tbody.innerHTML = items.map(item => `
            <tr data-symbol="${item.symbol}" onclick="App.selectSymbol('${item.symbol}')">
                <td><strong>${item.symbol}</strong><br><small style="color: #8b949e;">${item.name}</small></td>
                <td class="price-cell">${item.price}</td>
                <td class="change-cell ${item.change >= 0 ? 'positive' : 'negative'}">
                    ${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%
                </td>
                <td>${item.volume}</td>
                <td>${item.marketCap}</td>
                <td><button class="action-btn" onclick="event.stopPropagation(); App.selectSymbol('${item.symbol}')">View</button></td>
            </tr>
        `).join('');
    },

    renderMarketStatus() {
        const marketStatus = API.getMarketStatus();
        let statusEl = document.getElementById('marketStatus');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'marketStatus';
            statusEl.className = 'market-status';
            document.querySelector('.header .container').appendChild(statusEl);
        }
        statusEl.innerHTML = `
            <span class="status-dot" style="background: ${marketStatus.color}"></span>
            <span class="status-text">${marketStatus.text}</span>
            <span class="last-update">Last Update: ${new Date().toLocaleTimeString('id-ID')}</span>
        `;
    },

    startRealTimeUpdates() {
        API.startRealTimeUpdates((priceData) => {
            this.handleRealTimeUpdate(priceData);
        });
        
        this.isRealTimeActive = true;
        
        this.refreshInterval = setInterval(async () => {
            await this.loadInitialData();
            this.renderOverviewCards();
            this.renderWatchlist();
            this.renderMarketStatus();
            this.updateAnalysis();
        }, 30000);
    },

    handleRealTimeUpdate(priceData) {
        const symbol = priceData.symbol;
        const previousPrice = this.previousPrices.get(symbol);
        
        this.previousPrices.set(symbol, priceData.price);
        
        const overviewCard = document.querySelector(`.overview-card[data-symbol="${symbol}USD"]`);
        if (overviewCard) {
            const priceEl = overviewCard.querySelector('.price');
            const oldPrice = priceEl.textContent;
            const newPrice = API.formatPrice(priceData.price, 'crypto');
            
            if (oldPrice !== newPrice) {
                priceEl.textContent = newPrice;
                priceEl.classList.add('price-flash');
                setTimeout(() => priceEl.classList.remove('price-flash'), 500);
            }
        }
        
        const watchlistRow = document.querySelector(`#watchlistBody tr[data-symbol="${symbol}USD"]`);
        if (watchlistRow) {
            const priceCell = watchlistRow.querySelector('.price-cell');
            if (priceCell) {
                priceCell.textContent = API.formatPrice(priceData.price, 'crypto');
                priceCell.classList.add('price-flash');
                setTimeout(() => priceCell.classList.remove('price-flash'), 500);
            }
            
            const changeCell = watchlistRow.querySelector('.change-cell');
            if (changeCell) {
                changeCell.textContent = (priceData.change24h >= 0 ? '+' : '') + priceData.change24h.toFixed(2) + '%';
                changeCell.className = `change-cell ${priceData.change24h >= 0 ? 'positive' : 'negative'}`;
            }
        }
        
        if (symbol === this.currentSymbol.replace('USD', '')) {
            this.updateAnalysis();
        }
    },

    async refreshData() {
        await this.loadInitialData();
        this.renderOverviewCards();
        this.renderWatchlist();
        this.renderMarketStatus();
    },

    stopRealTimeUpdates() {
        API.stopRealTimeUpdates();
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        this.isRealTimeActive = false;
    },

    openSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.add('active');
        this.settingsOpen = true;
        
        const apiKeyInput = document.getElementById('apiKeyInput');
        apiKeyInput.value = CONFIG.getApiKey() || '';
        
        this.updateConnectionStatus();
    },

    closeSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.remove('active');
        this.settingsOpen = false;
    },

    saveSettings() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const apiKey = apiKeyInput.value.trim();
        
        if (apiKey) {
            CONFIG.saveApiKey(apiKey);
            this.showToast('API Key berhasil disimpan!', 'success');
        } else {
            CONFIG.saveApiKey('');
            this.showToast('API Key dihapus. Menggunakan data fallback.', 'warning');
        }
        
        const refreshSelect = document.getElementById('refreshInterval');
        const refreshInterval = parseInt(refreshSelect.value);
        localStorage.setItem('refreshInterval', refreshInterval);
        
        this.closeSettings();
        this.restartRealTimeUpdates();
    },

    loadSettings() {
        const savedInterval = localStorage.getItem('refreshInterval');
        if (savedInterval) {
            const refreshSelect = document.getElementById('refreshInterval');
            if (refreshSelect) {
                refreshSelect.value = savedInterval;
            }
        }
    },

    restartRealTimeUpdates() {
        this.stopRealTimeUpdates();
        this.startRealTimeUpdates();
        this.updateConnectionStatus();
    },

    updateConnectionStatus() {
        const binanceStatus = document.getElementById('binanceStatus');
        const avStatus = document.getElementById('avStatus');
        
        if (binanceStatus) {
            if (API.binanceWs.socket && API.binanceWs.socket.readyState === WebSocket.OPEN) {
                binanceStatus.textContent = 'Connected';
                binanceStatus.className = 'status-value connected';
            } else {
                binanceStatus.textContent = 'Disconnected';
                binanceStatus.className = 'status-value disconnected';
            }
        }
        
        if (avStatus) {
            if (CONFIG.hasValidApiKey()) {
                avStatus.textContent = 'Configured';
                avStatus.className = 'status-value connected';
            } else {
                avStatus.textContent = 'Not Configured (Using Fallback)';
                avStatus.className = 'status-value warning';
            }
        }
    },

    showToast(message, type = 'info') {
        const toast = document.getElementById('connectionToast');
        const toastMessage = toast.querySelector('.toast-message');
        const toastIcon = toast.querySelector('.toast-icon');
        
        toastMessage.textContent = message;
        toast.className = `connection-toast ${type} show`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        toastIcon.textContent = icons[type] || icons.info;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    
    window.addEventListener('beforeunload', () => {
        App.stopRealTimeUpdates();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && App.settingsOpen) {
            App.closeSettings();
        }
    });
    
    document.getElementById('settingsModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            App.closeSettings();
        }
    });
});
