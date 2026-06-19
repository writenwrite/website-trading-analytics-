const API = {
    coingecko: {
        baseUrl: 'https://api.coingecko.com/api/v3',
        endpoints: {
            markets: '/coins/markets',
            simple: '/simple/price',
            trending: '/search/trending'
        }
    },

    binanceWs: {
        baseUrl: 'wss://stream.binance.com:9443/ws',
        subscriptions: new Map(),
        socket: null,
        reconnectAttempts: 0,
        maxReconnectAttempts: 5
    },

    alphaVantage: {
        baseUrl: 'https://www.alphavantage.co/query',
        apiKey: 'demo', 
        endpoints: {
            quote: 'GLOBAL_QUOTE',
            intraday: 'TIME_SERIES_INTRADAY',
            forex: 'CURRENCY_EXCHANGE_RATE'
        }
    },

    cryptoSymbols: ['bitcoin', 'ethereum', 'binancecoin', 'ripple', 'cardano', 'solana', 'polkadot', 'dogecoin'],
    
    forexSymbols: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD', 'EURGBP'],
    
    stockSymbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM'],

    priceCache: new Map(),
    updateCallbacks: [],

    async fetchCryptoData(coinIds = this.cryptoSymbols) {
        try {
            const ids = coinIds.join(',');
            const response = await fetch(
                `${this.coingecko.baseUrl}${this.coingecko.endpoints.markets}?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h,7d,30d`
            );
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            return this.getFallbackCryptoData();
        }
    },

    async fetchTrendingCrypto() {
        try {
            const response = await fetch(`${this.coingecko.baseUrl}${this.coingecko.endpoints.trending}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching trending:', error);
            return { coins: [] };
        }
    },

    async fetchCryptoDetail(coinId) {
        try {
            const response = await fetch(
                `${this.coingecko.baseUrl}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
            );
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching crypto detail:', error);
            return null;
        }
    },

    getFallbackCryptoData() {
        return [
            {
                id: 'bitcoin',
                symbol: 'btc',
                name: 'Bitcoin',
                current_price: 43250,
                price_change_percentage_24h: 2.45,
                price_change_percentage_7d_in_currency: 5.12,
                price_change_percentage_30d_in_currency: -3.28,
                market_cap: 832500000000,
                total_volume: 28300000000,
                high_24h: 44100,
                low_24h: 42300,
                ath: 69045,
                sparkline_in_7d: { price: this.generateSparkline(43000, 44000, 168) }
            },
            {
                id: 'ethereum',
                symbol: 'eth',
                name: 'Ethereum',
                current_price: 2650,
                price_change_percentage_24h: 3.12,
                price_change_percentage_7d_in_currency: 7.45,
                price_change_percentage_30d_in_currency: 2.18,
                market_cap: 318000000000,
                total_volume: 15200000000,
                high_24h: 2720,
                low_24h: 2550,
                ath: 4878,
                sparkline_in_7d: { price: this.generateSparkline(2600, 2700, 168) }
            },
            {
                id: 'binancecoin',
                symbol: 'bnb',
                name: 'BNB',
                current_price: 312,
                price_change_percentage_24h: 1.85,
                price_change_percentage_7d_in_currency: 4.32,
                price_change_percentage_30d_in_currency: -1.56,
                market_cap: 48000000000,
                total_volume: 1200000000,
                high_24h: 318,
                low_24h: 305,
                ath: 690,
                sparkline_in_7d: { price: this.generateSparkline(308, 315, 168) }
            },
            {
                id: 'ripple',
                symbol: 'xrp',
                name: 'XRP',
                current_price: 0.62,
                price_change_percentage_24h: -1.25,
                price_change_percentage_7d_in_currency: 2.78,
                price_change_percentage_30d_in_currency: 8.45,
                market_cap: 33500000000,
                total_volume: 1800000000,
                high_24h: 0.65,
                low_24h: 0.60,
                ath: 3.40,
                sparkline_in_7d: { price: this.generateSparkline(0.60, 0.65, 168) }
            },
            {
                id: 'cardano',
                symbol: 'ada',
                name: 'Cardano',
                current_price: 0.58,
                price_change_percentage_24h: 4.52,
                price_change_percentage_7d_in_currency: 9.85,
                price_change_percentage_30d_in_currency: 15.23,
                market_cap: 20500000000,
                total_volume: 850000000,
                high_24h: 0.61,
                low_24h: 0.55,
                ath: 3.09,
                sparkline_in_7d: { price: this.generateSparkline(0.55, 0.60, 168) }
            },
            {
                id: 'solana',
                symbol: 'sol',
                name: 'Solana',
                current_price: 98.50,
                price_change_percentage_24h: 5.78,
                price_change_percentage_7d_in_currency: 12.45,
                price_change_percentage_30d_in_currency: 22.35,
                market_cap: 42000000000,
                total_volume: 2100000000,
                high_24h: 102,
                low_24h: 92,
                ath: 260,
                sparkline_in_7d: { price: this.generateSparkline(92, 100, 168) }
            },
            {
                id: 'polkadot',
                symbol: 'dot',
                name: 'Polkadot',
                current_price: 7.85,
                price_change_percentage_24h: 2.35,
                price_change_percentage_7d_in_currency: 6.78,
                price_change_percentage_30d_in_currency: 10.42,
                market_cap: 10500000000,
                total_volume: 450000000,
                high_24h: 8.15,
                low_24h: 7.50,
                ath: 55,
                sparkline_in_7d: { price: this.generateSparkline(7.50, 8.00, 168) }
            },
            {
                id: 'dogecoin',
                symbol: 'doge',
                name: 'Dogecoin',
                current_price: 0.082,
                price_change_percentage_24h: -0.85,
                price_change_percentage_7d_in_currency: 3.45,
                price_change_percentage_30d_in_currency: 5.67,
                market_cap: 11500000000,
                total_volume: 680000000,
                high_24h: 0.085,
                low_24h: 0.079,
                ath: 0.73,
                sparkline_in_7d: { price: this.generateSparkline(0.078, 0.085, 168) }
            }
        ];
    },

    generateSparkline(min, max, points) {
        const data = [];
        let value = (min + max) / 2;
        for (let i = 0; i < points; i++) {
            value += (Math.random() - 0.5) * (max - min) * 0.1;
            value = Math.max(min, Math.min(max, value));
            data.push(value);
        }
        return data;
    },

    getForexData() {
        return this.forexSymbols.map((symbol, index) => {
            const base = symbol.substring(0, 3);
            const quote = symbol.substring(3, 6);
            const rates = {
                'EUR': 1.085, 'GBP': 1.265, 'USD': 1, 'JPY': 0.0067,
                'AUD': 0.652, 'CAD': 0.735, 'CHF': 1.125, 'NZD': 0.598
            };
            const price = rates[base] / rates[quote];
            const change = (Math.random() - 0.5) * 2;
            return {
                symbol: symbol,
                name: `${base}/${quote}`,
                price: price.toFixed(5),
                change_24h: change.toFixed(2),
                volume: (Math.random() * 500000000 + 100000000).toFixed(0)
            };
        });
    },

    getStockData() {
        const stocks = [
            { symbol: 'AAPL', name: 'Apple Inc.', price: 185.50, change: 1.25 },
            { symbol: 'MSFT', name: 'Microsoft', price: 378.20, change: 0.85 },
            { symbol: 'GOOGL', name: 'Alphabet', price: 142.80, change: -0.45 },
            { symbol: 'AMZN', name: 'Amazon', price: 178.50, change: 2.15 },
            { symbol: 'TSLA', name: 'Tesla', price: 248.75, change: -1.85 },
            { symbol: 'META', name: 'Meta', price: 505.30, change: 1.45 },
            { symbol: 'NVDA', name: 'NVIDIA', price: 875.40, change: 3.25 },
            { symbol: 'JPM', name: 'JPMorgan', price: 195.60, change: 0.35 }
        ];
        return stocks.map(stock => ({
            ...stock,
            volume: (Math.random() * 30000000 + 5000000).toFixed(0),
            market_cap: (stock.price * (Math.random() * 5000000000 + 1000000000)).toFixed(0)
        }));
    },

    getTradingViewSymbol(category, symbol) {
        const prefixes = {
            crypto: 'BINANCE:',
            forex: 'FX:',
            stock: 'NASDAQ:'
        };
        return `${prefixes[category] || ''}${symbol}`;
    },

    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num;
    },

    formatPrice(price, category) {
        if (category === 'forex') return parseFloat(price).toFixed(5);
        if (category === 'crypto' && price < 1) return parseFloat(price).toFixed(4);
        if (category === 'crypto') return parseFloat(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        return parseFloat(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    },

    initWebSocket() {
        if (this.binanceWs.socket && this.binanceWs.socket.readyState === WebSocket.OPEN) {
            return;
        }

        const symbols = ['btcusdt', 'ethusdt', 'bnbusdt', 'xrpusdt', 'adausdt', 'solusdt', 'dotusdt', 'dogeusdt'];
        const streams = symbols.map(s => `${s}@ticker`).join('/');
        
        try {
            this.binanceWs.socket = new WebSocket(`${this.binanceWs.baseUrl}/${streams}`);
            
            this.binanceWs.socket.onopen = () => {
                console.log('WebSocket connected');
                this.binanceWs.reconnectAttempts = 0;
            };
            
            this.binanceWs.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.e === '24hrTicker') {
                    this.handleTickerUpdate(data);
                }
            };
            
            this.binanceWs.socket.onclose = () => {
                console.log('WebSocket disconnected');
                this.attemptReconnect();
            };
            
            this.binanceWs.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Failed to initialize WebSocket:', error);
        }
    },

    attemptReconnect() {
        if (this.binanceWs.reconnectAttempts < this.binanceWs.maxReconnectAttempts) {
            this.binanceWs.reconnectAttempts++;
            setTimeout(() => this.initWebSocket(), 3000 * this.binanceWs.reconnectAttempts);
        }
    },

    handleTickerUpdate(data) {
        const symbol = data.s.replace('USDT', '').toUpperCase();
        const priceData = {
            symbol: symbol,
            price: parseFloat(data.c),
            change24h: parseFloat(data.P),
            volume: parseFloat(data.v),
            high: parseFloat(data.h),
            low: parseFloat(data.l),
            timestamp: Date.now()
        };
        
        this.priceCache.set(symbol, priceData);
        this.notifyUpdateCallbacks(priceData);
    },

    subscribeToUpdates(callback) {
        this.updateCallbacks.push(callback);
    },

    unsubscribeFromUpdates(callback) {
        this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    },

    notifyUpdateCallbacks(data) {
        this.updateCallbacks.forEach(callback => callback(data));
    },

    async fetchForexDataAlphaVantage(symbol) {
        const fromCurrency = symbol.substring(0, 3);
        const toCurrency = symbol.substring(3, 6);
        
        try {
            const response = await fetch(
                `${this.alphaVantage.baseUrl}?function=${this.alphaVantage.endpoints.forex}&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${this.alphaVantage.apiKey}`
            );
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            if (data['Realtime Currency Exchange Rate']) {
                const rate = data['Realtime Currency Exchange Rate'];
                return {
                    symbol: symbol,
                    name: `${fromCurrency}/${toCurrency}`,
                    price: parseFloat(rate['5. Exchange Rate']).toFixed(5),
                    change_24h: ((parseFloat(rate['5. Exchange Rate']) - parseFloat(rate['8. Previous Close'])) / parseFloat(rate['8. Previous Close']) * 100).toFixed(2),
                    volume: rate['6. Volume'] || '0',
                    lastRefreshed: rate['6. Last Refreshed']
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching forex data:', error);
            return null;
        }
    },

    async fetchStockDataAlphaVantage(symbol) {
        try {
            const response = await fetch(
                `${this.alphaVantage.baseUrl}?function=${this.alphaVantage.endpoints.quote}&symbol=${symbol}&apikey=${this.alphaVantage.apiKey}`
            );
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            if (data['Global Quote']) {
                const quote = data['Global Quote'];
                return {
                    symbol: symbol,
                    name: this.getStockName(symbol),
                    price: parseFloat(quote['05. price']).toFixed(2),
                    change: parseFloat(quote['09. change']).toFixed(2),
                    changePercent: parseFloat(quote['10. change percent'].replace('%', '')).toFixed(2),
                    volume: quote['06. volume'],
                    high: quote['03. high'],
                    low: quote['04. low'],
                    marketCap: 'N/A'
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching stock data:', error);
            return null;
        }
    },

    getStockName(symbol) {
        const names = {
            'AAPL': 'Apple Inc.',
            'MSFT': 'Microsoft',
            'GOOGL': 'Alphabet',
            'AMZN': 'Amazon',
            'TSLA': 'Tesla',
            'META': 'Meta',
            'NVDA': 'NVIDIA',
            'JPM': 'JPMorgan'
        };
        return names[symbol] || symbol;
    },

    async fetchAllForexData() {
        const results = [];
        for (const symbol of this.forexSymbols) {
            const data = await this.fetchForexDataAlphaVantage(symbol);
            if (data) {
                results.push(data);
            } else {
                results.push(this.getFallbackForexData(symbol));
            }
        }
        return results;
    },

    async fetchAllStockData() {
        const results = [];
        for (const symbol of this.stockSymbols) {
            const data = await this.fetchStockDataAlphaVantage(symbol);
            if (data) {
                results.push(data);
            } else {
                results.push(this.getFallbackStockData(symbol));
            }
        }
        return results;
    },

    getFallbackForexData(symbol) {
        const base = symbol.substring(0, 3);
        const quote = symbol.substring(3, 6);
        const rates = {
            'EUR': 1.085, 'GBP': 1.265, 'USD': 1, 'JPY': 0.0067,
            'AUD': 0.652, 'CAD': 0.735, 'CHF': 1.125, 'NZD': 0.598
        };
        const price = rates[base] / rates[quote];
        const change = (Math.random() - 0.5) * 2;
        return {
            symbol: symbol,
            name: `${base}/${quote}`,
            price: price.toFixed(5),
            change_24h: change.toFixed(2),
            volume: (Math.random() * 500000000 + 100000000).toFixed(0)
        };
    },

    getFallbackStockData(symbol) {
        const stocks = {
            'AAPL': { name: 'Apple Inc.', price: 185.50 },
            'MSFT': { name: 'Microsoft', price: 378.20 },
            'GOOGL': { name: 'Alphabet', price: 142.80 },
            'AMZN': { name: 'Amazon', price: 178.50 },
            'TSLA': { name: 'Tesla', price: 248.75 },
            'META': { name: 'Meta', price: 505.30 },
            'NVDA': { name: 'NVIDIA', price: 875.40 },
            'JPM': { name: 'JPMorgan', price: 195.60 }
        };
        const stock = stocks[symbol] || { name: symbol, price: 100 };
        return {
            symbol: symbol,
            name: stock.name,
            price: stock.price.toFixed(2),
            change: ((Math.random() - 0.5) * 5).toFixed(2),
            volume: (Math.random() * 30000000 + 5000000).toFixed(0),
            marketCap: (stock.price * (Math.random() * 5000000000 + 1000000000)).toFixed(0)
        };
    },

    startRealTimeUpdates(callback) {
        this.subscribeToUpdates(callback);
        this.initWebSocket();
    },

    stopRealTimeUpdates() {
        if (this.binanceWs.socket) {
            this.binanceWs.socket.close();
            this.binanceWs.socket = null;
        }
        this.updateCallbacks = [];
    },

    getCachedPrice(symbol) {
        return this.priceCache.get(symbol) || null;
    },

    isMarketOpen() {
        const now = new Date();
        const hours = now.getUTCHours();
        const day = now.getUTCDay();
        
        if (day === 0 || day === 6) return false;
        
        const marketOpen = 13.5;
        const marketClose = 20;
        
        return hours >= marketOpen && hours < marketClose;
    },

    getMarketStatus() {
        if (this.isMarketOpen()) {
            return { status: 'open', color: '#3fb950', text: 'Market Open' };
        }
        return { status: 'closed', color: '#f85149', text: 'Market Closed' };
    }
};
