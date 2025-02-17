<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import ApexCharts from 'apexcharts';
  import { browser } from '$app/environment';
  import type { User } from 'firebase/auth';

  let user: User | null = null;
  let loading = true;
  let charts: ApexCharts[] = [];
  let initialized = false;

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

  function initializeCharts() {
    if (!browser) return;
    
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
        background: 'transparent'
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05
        }
      },
      xaxis: {
        categories: historicoInvestimentos.map(h => h.data),
        labels: {
          style: { colors: 'rgba(255, 255, 255, 0.6)' }
        }
      },
      yaxis: {
        labels: {
          formatter: (value) => formatCurrency(value),
          style: { colors: 'rgba(255, 255, 255, 0.6)' }
        }
      },
      theme: { mode: 'dark' },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value) => formatCurrency(value)
        }
      }
    };

    const chart = new ApexCharts(element, options);
    chart.render();
    charts.push(chart);
  }

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        goto('/login');
      } else {
        user = currentUser;
        loading = false;
        if (!initialized) {
          initializeCharts();
          initialized = true;
        }
      }
    });

    return () => {
      charts.forEach(chart => chart.destroy());
      charts = [];
      unsubscribe();
    };
  });

  $: patrimonioAtual = historicoInvestimentos[historicoInvestimentos.length - 1].valor;
  $: nivelAtual = getNivelAtual(patrimonioAtual);
  $: proximoNivel = getProximoNivel(patrimonioAtual);
  $: progressoProximoNivel = Math.min(100, (patrimonioAtual / proximoNivel.valor) * 100);
</script>

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
                {nivelAtual.icon}
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
                <span class="text-lg">{nivelAtual.icon}</span>
                <span>{nivelAtual.nome}</span>
              </span>
            </div>
          </div>
        </div>
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
                Missão Espacial em Andamento
              </h2>
              <p class="text-sm text-gray-400 mt-1">Jornada até Alfa Centauri</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-400">{formatCurrency(patrimonioAtual)}</div>
              <div class="text-sm text-gray-400">Capital Acumulado</div>
            </div>
          </div>

          <!-- Status da Missão -->
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-white/5">
              <div class="text-sm text-gray-400">Distância Atual</div>
              <div class="text-lg font-semibold">{nivelAtual.distancia}</div>
            </div>
            <div class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-white/5">
              <div class="text-sm text-gray-400">Velocidade</div>
              <div class="text-lg font-semibold">{nivelAtual.velocidade}</div>
            </div>
            <div class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-white/5">
              <div class="text-sm text-gray-400">Próxima Parada</div>
              <div class="text-lg font-semibold">{proximoNivel.nome}</div>
            </div>
          </div>

          <!-- Linha do Tempo da Missão -->
          <div class="relative">
            <div class="absolute h-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full w-full"></div>
            <div 
              class="absolute h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style="width: {progressoProximoNivel}%"
            ></div>
            
            <div class="grid grid-cols-5 gap-4 relative pt-6">
              {#each niveis as nivel}
                <div class="text-center relative group">
                  <div class="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div class="w-3 h-3 rounded-full bg-gray-800 border-2 
                      {patrimonioAtual >= nivel.valor ? 'border-purple-500 bg-purple-900' : 'border-gray-600'} 
                      transition-all duration-300"
                    ></div>
                  </div>
                  
                  <div class="relative">
                    <div class="w-16 h-16 mx-auto bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center text-2xl mb-2 
                      {patrimonioAtual >= nivel.valor ? 'from-blue-500/20 to-purple-500/20 animate-pulse' : ''} 
                      transition-all duration-500 border border-white/10"
                    >
                      <div class="stars absolute inset-0 opacity-30 rounded-full"></div>
                      <span class="relative">{nivel.icon}</span>
                    </div>
                    
                    <div class="opacity-0 group-hover:opacity-100 absolute -top-24 left-1/2 transform -translate-x-1/2 transition-all duration-300 pointer-events-none">
                      <div class="bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-xl border border-white/10 w-48">
                        <div class="font-semibold">{nivel.nome}</div>
                        <div class="text-sm text-gray-400 mt-1">{nivel.desc}</div>
                        <div class="text-sm text-green-400 mt-1">{formatCurrency(nivel.valor)}</div>
                        <div class="text-xs text-gray-500 mt-1">
                          Distância: {nivel.distancia}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-xs text-gray-400 mt-2">{nivel.nome}</div>
                </div>
              {/each}
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
          {#each niveis as nivel}
            <div class="bg-white/5 rounded-lg p-4 text-center {patrimonioAtual >= nivel.valor ? 'border border-green-500/30' : 'opacity-50'}">
              <div class="text-3xl mb-2">{nivel.icon}</div>
              <div class="font-semibold">{nivel.nome}</div>
              <div class="text-sm text-gray-400">{formatCurrency(nivel.valor)}</div>
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