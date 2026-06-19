const Compare = {
    chart: null,
    chartCtx: null,

    init() {
        this.initChart();
    },

    initChart() {
        const canvas = document.getElementById('compareChart');
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
        ctx.fillText('Pilih 2 aset dan klik "Compare" untuk memulai', width / 2, height / 2);
    },

    run() {
        const asset1 = document.getElementById('compareAsset1').value;
        const asset2 = document.getElementById('compareAsset2').value;

        if (asset1 === asset2) {
            App.showToast('Pilih 2 aset yang berbeda', 'error');
            return;
        }

        const data1 = this.generateHistoricalData(asset1);
        const data2 = this.generateHistoricalData(asset2);

        this.drawCompareChart(data1, data2, asset1, asset2);
        this.renderCompareTable(data1, data2, asset1, asset2);
    },

    generateHistoricalData(symbol) {
        const basePrice = this.getBasePrice(symbol);
        const data = [];
        let price = basePrice;

        for (let i = 30; i >= 0; i--) {
            const change = (Math.random() - 0.48) * basePrice * 0.03;
            price = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, price + change));
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
            'BNBUSD': 310,
            'SOLUSD': 95,
            'XRPUSD': 0.6,
            'ADAUSD': 0.55,
            'EURUSD': 1.08,
            'GBPUSD': 1.26,
            'AAPL': 185,
            'MSFT': 375,
            'GOOGL': 140
        };
        return prices[symbol] || 100;
    },

    drawCompareChart(data1, data2, symbol1, symbol2) {
        if (!this.chartCtx) return;

        const canvas = this.chartCtx.canvas;
        const ctx = this.chartCtx;
        const width = canvas.parentElement.offsetWidth;
        const height = 300;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        const padding = { top: 30, right: 30, bottom: 50, left: 60 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const normalize = (data, basePrice) => {
            return data.map(d => ((d.price - basePrice) / basePrice) * 100);
        };

        const norm1 = normalize(data1, data1[0].price);
        const norm2 = normalize(data2, data2[0].price);

        const allValues = [...norm1, ...norm2];
        const minVal = Math.min(...allValues) - 5;
        const maxVal = Math.max(...allValues) + 5;

        ctx.strokeStyle = '#30363d';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();

            const value = maxVal - ((maxVal - minVal) / 5) * i;
            ctx.fillStyle = '#8b949e';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(value.toFixed(1) + '%', padding.left - 10, y + 4);
        }

        const drawLine = (data, color) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;

            data.forEach((value, index) => {
                const x = padding.left + (chartWidth / (data.length - 1)) * index;
                const y = padding.top + chartHeight - ((value - minVal) / (maxVal - minVal)) * chartHeight;

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();
        };

        drawLine(norm1, '#58a6ff');
        drawLine(norm2, '#3fb950');

        ctx.fillStyle = '#58a6ff';
        ctx.fillRect(padding.left, height - 20, 12, 12);
        ctx.fillStyle = '#e6edf3';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(symbol1, padding.left + 18, height - 10);

        ctx.fillStyle = '#3fb950';
        ctx.fillRect(padding.left + 100, height - 20, 12, 12);
        ctx.fillStyle = '#e6edf3';
        ctx.fillText(symbol2, padding.left + 118, height - 10);
    },

    renderCompareTable(data1, data2, symbol1, symbol2) {
        const container = document.getElementById('compareTable');
        if (!container) return;

        const stats1 = this.calculateStats(data1);
        const stats2 = this.calculateStats(data2);

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Metrik</th>
                        <th>${symbol1}</th>
                        <th>${symbol2}</th>
                        <th>Winner</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Price Change (30d)</td>
                        <td class="${stats1.change >= 0 ? 'positive' : 'negative'}">${stats1.change >= 0 ? '+' : ''}${stats1.change.toFixed(2)}%</td>
                        <td class="${stats2.change >= 0 ? 'positive' : 'negative'}">${stats2.change >= 0 ? '+' : ''}${stats2.change.toFixed(2)}%</td>
                        <td>${stats1.change > stats2.change ? symbol1 : symbol2}</td>
                    </tr>
                    <tr>
                        <td>Volatility</td>
                        <td>${stats1.volatility.toFixed(2)}%</td>
                        <td>${stats2.volatility.toFixed(2)}%</td>
                        <td>${stats1.volatility < stats2.volatility ? symbol1 : symbol2}</td>
                    </tr>
                    <tr>
                        <td>Max Drawdown</td>
                        <td class="negative">${stats1.maxDrawdown.toFixed(2)}%</td>
                        <td class="negative">${stats2.maxDrawdown.toFixed(2)}%</td>
                        <td>${stats1.maxDrawdown > stats2.maxDrawdown ? symbol1 : symbol2}</td>
                    </tr>
                    <tr>
                        <td>Avg Daily Return</td>
                        <td class="${stats1.avgReturn >= 0 ? 'positive' : 'negative'}">${stats1.avgReturn >= 0 ? '+' : ''}${stats1.avgReturn.toFixed(3)}%</td>
                        <td class="${stats2.avgReturn >= 0 ? 'positive' : 'negative'}">${stats2.avgReturn >= 0 ? '+' : ''}${stats2.avgReturn.toFixed(3)}%</td>
                        <td>${stats1.avgReturn > stats2.avgReturn ? symbol1 : symbol2}</td>
                    </tr>
                    <tr>
                        <td>Sharpe Ratio (est)</td>
                        <td>${stats1.sharpe.toFixed(2)}</td>
                        <td>${stats2.sharpe.toFixed(2)}</td>
                        <td>${stats1.sharpe > stats2.sharpe ? symbol1 : symbol2}</td>
                    </tr>
                </tbody>
            </table>
        `;
    },

    calculateStats(data) {
        const returns = [];
        for (let i = 1; i < data.length; i++) {
            returns.push((data[i].price - data[i - 1].price) / data[i - 1].price * 100);
        }

        const change = ((data[data.length - 1].price - data[0].price) / data[0].price * 100);
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const volatility = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);

        let maxDrawdown = 0;
        let peak = data[0].price;
        data.forEach(d => {
            if (d.price > peak) peak = d.price;
            const drawdown = ((peak - d.price) / peak * 100);
            if (drawdown > maxDrawdown) maxDrawdown = drawdown;
        });

        const sharpe = volatility > 0 ? (avgReturn / volatility) * Math.sqrt(365) : 0;

        return { change, volatility, avgReturn, maxDrawdown, sharpe };
    }
};
