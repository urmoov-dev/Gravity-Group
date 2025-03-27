<script lang="ts">
    import { formatCurrency, formatPercent } from '$lib/utils/format';
    
    // Dados simulados para alertas
    const alerts = [
        { 
            type: 'opportunity', 
            asset: 'PETR4', 
            message: 'Oportunidade de compra', 
            details: 'Preço abaixo da média móvel de 20 dias', 
            priority: 'high',
            icon: '📊' 
        },
        { 
            type: 'warning', 
            asset: 'VALE3', 
            message: 'Alerta de venda', 
            details: 'Resistência importante alcançada', 
            priority: 'medium',
            icon: '⚠️' 
        },
        { 
            type: 'info', 
            asset: 'BBAS3', 
            message: 'Dividendos anunciados', 
            details: 'Data ex: 15/04/2023', 
            priority: 'medium',
            icon: '📅' 
        }
    ];
    
    // Dados simulados para recomendações
    const recommendations = [
        { 
            asset: 'ITUB4', 
            action: 'compra', 
            targetPrice: 35.80, 
            currentPrice: 32.88, 
            potential: 0.089 
        },
        { 
            asset: 'WEGE3', 
            action: 'compra', 
            targetPrice: 42.50, 
            currentPrice: 38.75, 
            potential: 0.097 
        },
        { 
            asset: 'MGLU3', 
            action: 'venda', 
            targetPrice: 3.60, 
            currentPrice: 4.25, 
            potential: -0.153 
        }
    ];
    
    // Função para determinar a classe baseada na ação recomendada
    function getActionClass(action: string): string {
        return action === 'compra' ? 'buy' : 'sell';
    }
    
    // Função para determinar a classe baseada no tipo de alerta
    function getAlertClass(type: string): string {
        switch (type) {
            case 'opportunity': return 'alert-opportunity';
            case 'warning': return 'alert-warning';
            case 'info': return 'alert-info';
            default: return '';
        }
    }
    
    // Função para determinar a classe baseada na prioridade
    function getPriorityClass(priority: string): string {
        switch (priority) {
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            case 'low': return 'priority-low';
            default: return '';
        }
    }
</script>

<div class="tactical-analysis">
    <div class="alerts-section">
        <h3 class="section-title">Alertas Prioritários</h3>
        <div class="alerts-list">
            {#each alerts as alert}
                <div class="alert-item {getAlertClass(alert.type)} {getPriorityClass(alert.priority)}">
                    <div class="alert-icon">{alert.icon}</div>
                    <div class="alert-content">
                        <div class="alert-header">
                            <span class="alert-asset">{alert.asset}</span>
                            <span class="alert-type">{alert.type === 'opportunity' ? 'OPORTUNIDADE' : alert.type === 'warning' ? 'ALERTA' : 'INFO'}</span>
                        </div>
                        <div class="alert-message">{alert.message}</div>
                        <div class="alert-details">{alert.details}</div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
    
    <div class="recommendations-section">
        <h3 class="section-title">Recomendações da IA</h3>
        <div class="recommendations-table">
            <div class="table-header">
                <div class="header-cell">Ativo</div>
                <div class="header-cell">Ação</div>
                <div class="header-cell">Preço Atual</div>
                <div class="header-cell">Alvo</div>
                <div class="header-cell">Potencial</div>
            </div>
            {#each recommendations as rec}
                <div class="table-row">
                    <div class="cell asset-cell">{rec.asset}</div>
                    <div class="cell action-cell">
                        <span class="action-tag {getActionClass(rec.action)}">
                            {rec.action.toUpperCase()}
                        </span>
                    </div>
                    <div class="cell">{formatCurrency(rec.currentPrice, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div class="cell">{formatCurrency(rec.targetPrice, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div class="cell potential-cell {rec.potential > 0 ? 'up' : 'down'}">
                        {formatPercent(rec.potential, { plusSign: true })}
                    </div>
                </div>
            {/each}
        </div>
    </div>
    
    <div class="market-sentiment">
        <h3 class="section-title">Sentimento de Mercado</h3>
        <div class="sentiment-container">
            <div class="sentiment-meter">
                <div class="meter-scale">
                    <div class="scale-segment fear">Medo</div>
                    <div class="scale-segment caution">Cautela</div>
                    <div class="scale-segment neutral">Neutro</div>
                    <div class="scale-segment optimism">Otimismo</div>
                    <div class="scale-segment greed">Ganância</div>
                </div>
                <div class="meter-indicator" style="left: 65%;">
                    <div class="indicator-arrow">▲</div>
                    <div class="indicator-label">Otimismo</div>
                </div>
            </div>
            <div class="sentiment-description">
                O mercado está em fase otimista, com investidores demonstrando confiança moderada. 
                Recomenda-se atenção a ativos cíclicos e de crescimento.
            </div>
        </div>
    </div>
</div>

<style>
    .tactical-analysis {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        height: 100%;
    }
    
    .section-title {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.75rem 0;
        color: white;
    }
    
    /* Seção de Alertas */
    .alerts-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .alert-item {
        display: flex;
        gap: 1rem;
        padding: 0.75rem;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
        border-left: 3px solid transparent;
    }
    
    .alert-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .alert-icon {
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
    }
    
    .alert-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .alert-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .alert-asset {
        font-weight: 600;
        font-size: 1rem;
        color: white;
    }
    
    .alert-type {
        font-size: 0.7rem;
        font-weight: 700;
        padding: 0.1rem 0.5rem;
        border-radius: 50px;
        letter-spacing: 0.05em;
    }
    
    .alert-message {
        font-weight: 500;
        font-size: 0.9rem;
    }
    
    .alert-details {
        font-size: 0.8rem;
        opacity: 0.7;
    }
    
    /* Classes para tipos de alertas */
    .alert-opportunity {
        border-left-color: rgb(74, 222, 128);
    }
    
    .alert-opportunity .alert-type {
        background: rgba(74, 222, 128, 0.2);
        color: rgb(74, 222, 128);
    }
    
    .alert-warning {
        border-left-color: rgb(250, 204, 21);
    }
    
    .alert-warning .alert-type {
        background: rgba(250, 204, 21, 0.2);
        color: rgb(250, 204, 21);
    }
    
    .alert-info {
        border-left-color: rgb(96, 165, 250);
    }
    
    .alert-info .alert-type {
        background: rgba(96, 165, 250, 0.2);
        color: rgb(96, 165, 250);
    }
    
    /* Classes para prioridades */
    .priority-high .alert-icon {
        background: rgba(248, 113, 113, 0.2);
    }
    
    .priority-medium .alert-icon {
        background: rgba(250, 204, 21, 0.2);
    }
    
    .priority-low .alert-icon {
        background: rgba(96, 165, 250, 0.2);
    }
    
    /* Seção de Recomendações */
    .recommendations-table {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        overflow: hidden;
    }
    
    .table-header {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        background: rgba(0, 0, 0, 0.3);
        padding: 0.75rem 1rem;
        font-weight: 600;
        font-size: 0.85rem;
    }
    
    .table-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        font-size: 0.85rem;
        transition: background 0.2s ease;
    }
    
    .table-row:last-child {
        border-bottom: none;
    }
    
    .table-row:hover {
        background: rgba(255, 255, 255, 0.05);
    }
    
    .cell {
        display: flex;
        align-items: center;
    }
    
    .asset-cell {
        font-weight: 600;
        color: white;
    }
    
    .action-tag {
        font-size: 0.7rem;
        font-weight: 700;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        text-align: center;
        letter-spacing: 0.05em;
    }
    
    .action-tag.buy {
        background: rgba(74, 222, 128, 0.2);
        color: rgb(74, 222, 128);
    }
    
    .action-tag.sell {
        background: rgba(248, 113, 113, 0.2);
        color: rgb(248, 113, 113);
    }
    
    .potential-cell {
        font-weight: 600;
    }
    
    .potential-cell.up {
        color: rgb(74, 222, 128);
    }
    
    .potential-cell.down {
        color: rgb(248, 113, 113);
    }
    
    /* Seção de Sentimento */
    .sentiment-container {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 1rem;
    }
    
    .sentiment-meter {
        position: relative;
        height: 40px;
        margin-bottom: 1.5rem;
    }
    
    .meter-scale {
        display: flex;
        height: 100%;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .scale-segment {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .scale-segment.fear {
        background: linear-gradient(to right, rgba(248, 113, 113, 0.9), rgba(248, 113, 113, 0.7));
        color: white;
    }
    
    .scale-segment.caution {
        background: linear-gradient(to right, rgba(250, 204, 21, 0.7), rgba(250, 204, 21, 0.5));
        color: rgba(0, 0, 0, 0.7);
    }
    
    .scale-segment.neutral {
        background: linear-gradient(to right, rgba(209, 213, 219, 0.5), rgba(209, 213, 219, 0.3));
        color: white;
    }
    
    .scale-segment.optimism {
        background: linear-gradient(to right, rgba(52, 211, 153, 0.5), rgba(52, 211, 153, 0.7));
        color: white;
    }
    
    .scale-segment.greed {
        background: linear-gradient(to right, rgba(52, 211, 153, 0.7), rgba(52, 211, 153, 0.9));
        color: white;
    }
    
    .meter-indicator {
        position: absolute;
        top: 100%;
        transform: translateX(-50%);
        text-align: center;
    }
    
    .indicator-arrow {
        font-size: 1.2rem;
        line-height: 1;
        color: white;
    }
    
    .indicator-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: rgba(52, 211, 153, 0.9);
    }
    
    .sentiment-description {
        margin-top: 2rem;
        font-size: 0.85rem;
        line-height: 1.5;
    }
</style> 