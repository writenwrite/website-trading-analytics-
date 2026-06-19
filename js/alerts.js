const Alerts = {
    alerts: JSON.parse(localStorage.getItem('alerts')) || [],
    checkInterval: null,

    init() {
        this.render();
        this.startChecking();
    },

    openAddModal() {
        document.getElementById('alertModal').classList.add('active');
    },

    closeAddModal() {
        document.getElementById('alertModal').classList.remove('active');
    },

    addAlert() {
        const symbol = document.getElementById('alertSymbol').value;
        const condition = document.getElementById('alertCondition').value;
        const price = parseFloat(document.getElementById('alertPrice').value);
        const message = document.getElementById('alertMessage').value;

        if (!price) {
            App.showToast('Mohon masukkan target harga', 'error');
            return;
        }

        const alert = {
            id: Date.now(),
            symbol,
            condition,
            price,
            message: message || `${condition} ${symbol} at $${price}`,
            active: true,
            createdAt: new Date().toISOString()
        };

        this.alerts.push(alert);
        this.save();
        this.render();
        this.closeAddModal();
        App.showToast('Alert berhasil dibuat', 'success');
    },

    removeAlert(id) {
        this.alerts = this.alerts.filter(alert => alert.id !== id);
        this.save();
        this.render();
        App.showToast('Alert dihapus', 'success');
    },

    toggleAlert(id) {
        const alert = this.alerts.find(a => a.id === id);
        if (alert) {
            alert.active = !alert.active;
            this.save();
            this.render();
        }
    },

    save() {
        localStorage.setItem('alerts', JSON.stringify(this.alerts));
    },

    render() {
        const container = document.getElementById('alertsList');
        if (!container) return;

        if (this.alerts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔔</div>
                    <h3>Belum Ada Alert</h3>
                    <p>Buat price alert untuk mendapat notifikasi saat harga mencapai target tertentu.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.alerts.map(alert => {
            const conditionText = {
                'above': 'Di Atas',
                'below': 'Di Bawah',
                'cross_up': 'Cross Up',
                'cross_down': 'Cross Down'
            };

            return `
                <div class="alert-card ${alert.active ? 'active' : 'inactive'}">
                    <div class="alert-header">
                        <span class="alert-symbol">${alert.symbol}</span>
                        <span class="alert-condition">${conditionText[alert.condition]}</span>
                        <span class="alert-price">$${alert.price.toLocaleString()}</span>
                        <div class="alert-actions">
                            <button class="icon-btn" onclick="Alerts.toggleAlert(${alert.id})" title="${alert.active ? 'Nonaktifkan' : 'Aktifkan'}">
                                ${alert.active ? '⏸' : '▶'}
                            </button>
                            <button class="icon-btn danger" onclick="Alerts.removeAlert(${alert.id})" title="Hapus">✕</button>
                        </div>
                    </div>
                    <div class="alert-body">
                        <span class="alert-message">${alert.message}</span>
                        <span class="alert-time">${new Date(alert.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    startChecking() {
        this.checkInterval = setInterval(() => {
            this.checkAlerts();
        }, 5000);
    },

    checkAlerts() {
        this.alerts.forEach(alert => {
            if (!alert.active) return;

            const currentPrice = this.getCurrentPrice(alert.symbol);
            if (currentPrice === 0) return;

            let triggered = false;

            switch (alert.condition) {
                case 'above':
                    triggered = currentPrice >= alert.price;
                    break;
                case 'below':
                    triggered = currentPrice <= alert.price;
                    break;
            }

            if (triggered) {
                this.triggerAlert(alert, currentPrice);
            }
        });
    },

    getCurrentPrice(symbol) {
        const priceMap = {
            'BTCUSD': 43250 + (Math.random() - 0.5) * 1000,
            'ETHUSD': 2650 + (Math.random() - 0.5) * 100,
            'BNBUSD': 312 + (Math.random() - 0.5) * 10,
            'SOLUSD': 98.5 + (Math.random() - 0.5) * 5,
            'EURUSD': 1.085 + (Math.random() - 0.5) * 0.01,
            'GBPUSD': 1.265 + (Math.random() - 0.5) * 0.01,
            'AAPL': 185.5 + (Math.random() - 0.5) * 5,
            'MSFT': 378.2 + (Math.random() - 0.5) * 10
        };
        return priceMap[symbol] || 0;
    },

    triggerAlert(alert, currentPrice) {
        const notification = {
            title: 'Price Alert Triggered!',
            body: `${alert.symbol} is now $${currentPrice.toFixed(2)}\n${alert.message}`,
            icon: '🔔'
        };

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.body,
                icon: notification.icon
            });
        }

        App.showToast(`${alert.symbol}: ${alert.message} (Current: $${currentPrice.toFixed(2)})`, 'warning');

        alert.active = false;
        this.save();
        this.render();
    },

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
};
