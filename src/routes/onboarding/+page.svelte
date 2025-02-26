<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/auth';

	let currentStep = 1;
	let userName = '';
	let userRole = '';
	let userObjective = '';
	let loading = false;
	let showLogo = false;

	interface Option {
		value: string;
		label: string;
	}

	const roleOptions: Option[] = [
		{ value: 'investor', label: 'Investidor' },
		{ value: 'advisor', label: 'Assessor' }
	];

	const objectiveOptions: Option[] = [
		{ value: 'track', label: 'Acompanhar meus investimentos em um só lugar' },
		{ value: 'learn', label: 'Aprender mais sobre investimentos' },
		{ value: 'opportunities', label: 'Buscar oportunidades financeiras' },
		{ value: 'manage', label: 'Gerenciar minha carteira de clientes' },
		{ value: 'partnerships', label: 'Explorar novas parcerias' }
	];

	const steps = [
		{
			title: 'Bem-vindo!',
			subtitle: 'Antes de iniciarmos sua jornada, queremos te conhecer melhor para oferecer a melhor experiência!'
		},
		{
			title: 'Sua Identidade',
			subtitle: 'Conte-nos um pouco sobre você'
		},
		{
			title: 'Personalização',
			subtitle: 'Vamos adaptar sua experiência'
		},
		{
			title: 'Preparando seu Acesso',
			subtitle: 'Quase lá...'
		},
		{
			title: 'Termos de Serviço',
			subtitle: 'Última etapa'
		}
	];

	onMount(() => {
		setTimeout(() => {
			showLogo = true;
		}, 500);
	});

	async function nextStep() {
		if (currentStep < 5) {
			if (currentStep === 3) {
				loading = true;
				await new Promise(resolve => setTimeout(resolve, 3000)); // Simulação de carregamento
				loading = false;
			}
			currentStep++;
		} else {
			loading = true;
			try {
				const response = await fetch('/api/complete-onboarding', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						userName,
						userRole,
						userObjective
					})
				});

				if (response.ok) {
					goto('/terms-of-service');
				} else {
					throw new Error('Falha ao salvar dados do onboarding');
				}
			} catch (error) {
				console.error('Erro ao completar onboarding:', error);
				alert('Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.');
			} finally {
				loading = false;
			}
		}
	}

	function canProceed(): boolean {
		switch (currentStep) {
			case 1:
				return true;
			case 2:
				return userName.length >= 2 && userRole !== '';
			case 3:
				return userObjective !== '';
			case 4:
				return true;
			case 5:
				return true;
			default:
				return false;
		}
	}

	function getMotivationalMessage(): string {
		if (userRole === 'advisor') {
			return 'Agora que você está a bordo, vamos te levar ao próximo nível do mercado financeiro!';
		}
		return 'Seu primeiro passo no Horizonte de Eventos já foi dado. Prepare-se para explorar novas oportunidades!';
	}
</script>

<div class="min-h-screen bg-black text-white flex items-center justify-center p-4">
	<div class="w-full max-w-2xl bg-gray-900/50 backdrop-blur-lg rounded-xl border border-white/10 p-8 relative overflow-hidden">
		<!-- Background Animation -->
		<div class="absolute inset-0 overflow-hidden">
			<div class="stars absolute inset-0"></div>
			{#if currentStep === 4}
				<div class="shooting-stars"></div>
			{/if}
		</div>

		<!-- Progress Indicator -->
		<div class="relative z-10 flex justify-between mb-8">
			{#each Array(5) as _, i}
				<div class="flex items-center">
					<div class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
						{i + 1 <= currentStep ? 'border-green-500 bg-green-500/20' : 'border-gray-600 bg-gray-800/50'}">
						{#if i + 1 < currentStep}
							<span class="text-green-500">✓</span>
						{:else}
							<span class="text-gray-400">{i + 1}</span>
						{/if}
					</div>
					{#if i < 4}
						<div class="h-1 w-full mx-2 rounded
							{i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-600'}"></div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Content -->
		<div class="relative z-10">
			{#if currentStep === 1}
				<div in:fly={{ y: 50, duration: 500 }} out:fade>
					<div class="flex justify-center mb-8">
						{#if showLogo}
							<img
								src="/images/Logo-Gravity.png"
								alt="Logo"
								class="w-32 h-32 animate-pulse"
								transition:fade
							/>
						{/if}
					</div>
					<h2 class="text-3xl font-bold text-center mb-4">{steps[0].title}</h2>
					<p class="text-center text-gray-300 mb-8">{steps[0].subtitle}</p>
				</div>
			{:else if currentStep === 2}
				<div in:fly={{ y: 50, duration: 500 }} out:fade>
					<h2 class="text-3xl font-bold text-center mb-4">{steps[1].title}</h2>
					<p class="text-center text-gray-300 mb-8">{steps[1].subtitle}</p>
					
					<div class="space-y-6">
						<div>
							<label class="block text-sm font-medium text-gray-300 mb-2">
								Como gostaria de ser chamado?
							</label>
							<input
								type="text"
								bind:value={userName}
								class="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg focus:outline-none focus:border-green-500 text-white"
								placeholder="Seu nome"
							/>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-300 mb-2">
								Qual sua relação com o mercado?
							</label>
							<div class="grid grid-cols-2 gap-4">
								{#each roleOptions as option}
									<button
										class="p-4 border rounded-lg transition-all duration-300 {userRole === option.value ? 'border-green-500 bg-green-500/20' : 'border-white/20 bg-black/50 hover:border-green-500/50'}"
										on:click={() => userRole = option.value}
									>
										{option.label}
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{:else if currentStep === 3}
				<div in:fly={{ y: 50, duration: 500 }} out:fade>
					<h2 class="text-3xl font-bold text-center mb-4">{steps[2].title}</h2>
					<p class="text-center text-gray-300 mb-8">{steps[2].subtitle}</p>
					
					<div>
						<label class="block text-sm font-medium text-gray-300 mb-4">
							Qual o seu objetivo principal na plataforma?
						</label>
						<div class="grid gap-4">
							{#each objectiveOptions as option}
								{#if option.value !== 'manage' || userRole === 'advisor'}
									<button
										class="p-4 border rounded-lg text-left transition-all duration-300 {userObjective === option.value ? 'border-green-500 bg-green-500/20' : 'border-white/20 bg-black/50 hover:border-green-500/50'}"
										on:click={() => userObjective = option.value}
									>
										{option.label}
									</button>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			{:else if currentStep === 4}
				<div in:fly={{ y: 50, duration: 500 }} out:fade class="text-center">
					<h2 class="text-3xl font-bold mb-4">{steps[3].title}</h2>
					{#if loading}
						<div class="flex flex-col items-center space-y-4">
							<div class="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
							<p class="text-gray-300">Carregando seu acesso...</p>
						</div>
					{:else}
						<p class="text-xl text-gray-300 mb-8">{getMotivationalMessage()}</p>
					{/if}
				</div>
			{:else if currentStep === 5}
				<div in:fly={{ y: 50, duration: 500 }} out:fade>
					<h2 class="text-3xl font-bold text-center mb-4">{steps[4].title}</h2>
					<p class="text-center text-gray-300 mb-8">{steps[4].subtitle}</p>
					<p class="text-center mb-4">
						Você será redirecionado para aceitar os termos de serviço.
					</p>
				</div>
			{/if}

			<!-- Navigation -->
			<div class="mt-8 flex justify-end">
				<button
					on:click={nextStep}
					disabled={!canProceed() || loading}
					class="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold
						   hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						   disabled:opacity-50 disabled:cursor-not-allowed
						   transition duration-150 ease-in-out"
				>
					{currentStep === 5 ? 'Continuar para os Termos' : 'Avançar'}
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.stars {
		background-image: 
			radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
			radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
			radial-gradient(1px 1px at 50px 160px, #fff, rgba(0,0,0,0)),
			radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
			radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)),
			radial-gradient(1px 1px at 160px 120px, #fff, rgba(0,0,0,0));
		background-repeat: repeat;
		background-size: 200px 200px;
		animation: twinkle 4s infinite;
	}

	@keyframes twinkle {
		0% { opacity: 0.3; }
		50% { opacity: 0.6; }
		100% { opacity: 0.3; }
	}

	.shooting-stars {
		position: absolute;
		width: 100%;
		height: 100%;
		transform: rotate(-45deg);
	}

	.shooting-stars::before,
	.shooting-stars::after {
		content: "";
		position: absolute;
		width: 100px;
		height: 2px;
		background: linear-gradient(90deg, white, transparent);
		animation: shooting 3s infinite linear;
	}

	.shooting-stars::after {
		animation-delay: 1.5s;
	}

	@keyframes shooting {
		0% {
			transform: translateX(-100px) translateY(-100px);
			opacity: 1;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: translateX(300px) translateY(300px);
			opacity: 0;
		}
	}
</style> 