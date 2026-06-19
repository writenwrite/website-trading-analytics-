const Calculator = {
    init() {
        this.calculatePosition();
        this.calculateRR();
        this.calculateLeverage();
    },

    calculatePosition() {
        const balance = parseFloat(document.getElementById('calcBalance').value);
        const riskPercent = parseFloat(document.getElementById('calcRisk').value);
        const entry = parseFloat(document.getElementById('calcEntry').value);
        const stopLoss = parseFloat(document.getElementById('calcStopLoss').value);

        if (!balance || !riskPercent || !entry || !stopLoss) {
            return;
        }

        const riskAmount = balance * (riskPercent / 100);
        const riskPerUnit = Math.abs(entry - stopLoss);
        const positionSize = riskAmount / riskPerUnit;
        const positionValue = positionSize * entry;

        const result = document.getElementById('positionResult');
        result.innerHTML = `
            <div class="result-grid">
                <div class="result-item">
                    <span class="result-label">Risk Amount</span>
                    <span class="result-value negative">$${riskAmount.toFixed(2)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Risk Per Unit</span>
                    <span class="result-value">$${riskPerUnit.toFixed(2)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Position Size</span>
                    <span class="result-value highlight">${positionSize.toFixed(6)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Position Value</span>
                    <span class="result-value">$${positionValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
            </div>
            <div class="result-note">
                <p>✦ Dengan balance $${balance.toLocaleString()} dan risk ${riskPercent}%, Anda bisa membeli <strong>${positionSize.toFixed(6)} unit</strong> diharga $${entry.toLocaleString()}</p>
            </div>
        `;
    },

    calculateRR() {
        const entry = parseFloat(document.getElementById('rrEntry').value);
        const stopLoss = parseFloat(document.getElementById('rrStopLoss').value);
        const takeProfit = parseFloat(document.getElementById('rrTakeProfit').value);

        if (!entry || !stopLoss || !takeProfit) {
            return;
        }

        const risk = Math.abs(entry - stopLoss);
        const reward = Math.abs(takeProfit - entry);
        const rrRatio = reward / risk;
        const riskPercent = (risk / entry * 100).toFixed(2);
        const rewardPercent = (reward / entry * 100).toFixed(2);
        const winRate = (1 / (1 + 1 / rrRatio) * 100).toFixed(1);

        const result = document.getElementById('rrResult');
        result.innerHTML = `
            <div class="result-grid">
                <div class="result-item">
                    <span class="result-label">Risk</span>
                    <span class="result-value negative">$${risk.toFixed(2)} (${riskPercent}%)</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Reward</span>
                    <span class="result-value positive">$${reward.toFixed(2)} (${rewardPercent}%)</span>
                </div>
                <div class="result-item big">
                    <span class="result-label">Risk/Reward Ratio</span>
                    <span class="result-value highlight">1 : ${rrRatio.toFixed(2)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Breakeven Win Rate</span>
                    <span class="result-value">${winRate}%</span>
                </div>
            </div>
            <div class="rr-visual">
                <div class="rr-bar">
                    <div class="rr-risk" style="width: ${risk / (risk + reward) * 100}%">
                        <span>Risk ${riskPercent}%</span>
                    </div>
                    <div class="rr-reward" style="width: ${reward / (risk + reward) * 100}%">
                        <span>Reward ${rewardPercent}%</span>
                    </div>
                </div>
            </div>
            <div class="result-note">
                <p>✦ Rasio 1:${rrRatio.toFixed(2)} berarti untuk setiap $1 risiko, potensi profit adalah $${rrRatio.toFixed(2)}</p>
            </div>
        `;
    },

    calculateLeverage() {
        const capital = parseFloat(document.getElementById('levCapital').value);
        const leverage = parseFloat(document.getElementById('levLeverage').value);
        const entry = parseFloat(document.getElementById('levEntry').value);
        const exit = parseFloat(document.getElementById('levExit').value);

        if (!capital || !leverage || !entry || !exit) {
            return;
        }

        const positionSize = capital * leverage;
        const priceChange = (exit - entry) / entry * 100;
        const profit = positionSize * (priceChange / 100);
        const roe = (profit / capital * 100).toFixed(2);
        const liquidationPrice = entry * (1 - 1 / leverage * 0.9);

        const result = document.getElementById('leverageResult');
        result.innerHTML = `
            <div class="result-grid">
                <div class="result-item">
                    <span class="result-label">Position Size</span>
                    <span class="result-value">$${positionSize.toLocaleString()}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Price Change</span>
                    <span class="result-value ${priceChange >= 0 ? 'positive' : 'negative'}">${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Profit/Loss</span>
                    <span class="result-value ${profit >= 0 ? 'positive' : 'negative'}">${profit >= 0 ? '+' : ''}$${Math.abs(profit).toFixed(2)}</span>
                </div>
                <div class="result-item big">
                    <span class="result-label">Return on Equity</span>
                    <span class="result-value ${parseFloat(roe) >= 0 ? 'positive' : 'negative'}">${roe >= 0 ? '+' : ''}${roe}%</span>
                </div>
                <div class="result-item warning">
                    <span class="result-label">Est. Liquidation Price</span>
                    <span class="result-value negative">~$${liquidationPrice.toFixed(2)}</span>
                </div>
            </div>
            <div class="leverage-warning">
                <p>⚠️ Peringatan: Leverage ${leverage}x meningkatkan profit tetapi juga risiko. Selalu gunakan stop loss!</p>
            </div>
        `;
    }
};
