<script lang="ts">
    import { formatPercent } from '$lib/utils/format';
    
    // Dados simulados de mercado
    const marketData = [
        { name: 'IBOVESPA', value: 128750, change: 0.018, icon: '📈' },
        { name: 'S&P 500', value: 4850, change: -0.005, icon: '📉' },
        { name: 'NASDAQ', value: 15230, change: 0.012, icon: '📈' },
        { name: 'Dólar', value: 5.07, change: -0.008, icon: '📉' }
    ];
    
    // Dados simulados de ativos em destaque
    const highlightedAssets = [
        { ticker: 'PETR4', name: 'Petrobras', price: 35.72, change: 0.025, recommendation: 'compra' },
        { ticker: 'VALE3', name: 'Vale', price: 68.45, change: -0.018, recommendation: 'venda' },
        { ticker: 'ITUB4', name: 'Itaú', price: 32.88, change: 0.011, recommendation: 'compra' }
    ];
    
    // Função para determinar a classe baseada na variação
    function getChangeClass(change: number): string {
        return change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    }
    
    // Função para formatar a variação percentual com sinal
    function formatChange(change: number): string {
        return formatPercent(change, { plusSign: true });
    }
</script>

<div class="market-radar">
    <div class="market-indices">
        <h3 class="section-title">Índices de Mercado</h3>
        <div class="indices-grid">
            {#each marketData as index}
                <div class="market-card">
                    <div class="market-card-header">
                        <span class="market-icon">{index.icon}</span>
                        <span class="market-name">{index.name}</span>
                    </div>
                    <div class="market-card-body">
                        <span class="market-value">{index.value.toLocaleString('pt-BR')}</span>
                        <span class="market-change {getChangeClass(index.change)}">
                            {formatChange(index.change)}
                        </span>
                    </div>
                </div>
            {/each}
        </div>
    </div>
    
    <div class="highlighted-assets">
        <h3 class="section-title">Ativos em Destaque</h3>
        <div class="assets-list">
            {#each highlightedAssets as asset}
                <div class="asset-item">
                    <div class="asset-info">
                        <div class="asset-ticker">{asset.ticker}</div>
                        <div class="asset-name">{asset.name}</div>
                    </div>
                    <div class="asset-price">
                        R$ {asset.price.toFixed(2)}
                    </div>
                    <div class="asset-change {getChangeClass(asset.change)}">
                        {formatChange(asset.change)}
                    </div>
                    <div class="asset-recommendation {asset.recommendation}">
                        {asset.recommendation.toUpperCase()}
                    </div>
                </div>
            {/each}
        </div>
    </div>
    
    <div class="market-chart">
        <h3 class="section-title">Tendência IBOVESPA</h3>
        <div class="chart-container">
            <div class="chart-placeholder">
                <div class="chart-line">
                    <svg viewBox="0 0 100 25" preserveAspectRatio="none">
                        <path d="M0,15 C10,12 20,18 30,10 C40,2 50,5 60,8 C70,11 80,19 90,16 L100,13" 
                              stroke="rgba(74, 222, 128, 0.8)" 
                              stroke-width="2" 
                              fill="none" />
                        <path d="M0,15 C10,12 20,18 30,10 C40,2 50,5 60,8 C70,11 80,19 90,16 L100,13" 
                              stroke="none"
                              fill="url(#gradient)" />
                    </svg>
                    <svg width="0" height="0">
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="rgba(74, 222, 128, 0.2)" />
                                <stop offset="100%" stop-color="rgba(74, 222, 128, 0)" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div class="time-indicators">
                    <span>10:00</span>
                    <span>12:00</span>
                    <span>14:00</span>
                    <span>16:00</span>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .market-radar {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        height: 100%;
    }
    
    .section-title {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.75rem 0;
        color: #ffffff;
    }
    
    /* Índices de Mercado */
    .indices-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
    }
    
    .market-card {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .market-card-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .market-icon {
        font-size: 1.1rem;
    }
    
    .market-name {
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .market-card-body {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }
    
    .market-value {
        font-size: 1.1rem;
        font-weight: 600;
        color: white;
    }
    
    .market-change {
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    /* Ativos em Destaque */
    .assets-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .asset-item {
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr 1fr;
        align-items: center;
        padding: 0.75rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        transition: all 0.2s ease;
    }
    
    .asset-item:hover {
        background: rgba(255, 255, 255, 0.05);
    }
    
    .asset-info {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }
    
    .asset-ticker {
        font-weight: 600;
        font-size: 0.9rem;
        color: white;
    }
    
    .asset-name {
        font-size: 0.8rem;
        opacity: 0.7;
    }
    
    .asset-price {
        font-weight: 500;
        font-size: 0.9rem;
    }
    
    .asset-change {
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .asset-recommendation {
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        text-align: center;
        letter-spacing: 0.05em;
    }
    
    .asset-recommendation.compra {
        background: rgba(74, 222, 128, 0.2);
        color: rgb(74, 222, 128);
    }
    
    .asset-recommendation.venda {
        background: rgba(248, 113, 113, 0.2);
        color: rgb(248, 113, 113);
    }
    
    /* Gráfico */
    .chart-container {
        height: 150px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 1rem;
        position: relative;
    }
    
    .chart-placeholder {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    
    .chart-line {
        flex: 1;
        position: relative;
    }
    
    .chart-line svg {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    
    .time-indicators {
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        opacity: 0.6;
        padding-top: 0.5rem;
    }
    
    /* Classes utilitárias */
    .up {
        color: rgb(74, 222, 128);
    }
    
    .down {
        color: rgb(248, 113, 113);
    }
    
    .neutral {
        color: rgb(209, 213, 219);
    }
</style> 