const CONFIG = {
    alphaVantage: {
        apiKey: localStorage.getItem('alphaVantageKey') || '',
        get isValid() {
            return this.apiKey && this.apiKey.length > 0 && this.apiKey !== 'demo';
        }
    },
    
    binance: {
        wsUrl: 'wss://stream.binance.com:9443/ws',
        restUrl: 'https://api.binance.com/api/v3'
    },
    
    coingecko: {
        baseUrl: 'https://api.coingecko.com/api/v3'
    },
    
    refreshIntervals: {
        crypto: 10000,
        forex: 60000,
        stock: 60000
    },
    
    saveApiKey(key) {
        localStorage.setItem('alphaVantageKey', key);
        this.alphaVantage.apiKey = key;
    },
    
    getApiKey() {
        return this.alphaVantage.apiKey;
    },
    
    hasValidApiKey() {
        return this.alphaVantage.isValid;
    }
};
