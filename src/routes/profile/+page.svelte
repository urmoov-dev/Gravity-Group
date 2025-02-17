<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import ApexCharts from 'apexcharts';
  import { browser } from '$app/environment';
  import type { User } from 'firebase/auth';
  import { investmentLevels } from '$lib/types/profile';
  import type { InvestmentLevel } from '$lib/types/profile';

  let user: User | null = null;
  let loading = true;
  let charts: ApexCharts[] = [];
  let currentValue = 750000; // Exemplo - isso viria do banco de dados
  let currentLevel: InvestmentLevel;
  let nextLevel: InvestmentLevel;
  let progress = 0;

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
        user = currentUser;
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
  <div class="min-h-screen bg-black text-white p-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Cabeçalho do Perfil -->
      <div class="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl p-8 relative overflow-hidden">
        <div class="absolute inset-0 opacity-20">
          <div class="stars"></div>
        </div>
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        
        <div class="flex items-center space-x-6 relative z-10">
          <div class="relative group">
            <div class="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
            <div class="w-24 h-24 bg-gradient-to-br from-gray-900 to-black rounded-full border border-white/20 flex items-center justify-center text-4xl relative overflow-hidden">
              <div class="stars absolute inset-0 opacity-50"></div>
              <div class="relative animate-pulse">
                {currentLevel.icon}
              </div>
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {user?.displayName || 'Investidor'}
            </h1>
            <p class="text-gray-400">{user?.email}</p>
            <div class="mt-2">
              <span class="px-4 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full text-sm border border-white/10 flex items-center space-x-2 w-fit">
                <span class="text-lg">{currentLevel.icon}</span>
                <span>{currentLevel.name}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Nível Atual -->
      <div class="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-700">
        <div class="flex items-center space-x-4 mb-4">
          <span class="text-4xl">{currentLevel.icon}</span>
          <div>
            <h2 class="text-2xl font-bold {currentLevel.color}">{currentLevel.name}</h2>
            <p class="text-gray-400">{currentLevel.description}</p>
          </div>
        </div>

        <!-- Barra de Progresso -->
        {#if nextLevel}
          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-400 mb-1">
              <span>R$ {currentLevel.minValue.toLocaleString('pt-BR')}</span>
              <span>R$ {nextLevel.minValue.toLocaleString('pt-BR')}</span>
            </div>
            <div class="h-4 bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                style="width: {progress}%"
              ></div>
            </div>
            <p class="text-sm text-gray-400 mt-2">
              {nextLevel.nextGoal}
            </p>
          </div>
        {/if}

        <!-- Benefícios -->
        <div class="mt-6">
          <h3 class="text-xl font-semibold mb-4">Seus Benefícios</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each currentLevel.benefits as benefit}
              <div class="flex items-center space-x-2 text-gray-300">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{benefit}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Próximos Níveis -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each investmentLevels.filter(level => level.minValue > currentValue) as level}
          <div class="bg-gray-900 rounded-lg p-6 border border-gray-700 opacity-75 hover:opacity-100 transition-opacity">
            <div class="flex items-center space-x-3 mb-4">
              <span class="text-3xl">{level.icon}</span>
              <h3 class="text-xl font-semibold {level.color}">{level.name}</h3>
            </div>
            <p class="text-gray-400 mb-4">{level.description}</p>
            <div class="text-sm text-gray-500">
              Disponível a partir de R$ {level.minValue.toLocaleString('pt-BR')}
            </div>
          </div>
        {/each}
      </div>

      <!-- Jornada Espacial -->
      <div class="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 relative overflow-hidden">
        <div class="absolute inset-0">
          <div class="stars"></div>
        </div>
        <div class="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5"></div>
        
        <div class="relative z-10 space-y-8">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Jornada Espacial em Andamento
              </h2>
              <p class="text-sm text-gray-400 mt-1">Explorando o Sistema Solar</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-400">{formatCurrency(currentValue)}</div>
              <div class="text-sm text-gray-400">Capital Acumulado</div>
            </div>
          </div>

          <!-- Status da Missão -->
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-white/5">
              <div class="text-sm text-gray-400">Nível Atual</div>
              <div class="text-lg font-semibold flex items-center gap-2">
                <span class="text-3xl">{currentLevel.icon}</span>
                <span>{currentLevel.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de Evolução -->
      <div class="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <h2 class="text-xl font-semibold mb-4">Evolução Patrimonial</h2>
        <div id="progress-chart" class="w-full h-[350px]"></div>
      </div>

      <!-- Conquistas -->
      <div class="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <h2 class="text-xl font-semibold mb-4">Conquistas</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {#each investmentLevels as nivel}
            <div class="bg-white/5 rounded-lg p-4 text-center {currentValue >= nivel.minValue ? 'border border-green-500/30' : 'opacity-50'}">
              <div class="text-3xl mb-2">{nivel.icon}</div>
              <div class="font-semibold">{nivel.name}</div>
              <div class="text-sm text-gray-400">{formatCurrency(nivel.minValue)}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

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

  :global(body) {
    background: black;
    background-image: 
      radial-gradient(circle at center, #1a1a3a 0%, #000000 100%);
  }
</style> 