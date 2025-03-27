<script lang="ts">
	import { formatCurrency } from '$lib/utils/format';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase';
	import { fade, fly } from 'svelte/transition';

	// Componentes importados
	import PilotStatus from '$lib/components/hub2/PilotStatus.svelte';
	import MarketRadar from '$lib/components/hub2/MarketRadar.svelte';
	import TacticalAnalysis from '$lib/components/hub2/TacticalAnalysis.svelte';
	import ModernBackground from '$lib/components/ModernBackground.svelte';

	// Dados do usuário
	let userProfile = {
		name: 'Comandante',
		avatar: '/images/default-avatar.png',
		balance: 125000,
		level: 2,
		rank: 'Explorador Estelar'
	};

	// Função para formatar moeda
	function formatMoney(value: number): string {
		return formatCurrency(value);
	}

	// Função para lidar com o clique no perfil
	function handleProfileClick() {
		goto('/profile');
	}

	// Verificação de autenticação
	onMount(() => {
		auth.onAuthStateChanged((user) => {
			if (!user) {
				goto('/login');
			} else {
				// Aqui você atualizaria os dados do usuário com dados reais
				// userProfile = ... (dados do firebase)
			}
		});
	});
</script>

<div class="hub-container">
	<!-- Fundo moderno e neutro -->
	<ModernBackground />
	
	<!-- Overlay de gradiente sutil -->
	<div class="gradient-overlay"></div>

	<!-- Barra superior -->
	<div class="top-bar" transition:fade={{ duration: 300 }}>
		<div class="logo">
			<img src="/images/gravity-logo.png" alt="Gravity Group" />
			<span class="logo-text">GRAVITY HUB</span>
		</div>
		
		<div class="user-profile" on:click={handleProfileClick} on:keydown={event => event.key === 'Enter' && handleProfileClick()}>
			<div class="profile-info">
				<span class="user-name">{userProfile.name}</span>
				<span class="user-balance">{formatMoney(userProfile.balance)}</span>
			</div>
			<div class="avatar">
				<img src={userProfile.avatar} alt="Avatar" />
			</div>
		</div>
	</div>

	<!-- Conteúdo principal -->
	<div class="dashboard-content">
		<!-- Janela de status do piloto -->
		<div class="dashboard-panel pilot-status" transition:fly={{ y: 20, duration: 400 }}>
			<div class="panel-header">
				<h2>Status do Piloto</h2>
			</div>
			<div class="panel-content">
				<PilotStatus 
					level={userProfile.level} 
					rank={userProfile.rank} 
					balance={userProfile.balance} 
				/>
			</div>
		</div>

		<!-- Janela de radar de mercado -->
		<div class="dashboard-panel market-radar" transition:fly={{ y: 20, duration: 400, delay: 100 }}>
			<div class="panel-header">
				<h2>Radar de Mercado</h2>
			</div>
			<div class="panel-content">
				<MarketRadar />
			</div>
		</div>

		<!-- Janela de análise tática -->
		<div class="dashboard-panel tactical-analysis" transition:fly={{ y: 20, duration: 400, delay: 200 }}>
			<div class="panel-header">
				<h2>Análise Tática</h2>
			</div>
			<div class="panel-content">
				<TacticalAnalysis />
			</div>
		</div>
	</div>
</div>

<style>
	.hub-container {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		color: #e0e0e0;
		font-family: 'Inter', sans-serif;
	}

	.gradient-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(20, 20, 25, 0.4) 0%, rgba(10, 10, 15, 0.7) 100%);
		z-index: 1;
		pointer-events: none;
	}

	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background: rgba(25, 25, 30, 0.8);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		position: relative;
		z-index: 10;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.logo img {
		height: 2rem;
		width: auto;
	}

	.logo-text {
		font-weight: 700;
		font-size: 1.25rem;
		letter-spacing: 1px;
		color: white;
	}

	.user-profile {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem 1rem;
		border-radius: 50px;
		background: rgba(255, 255, 255, 0.05);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.user-profile:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	.profile-info {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.user-name {
		font-weight: 600;
		font-size: 0.9rem;
	}

	.user-balance {
		font-size: 0.8rem;
		opacity: 0.8;
	}

	.avatar {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		overflow: hidden;
		border: 2px solid rgba(255, 255, 255, 0.2);
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.dashboard-content {
		flex: 1;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 1.5rem;
		padding: 1.5rem;
		position: relative;
		z-index: 5;
	}

	.dashboard-panel {
		background: rgba(30, 30, 35, 0.7);
		border-radius: 12px;
		backdrop-filter: blur(10px);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.05);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.dashboard-panel:hover {
		transform: translateY(-3px);
		box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
	}

	.panel-header {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		background: rgba(20, 20, 25, 0.5);
	}

	.panel-header h2 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: white;
	}

	.panel-content {
		padding: 1.5rem;
		flex: 1;
		overflow: auto;
	}

	/* Responsividade */
	@media (max-width: 1200px) {
		.dashboard-content {
			grid-template-columns: 1fr 1fr;
		}
		
		.tactical-analysis {
			grid-column: span 2;
		}
	}

	@media (max-width: 768px) {
		.dashboard-content {
			grid-template-columns: 1fr;
		}
		
		.dashboard-panel {
			grid-column: span 1;
		}
		
		.top-bar {
			padding: 0.75rem 1rem;
		}
	}
</style> 