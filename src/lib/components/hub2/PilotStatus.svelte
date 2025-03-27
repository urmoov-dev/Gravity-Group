<script lang="ts">
    import { formatCurrency } from '$lib/utils/format';
    
    // Props para receber os dados do usuário
    export let level: number = 1;
    export let rank: string = 'Explorador Iniciante';
    export let balance: number = 0;
    
    // Badges baseados no nível
    const badges = [
        { level: 1, icon: '🌑', color: '#888888', next: 'Explorador Estelar' },
        { level: 2, icon: '🌓', color: '#cc4422', next: 'Navegador Galáctico' },
        { level: 3, icon: '🌔', color: '#ddaa88', next: 'Comandante Estelar' },
        { level: 4, icon: '🌕', color: '#ddcc99', next: 'Almirante Cósmico' },
        { level: 5, icon: '⭐', color: '#ffcc00', next: null }
    ];
    
    // Determina o badge atual e o próximo baseado no nível
    $: currentBadge = badges.find(b => b.level === level) || badges[0];
    $: nextBadge = level < 5 ? badges.find(b => b.level === level + 1) : null;
    
    // Calcula progresso para o próximo nível (simulado)
    $: progressToNext = Math.min(100, (level % 1) * 100 || 75);
</script>

<div class="pilot-status">
    <div class="badge-container">
        <div class="badge" style="--badge-color: {currentBadge.color}">
            <span class="badge-icon">{currentBadge.icon}</span>
        </div>
        <div class="rank-info">
            <h3 class="rank-title">{rank}</h3>
            <div class="level-tag">Nível {level}</div>
        </div>
    </div>
    
    <div class="stats-grid">
        <div class="stat-item">
            <span class="stat-label">Portfólio</span>
            <span class="stat-value">{formatCurrency(balance)}</span>
        </div>
        
        <div class="stat-item">
            <span class="stat-label">Rendimento</span>
            <span class="stat-value up">+5.8%</span>
        </div>
        
        <div class="stat-item">
            <span class="stat-label">Operações</span>
            <span class="stat-value">32</span>
        </div>
        
        <div class="stat-item">
            <span class="stat-label">Ativos</span>
            <span class="stat-value">18</span>
        </div>
    </div>
    
    {#if nextBadge}
        <div class="progression">
            <div class="progression-header">
                <span>Progresso para {nextBadge.next}</span>
                <span class="progression-percentage">{progressToNext}%</span>
            </div>
            <div class="progression-bar">
                <div class="progression-fill" style="width: {progressToNext}%"></div>
            </div>
        </div>
    {/if}
    
    <div class="action-buttons">
        <button class="action-button primary">
            <span class="icon">💼</span>
            <span>Meu Portfólio</span>
        </button>
        <button class="action-button secondary">
            <span class="icon">📈</span>
            <span>Histórico</span>
        </button>
    </div>
</div>

<style>
    .pilot-status {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        height: 100%;
    }
    
    .badge-container {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .badge {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--badge-color) 0%, rgba(0, 0, 0, 0.7) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.1);
    }
    
    .badge-icon {
        font-size: 1.8rem;
    }
    
    .rank-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .rank-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0;
        color: white;
    }
    
    .level-tag {
        font-size: 0.8rem;
        padding: 0.2rem 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50px;
        width: fit-content;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .stat-item {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .stat-label {
        font-size: 0.8rem;
        opacity: 0.7;
    }
    
    .stat-value {
        font-size: 1.1rem;
        font-weight: 600;
        color: white;
    }
    
    .stat-value.up {
        color: rgb(74, 222, 128);
    }
    
    .stat-value.down {
        color: rgb(248, 113, 113);
    }
    
    .progression {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .progression-header {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
    }
    
    .progression-percentage {
        font-weight: 600;
    }
    
    .progression-bar {
        height: 0.5rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50px;
        overflow: hidden;
    }
    
    .progression-fill {
        height: 100%;
        border-radius: 50px;
        background: linear-gradient(90deg, rgba(74, 222, 128, 0.8) 0%, rgba(34, 211, 238, 0.8) 100%);
    }
    
    .action-buttons {
        display: flex;
        gap: 0.75rem;
        margin-top: auto;
    }
    
    .action-button {
        flex: 1;
        padding: 0.75rem;
        border-radius: 8px;
        border: none;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.2s ease;
    }
    
    .action-button.primary {
        background: linear-gradient(135deg, rgba(74, 222, 128, 0.3) 0%, rgba(34, 211, 238, 0.3) 100%);
        color: white;
        border: 1px solid rgba(74, 222, 128, 0.3);
    }
    
    .action-button.secondary {
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .action-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .action-button.primary:hover {
        background: linear-gradient(135deg, rgba(74, 222, 128, 0.4) 0%, rgba(34, 211, 238, 0.4) 100%);
    }
    
    .action-button.secondary:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .icon {
        font-size: 1.1rem;
    }
</style> 