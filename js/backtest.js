const Backtest = {
    chart: null,
    chartCtx: null,

    init() {
        this.initChart();
    },

    initChart() {
        const canvas = document.getElementById('backtestChart');
        if (!canvas) return;
        this.chartCtx = canvas.getContext('2d');
        this.drawEmptyChart();
    },

    drawEmptyChart() {
        if (!this.chartCtx) return;
        const canvas = this.chartCtx.canvas;
        const ctx = this.chartCtx;
        const width = canvas.parentElement.offsetWidth;
        const height = 300;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#8b949e';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Pilih strategi dan klik "Jalankan Backtest" untuk memulai', width / 2, height / 2);
    },

    run() {
        const symbol = document.getElementById('backtestSymbol').value;
        const strategy = document.getElementById('backtestStrategy').value;
        const period = parseInt(document.getElementById('backtestPeriod').value);

        const priceData = this.generatePriceData(symbol, period);
        const signals = this.generateSignals(priceData, strategy);
        const results = this.calculateResults(priceData, signals);

        this.renderResults(results, symbol, strategy);
        this.drawBacktestChart(priceData, signals, symbol);
    },

    generatePriceData(symbol, days) {
        const basePrice = this.getBasePrice(symbol);
        const data = [];
        let price = basePrice;

        for (let i = days; i >= 0; i--) {
            const change = (Math.random() - 0.48) * basePrice * 0.025;
            price = Math.max(basePrice * 0.7, Math.min(basePrice * 1.3, price + change));
            data.push({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
                price: price
            });
        }

        return data;
    },

    getBasePrice(symbol) {
        const prices = {
            'BTCUSD': 43000,
            'ETHUSD': 2600,
            'BNBUSD': 310
        };
        return prices[symbol] || 100;
    },

    generateSignals(data, strategy) {
        const signals = [];
        let position = null;

        switch (strategy) {
            case 'ma_cross':
                for (let i = 20; i < data.length; i++) {
                    const ma20 = this.calculateMA(data.slice(i - 20, i + 1), 20);
                    const ma50 = i >= 50 ? this.calculateMA(data.slice(i - 50, i + 1), 50) : ma20;
                    const prevMa20 = this.calculateMA(data.slice(i - 21, i), 20);
                    const prevMa50 = i >= 51 ? this.calculateMA(data.slice(i - 51, i), 50) : prevMa20;

                    if (prevMa20 <= prevMa50 && ma20 > ma50 && !position) {
                        signals.push({ index: i, type: 'buy', price: data[i].price });
                        position = 'long';
                    } else if (prevMa20 >= prevMa50 && ma20 < ma50 && position === 'long') {
                        signals.push({ index: i, type: 'sell', price: data[i].price });
                        position = null;
                    }
                }
                break;

            case 'rsi':
                for (let i = 14; i < data.length; i++) {
                    const rsi = this.calculateRSI(data.slice(i - 14, i + 1));
                    if (rsi < 30 && !position) {
                        signals.push({ index: i, type: 'buy', price: data[i].price });
                        position = 'long';
                    } else if (rsi > 70 && position === 'long') {
                        signals.push({ index: i, type: 'sell', price: data[i].price });
                        position = null;
                    }
                }
                break;

            case 'macd':
                for (let i = 26; i < data.length; i++) {
                    const macd = this.calculateMACD(data.slice(0, i + 1));
                    const prevMacd = this.calculateMACD(data.slice(0, i));

                    if (prevMacd <= 0 && macd > 0 && !position) {
                        signals.push({ index: i, type: 'buy', price: data[i].price });
                        position = 'long';
                    } else if (prevMacd >= 0 && macd < 0 && position === 'long') {
                        signals.push({ index: i, type: 'sell', price: data[i].price });
                        position = null;
                    }
                }
                break;
        }

        return signals;
    },

    calculateMA(data, period) {
        const slice = data.slice(-period);
        return slice.reduce((sum, d) => sum + d.price, 0) / slice.length;
    },

    calculateRSI(data) {
        const changes = [];
        for (let i = 1; i < data.length; i++) {
            changes.push(data[i].price - data[i - 1].price);
        }

        const gains = changes.filter(c => c > 0);
        const losses = changes.filter(c => c < 0).map(c => Math.abs(c));

        const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / gains.length : 0;
        const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / losses.length : 0;

        if (avgLoss === 0) return 100;
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    },

    calculateMACD(data) {
        const ema12 = this.calculateEMA(data.map(d => d.price), 12);
        const ema26 = this.calculateEMA(data.map(d => d.price), 26);
        return ema12 - ema26;
    },

    calculateEMA(data, period) {
        const multiplier = 2 / (period + 1);
        let ema = data[0];

        for (let i = 1; i < data.length; i++) {
            ema = (data[i] - ema) * multiplier + ema;
        }

        return ema;
    },

    calculateResults(priceData, signals) {
        let balance = 10000;
        let position = null;
        let trades = [];
        let wins = 0;
        let losses = 0;
        let totalProfit = 0;
        let totalLoss = 0;

        signals.forEach(signal => {
            if (signal.type === 'buy') {
                position = { entry: signal.price, entryIndex: signal.index };
            } else if (signal.type === 'sell' && position) {
                const pnl = ((signal.price - position.entry) / position.entry) * balance;
                balance += pnl;

                trades.push({
                    entry: position.entry,
                    exit: signal.price,
                    pnl: pnl,
                    return: (pnl / (balance - pnl)) * 100
                });

                if (pnl > 0) {
                    wins++;
                    totalProfit += pnl;
                } else {
                    losses++;
                    totalLoss += Math.abs(pnl);
                }

                position = null;
            }
        });

        const totalTrades = wins + losses;
        const winRate = totalTrades > 0 ? (wins / totalTrades * 100) : 0;
        const avgWin = wins > 0 ? totalProfit / wins : 0;
        const avgLoss = losses > 0 ? totalLoss / losses : 0;
        const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
        const finalBalance = balance;
        const totalReturn = ((finalBalance - 10000) / 10000 * 100);

        return {
            initialBalance: 10000,
            finalBalance,
            totalReturn,
            totalTrades,
            wins,
            losses,
            winRate,
            avgWin,
            avgLoss,
            profitFactor,
            trades
        };
    },

    renderResults(results, symbol, strategy) {
        const container = document.getElementById('backtestResults');
        if (!container) return;

        const strategyNames = {
            'ma_cross': 'MA Crossover (20/50)',
            'rsi': 'RSI Overbought/Oversold',
            'macd': 'MACD Crossover'
        };

        container.innerHTML = `
            <div class="backtest-summary">
                <div class="bt-card">
                    <span class="bt-label">Symbol</span>
                    <span class="bt-value">${symbol}</span>
                </div>
                <div class="bt-card">
                    <span class="bt-label">Strategy</span>
                    <span class="bt-value">${strategyNames[strategy]}</span>
                </div>
                <div class="bt-card">
                    <span class="bt-label">Initial Balance</span>
                    <span class="bt-value">$${results.initialBalance.toLocaleString()}</span>
                </div>
                <div class="bt-card">
                    <span class="bt-label">Final Balance</span>
                    <span class="bt-value ${results.finalBalance >= results.initialBalance ? 'positive' : 'negative'}">$${results.finalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <div class="bt-card big">
                    <span class="bt-label">Total Return</span>
                    <span class="bt-value ${results.totalReturn >= 0 ? 'positive' : 'negative'}">${results.totalReturn >= 0 ? '+' : ''}${results.totalReturn.toFixed(2)}%</span>
                </div>
                <div class="bt-card">
                    <span class="bt-label">Total Trades</span>
                    <span class="bt-value">${results.totalTrades}</span>
                </div>
                <div class="bt-card">
                    <span class="bt-label">Win Rate</span>
                    <span class="bt-value">${results.winRate.toFixed(1)}%</span>
                </div>
                <div class="bt-card">
                    <span class="bt-label">Wins / Losses</span>
                    <span class="bt-value"><span class="positive">${results.wins}</span> / <span class="negative">${results.losses}</span></span>
                </div>
                <div class="bt-card">
                    <span class="bt-label">Profit Factor</span>
                    <span class="bt-value">${results.profitFactor === Infinity ? '∞' : results.profitFactor.toFixed(2)}</span>
                </div>
                <div class="bt-card">
                    <span class="bt-label">Avg Win</span>
                    <span class="bt-value positive">+$${results.avgWin.toFixed(2)}</span>
                </div>
                <div class="bt-card">
                    <span class="bt-label">Avg Loss</span>
                    <span class="bt-value negative">-$${results.avgLoss.toFixed(2)}</span>
                </div>
            </div>
            <div class="backtest-trades">
                <h4>Trade History</h4>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Entry</th>
                            <th>Exit</th>
                            <th>P/L</th>
                            <th>Return</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.trades.map((trade, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>$${trade.entry.toFixed(2)}</td>
                                <td>$${trade.exit.toFixed(2)}</td>
                                <td class="${trade.pnl >= 0 ? 'positive' : 'negative'}">${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}</td>
                                <td class="${trade.return >= 0 ? 'positive' : 'negative'}">${trade.return >= 0 ? '+' : ''}${trade.return.toFixed(2)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    drawBacktestChart(priceData, signals, symbol) {
        if (!this.chartCtx) return;

        const canvas = this.chartCtx.canvas;
        const ctx = this.chartCtx;
        const width = canvas.parentElement.offsetWidth;
        const height = 350;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        const padding = { top: 30, right: 30, bottom: 50, left: 70 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const prices = priceData.map(d => d.price);
        const minPrice = Math.min(...prices) * 0.98;
        const maxPrice = Math.max(...prices) * 1.02;

        ctx.strokeStyle = '#30363d';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();

            const price = maxPrice - ((maxPrice - minPrice) / 5) * i;
            ctx.fillStyle = '#8b949e';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('$' + price.toFixed(0), padding.left - 10, y + 4);
        }

        ctx.beginPath();
        ctx.strokeStyle = '#58a6ff';
        ctx.lineWidth = 2;

        priceData.forEach((d, i) => {
            const x = padding.left + (chartWidth / (priceData.length - 1)) * i;
            const y = padding.top + chartHeight - ((d.price - minPrice) / (maxPrice - minPrice)) * chartHeight;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        signals.forEach(signal => {
            const x = padding.left + (chartWidth / (priceData.length - 1)) * signal.index;
            const y = padding.top + chartHeight - ((signal.price - minPrice) / (maxPrice - minPrice)) * chartHeight;

            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = signal.type === 'buy' ? '#3fb950' : '#f85149';
            ctx.fill();

            ctx.fillStyle = signal.type === 'buy' ? '#3fb950' : '#f85149';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(signal.type === 'buy' ? 'B' : 'S', x, y - 12);
        });

        ctx.fillStyle = '#3fb950';
        ctx.beginPath();
        ctx.arc(padding.left + 20, height - 15, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#e6edf3';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Buy', padding.left + 30, height - 11);

        ctx.fillStyle = '#f85149';
        ctx.beginPath();
        ctx.arc(padding.left + 80, height - 15, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#e6edf3';
        ctx.fillText('Sell', padding.left + 90, height - 11);
    }
};
