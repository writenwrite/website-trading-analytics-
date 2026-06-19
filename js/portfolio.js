const Portfolio = {
    items: JSON.parse(localStorage.getItem('portfolio')) || [],
    chart: null,

    init() {
        this.render();
        this.updateSummary();
        this.initChart();
    },

    openAddModal() {
        document.getElementById('portfolioModal').classList.add('active');
        document.getElementById('portfolioDate').value = new Date().toISOString().split('T')[0];
    },

    closeAddModal() {
        document.getElementById('portfolioModal').classList.remove('active');
    },

    addAsset() {
        const symbol = document.getElementById('portfolioSymbol').value;
        const qty = parseFloat(document.getElementById('portfolioQty').value);
        const buyPrice = parseFloat(document.getElementById('portfolioBuyPrice').value);
        const date = document.getElementById('portfolioDate').value;

        if (!qty || !buyPrice || !date) {
            App.showToast('Mohon isi semua field', 'error');
            return;
        }

        const item = {
            id: Date.now(),
            symbol,
            quantity: qty,
            buyPrice,
            date,
            currentPrice: buyPrice
        };

        this.items.push(item);
        this.save();
        this.render();
        this.updateSummary();
        this.closeAddModal();
        App.showToast(`${symbol} ditambahkan ke portfolio`, 'success');
    },

    removeAsset(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
        this.render();
        this.updateSummary();
        App.showToast('Aset dihapus dari portfolio', 'success');
    },

    save() {
        localStorage.setItem('portfolio', JSON.stringify(this.items));
    },

    getCurrentPrice(symbol) {
        const priceMap = {
            'BTCUSD': 43250,
            'ETHUSD': 2650,
            'BNBUSD': 312,
            'SOLUSD': 98.5,
            'XRPUSD': 0.62,
            'ADAUSD': 0.58,
            'EURUSD': 1.085,
            'GBPUSD': 1.265,
            'AAPL': 185.5,
            'MSFT': 378.2,
            'GOOGL': 142.8
        };
        return priceMap[symbol] || 0;
    },

    render() {
        const tbody = document.getElementById('portfolioBody');
        if (!tbody) return;

        if (this.items.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        Belum ada aset di portfolio. Klik "Tambah Aset" untuk memulai.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.items.map(item => {
            const currentPrice = this.getCurrentPrice(item.symbol);
            const value = item.quantity * currentPrice;
            const cost = item.quantity * item.buyPrice;
            const pl = value - cost;
            const plPercent = ((currentPrice - item.buyPrice) / item.buyPrice * 100).toFixed(2);

            return `
                <tr>
                    <td><strong>${item.symbol}</strong></td>
                    <td>${item.quantity}</td>
                    <td>$${item.buyPrice.toLocaleString()}</td>
                    <td>$${currentPrice.toLocaleString()}</td>
                    <td>$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td class="${pl >= 0 ? 'positive' : 'negative'}">
                        ${pl >= 0 ? '+' : ''}$${pl.toFixed(2)} (${plPercent}%)
                    </td>
                    <td>
                        <button class="action-btn danger" onclick="Portfolio.removeAsset(${item.id})">Hapus</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    updateSummary() {
        let totalValue = 0;
        let totalCost = 0;

        this.items.forEach(item => {
            const currentPrice = this.getCurrentPrice(item.symbol);
            totalValue += item.quantity * currentPrice;
            totalCost += item.quantity * item.buyPrice;
        });

        const totalPL = totalValue - totalCost;
        const totalChange = totalCost > 0 ? ((totalPL / totalCost) * 100).toFixed(2) : 0;

        const totalValueEl = document.getElementById('totalValue');
        const totalPLEl = document.getElementById('totalPL');
        const totalChangeEl = document.getElementById('totalChange');

        if (totalValueEl) totalValueEl.textContent = '$' + totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (totalPLEl) {
            totalPLEl.textContent = (totalPL >= 0 ? '+' : '') + '$' + totalPL.toFixed(2);
            totalPLEl.className = `summary-value ${totalPL >= 0 ? 'positive' : 'negative'}`;
        }
        if (totalChangeEl) {
            totalChangeEl.textContent = (totalChange >= 0 ? '+' : '') + totalChange + '%';
            totalChangeEl.className = `summary-value ${totalChange >= 0 ? 'positive' : 'negative'}`;
        }
    },

    initChart() {
        const canvas = document.getElementById('portfolioChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.chart = ctx;
        this.drawChart();
    },

    drawChart() {
        if (!this.chart) return;

        const canvas = this.chart.canvas;
        const ctx = this.chart;
        const width = canvas.parentElement.offsetWidth;
        const height = 200;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        if (this.items.length === 0) {
            ctx.fillStyle = '#8b949e';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Tambah aset untuk melihat allocation chart', width / 2, height / 2);
            return;
        }

        const colors = ['#58a6ff', '#3fb950', '#f85149', '#d29922', '#a371f7', '#f0883e'];
        let totalValue = 0;
        const values = this.items.map(item => {
            const value = item.quantity * this.getCurrentPrice(item.symbol);
            totalValue += value;
            return { symbol: item.symbol, value };
        });

        const centerX = width / 3;
        const centerY = height / 2;
        const radius = Math.min(width / 3, height / 2) - 20;

        let startAngle = -Math.PI / 2;
        values.forEach((item, index) => {
            const sliceAngle = (item.value / totalValue) * 2 * Math.PI;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();

            startAngle += sliceAngle;
        });

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#1c2333';
        ctx.fill();

        let legendX = width / 2 + 40;
        let legendY = 30;
        values.forEach((item, index) => {
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(legendX, legendY, 12, 12);

            ctx.fillStyle = '#e6edf3';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`${item.symbol}: ${((item.value / totalValue) * 100).toFixed(1)}%`, legendX + 20, legendY + 10);

            legendY += 25;
        });
    }
};
