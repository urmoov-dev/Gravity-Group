<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import ApexCharts from 'apexcharts';
  import { browser } from '$app/environment';
  import type { User } from 'firebase/auth';
  import { investmentLevels } from '$lib/types/profile';
  import type { InvestmentLevel } from '$lib/types/profile';
  import { user } from '$lib/stores/auth';
  import AstronomicalLevel from '$lib/components/AstronomicalLevel.svelte';
  import { profile } from '$lib/stores/profile';

  let loading = true;
  let charts: ApexCharts[] = [];
  let currentValue = 750000; // Exemplo - isso viria do banco de dados
  let currentLevel: InvestmentLevel;
  let nextLevel: InvestmentLevel;
  let progress = 0;
  let showOnboardingButton = false;
  let showTermsButton = false;

  interface Nivel {
    valor: number;
    nome: string;
    icon: string;
    cor: string;
    desc: string;
    distancia: string;
    velocidade: string;
  }

  const META = 10000000; // 10MM
  const niveis: Nivel[] = [
    { 
      valor: 100000, 
      nome: 'Órbita Terrestre', 
      icon: '🛰️', 
      cor: '#22c55e',
      desc: 'Primeira missão espacial iniciada',
      distancia: '400 km da Terra',
      velocidade: '27.000 km/h'
    },
    { 
      valor: 500000, 
      nome: 'Estação Lunar', 
      icon: '🌙', 
      cor: '#3b82f6',
      desc: 'Base estabelecida na Lua',
      distancia: '384.400 km da Terra',
      velocidade: '40.000 km/h'
    },
    { 
      valor: 1000000, 
      nome: 'Colonizador de Marte', 
      icon: '🔴', 
      cor: '#ef4444',
      desc: 'Conquista do Planeta Vermelho',
      distancia: '225M km da Terra',
      velocidade: '100.000 km/h'
    },
    { 
      valor: 5000000, 
      nome: 'Explorador de Júpiter', 
      icon: '🌟', 
      cor: '#8b5cf6',
      desc: 'Dominando o Sistema Solar',
      distancia: '778M km da Terra',
      velocidade: '250.000 km/h'
    },
    { 
      valor: 10000000, 
      nome: 'Viajante Interestelar', 
      icon: '🌌', 
      cor: '#f59e0b',
      desc: 'Além dos limites conhecidos',
      distancia: '4.2 anos-luz',
      velocidade: '500.000 km/h'
    }
  ];

  // Dados fictícios do progresso do usuário
  let historicoInvestimentos = [
    { data: '2023-06', valor: 50000 },
    { data: '2023-07', valor: 75000 },
    { data: '2023-08', valor: 120000 },
    { data: '2023-09', valor: 180000 },
    { data: '2023-10', valor: 250000 },
    { data: '2023-11', valor: 350000 },
    { data: '2023-12', valor: 450000 },
    { data: '2024-01', valor: 600000 }
  ];

  function getNivelAtual(valor: number): Nivel {
    for (let i = niveis.length - 1; i >= 0; i--) {
      if (valor >= niveis[i].valor) return niveis[i];
    }
    return {
      valor: 0,
      nome: 'Iniciante',
      icon: '🌱',
      cor: '#22c55e',
      desc: 'Começando a jornada',
      distancia: '0 km da Terra',
      velocidade: '0 km/h'
    };
  }

  function getProximoNivel(valor: number): Nivel {
    for (let nivel of niveis) {
      if (valor < nivel.valor) return nivel;
    }
    return niveis[niveis.length - 1];
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  function formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  function initializeCharts() {
    if (!browser) return;
    
    // Aguarda o elemento estar disponível no DOM
    setTimeout(() => {
      const element = document.querySelector('#progress-chart');
      if (!element) return;

      const options = {
        series: [{
          name: 'Patrimônio',
          data: historicoInvestimentos.map(h => h.valor)
        }],
        chart: {
          type: 'area',
          height: 350,
          toolbar: { show: false },
          animations: { enabled: true },
          background: 'transparent',
          fontFamily: 'inherit'
        },
        colors: ['#22c55e'], // Verde para combinar com o tema
        stroke: {
          curve: 'smooth',
          width: 2,
          colors: ['#22c55e']
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [0, 100],
            colorStops: [
              {
                offset: 0,
                color: '#22c55e',
                opacity: 0.4
              },
              {
                offset: 100,
                color: '#22c55e',
                opacity: 0.1
              }
            ]
          }
        },
        grid: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          strokeDashArray: 4,
          xaxis: {
            lines: {
              show: true
            }
          }
        },
        xaxis: {
          categories: historicoInvestimentos.map(h => h.data),
          labels: {
            style: { 
              colors: 'rgba(255, 255, 255, 0.6)',
              fontFamily: 'inherit'
            }
          },
          axisBorder: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          axisTicks: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        yaxis: {
          labels: {
            formatter: (value: number) => formatCurrency(value),
            style: { 
              colors: 'rgba(255, 255, 255, 0.6)',
              fontFamily: 'inherit'
            }
          }
        },
        theme: { mode: 'dark' },
        tooltip: {
          theme: 'dark',
          y: {
            formatter: (value: number) => formatCurrency(value)
          }
        }
      };

      if (charts.length === 0) {
        const chart = new ApexCharts(element, options);
        chart.render();
        charts.push(chart);
      }
    }, 100); // Pequeno delay para garantir que o DOM está pronto
  }

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        goto('/login');
      } else {
        loading = false;
        initializeCharts(); // Chama diretamente aqui
      }
    });

    return () => {
      charts.forEach(chart => chart.destroy());
      charts = [];
      unsubscribe();
    };
  });

  $: {
    currentLevel = investmentLevels.find(
      level => currentValue >= level.minValue && 
      (level.maxValue === null || currentValue < level.maxValue)
    ) || investmentLevels[0];

    nextLevel = investmentLevels[investmentLevels.indexOf(currentLevel) + 1];

    if (nextLevel) {
      progress = ((currentValue - currentLevel.minValue) / 
        (nextLevel.minValue - currentLevel.minValue)) * 100;
    } else {
      progress = 100;
    }
  }

  onMount(() => {
    // Verificar cookies
    const termsAccepted = document.cookie.includes('terms_accepted=true');
    const onboardingCompleted = document.cookie.includes('onboarding_completed=true');
    const termsAcceptanceDate = document.cookie.includes('terms_acceptance_date') 
        ? new Date(decodeURIComponent(document.cookie.split('terms_acceptance_date=')[1]?.split(';')[0] || '')).toLocaleDateString('pt-BR')
        : null;

    showTermsButton = termsAccepted;
    showOnboardingButton = onboardingCompleted;

    // Simular um valor para teste (remover em produção)
    profile.updateAmount(100000);
  });

  function handleViewTerms() {
    goto('/terms-history');
  }

  function handleRedoOnboarding() {
    goto('/onboarding');
  }
</script>

<!-- Template HTML -->
{#if loading}
  <div class="min-h-screen bg-black flex items-center justify-center">
    <div class="text-white text-center">
      <div class="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
      <p>Carregando...</p>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-black to-black relative overflow-hidden">
    <!-- Efeito de partículas -->
    <div class="stars absolute inset-0 opacity-50"></div>
    
    <!-- Grid de linhas holográficas -->
    <div class="absolute inset-0" style="
      background-image: linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      transform: perspective(500px) rotateX(60deg) translateY(-100px);
      opacity: 0.2;
    "></div>

    <div class="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Cabeçalho com efeito de brilho -->
      <div class="mb-8 relative">
        <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25"></div>
        <div class="relative bg-black/50 backdrop-blur-xl rounded-lg border border-blue-500/20 p-6">
          <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Seu Perfil Interestelar
          </h1>
          <p class="text-gray-400 mt-2">Navegando pelo cosmos dos investimentos</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Horizonte de Eventos -->
        <div class="lg:col-span-2">
          <div class="bg-black/40 backdrop-blur-xl rounded-xl border border-blue-500/20 overflow-hidden hover:border-blue-400/30 transition-colors duration-500">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-blue-400 mb-6 flex items-center">
                <span class="text-2xl mr-2">🌌</span>
                Horizonte de Eventos
              </h2>
              <AstronomicalLevel showDetails={true} />
            </div>
          </div>

          <!-- Gráfico de Evolução -->
          <div class="mt-8 bg-black/40 backdrop-blur-xl rounded-xl border border-blue-500/20 overflow-hidden hover:border-blue-400/30 transition-colors duration-500">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-blue-400 mb-6 flex items-center">
                <span class="text-2xl mr-2">📈</span>
                Evolução Patrimonial
              </h2>
              <div id="progress-chart" class="w-full h-[350px]"></div>
            </div>
          </div>
        </div>

        <!-- Painel Lateral -->
        <div class="space-y-6">
          <!-- Status dos Documentos -->
          <div class="bg-black/40 backdrop-blur-xl rounded-xl border border-blue-500/20 overflow-hidden hover:border-blue-400/30 transition-colors duration-500">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-blue-400 mb-6 flex items-center">
                <span class="text-2xl mr-2">📋</span>
                Documentos e Preferências
              </h2>
              
              <!-- Status dos Termos -->
              <div class="mb-6 relative">
                <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-sm"></div>
                <div class="relative bg-black/30 p-4 rounded-lg border border-blue-500/10">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-white">Termos de Serviço</h3>
                    {#if showTermsButton}
                      <button
                        on:click={() => goto('/terms-history')}
                        class="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-2 group"
                      >
                        <span>Ver histórico</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    {/if}
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span class="text-sm text-gray-400">
                      Aceito em {new Date().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Status do Onboarding -->
              <div class="relative">
                <div class="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-sm"></div>
                <div class="relative bg-black/30 p-4 rounded-lg border border-blue-500/10">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-white">Processo de Onboarding</h3>
                    {#if showOnboardingButton}
                      <button 
                        on:click={handleRedoOnboarding}
                        class="px-3 py-1 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-md transition-colors flex items-center space-x-2 group"
                      >
                        <span>Refazer</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    {/if}
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span class="text-sm text-gray-400">Completo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configurações -->
          <div class="bg-black/40 backdrop-blur-xl rounded-xl border border-blue-500/20 overflow-hidden hover:border-blue-400/30 transition-colors duration-500">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-blue-400 mb-6 flex items-center">
                <span class="text-2xl mr-2">⚙️</span>
                Configurações
              </h2>
              
              <!-- Notificações -->
              <div class="flex items-center justify-between p-4 bg-black/30 rounded-lg mb-4 border border-blue-500/10">
                <div>
                  <h3 class="text-white mb-1 flex items-center">
                    <span class="text-lg mr-2">🔔</span>
                    Notificações
                  </h3>
                  <p class="text-sm text-gray-400">Receba alertas importantes</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <!-- Modo Escuro -->
              <div class="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-blue-500/10">
                <div>
                  <h3 class="text-white mb-1 flex items-center">
                    <span class="text-lg mr-2">🌙</span>
                    Modo Escuro
                  </h3>
                  <p class="text-sm text-gray-400">Ajuste o tema da interface</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .stars {
    background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.8), rgba(0,0,0,0)),
      radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.8), rgba(0,0,0,0)),
      radial-gradient(2px 2px at 50px 160px, rgba(255, 255, 255, 0.8), rgba(0,0,0,0)),
      radial-gradient(2px 2px at 90px 40px, rgba(255, 255, 255, 0.8), rgba(0,0,0,0)),
      radial-gradient(2px 2px at 130px 80px, rgba(255, 255, 255, 0.8), rgba(0,0,0,0)),
      radial-gradient(2px 2px at 160px 120px, rgba(255, 255, 255, 0.8), rgba(0,0,0,0));
    background-repeat: repeat;
    background-size: 200px 200px;
    animation: twinkle 4s infinite;
  }

  @keyframes twinkle {
    0% { opacity: 0.3; }
    50% { opacity: 0.6; }
    100% { opacity: 0.3; }
  }

  :global(body) {
    margin: 0;
    overflow-x: hidden;
    background: black;
  }
</style> 