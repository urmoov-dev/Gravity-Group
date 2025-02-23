<script lang="ts">
    import { user } from '$lib/stores/auth';
    import { goto } from '$app/navigation';

    interface TermoDeServico {
        id: string;
        versao: string;
        dataPublicacao: string;
        status: 'atual' | 'futuro' | 'anterior';
        titulo: string;
        descricao: string;
        dataAceite?: string;
    }

    // Exemplo de termos (isso viria do backend em uma implementação real)
    const termosDeServico: TermoDeServico[] = [
        {
            id: 'v2-2024',
            versao: '2.0',
            dataPublicacao: '2024-03-01',
            status: 'atual',
            titulo: 'Termos de Serviço - Atualização 2024',
            descricao: 'Versão atual dos termos, incluindo novas políticas de investimento e segurança.',
            dataAceite: document.cookie.includes('terms_accepted=true') ? new Date().toLocaleDateString('pt-BR') : undefined
        },
        {
            id: 'v3-2024',
            versao: '3.0',
            dataPublicacao: '2024-06-01',
            status: 'futuro',
            titulo: 'Novos Termos de Serviço - Junho 2024',
            descricao: 'Atualização planejada incluindo novas funcionalidades e serviços.'
        }
    ];

    function viewTerms() {
        goto('/terms-of-service');
    }

    function formatDate(date: string): string {
        return new Date(date).toLocaleDateString('pt-BR');
    }
</script>

<div class="min-h-screen bg-black text-white p-8">
    <div class="max-w-6xl mx-auto space-y-8">
        <!-- Cabeçalho -->
        <div class="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl p-8 relative overflow-hidden">
            <div class="absolute inset-0 opacity-20">
                <div class="stars"></div>
            </div>
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
            
            <div class="relative z-10">
                <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Histórico de Termos de Serviço
                </h1>
                <p class="text-gray-400 mt-2">
                    Acompanhe todas as versões dos termos de serviço e suas atualizações
                </p>
            </div>
        </div>

        <!-- Termos Atuais -->
        <div class="space-y-6">
            <h2 class="text-2xl font-semibold text-white">Termos Atuais</h2>
            {#each termosDeServico.filter(termo => termo.status === 'atual') as termo}
                <div class="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                    <div class="absolute inset-0 opacity-20">
                        <div class="stars"></div>
                    </div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-white">{termo.titulo}</h3>
                                <p class="text-sm text-gray-400">Versão {termo.versao} - Publicado em {formatDate(termo.dataPublicacao)}</p>
                            </div>
                            <div class="flex items-center space-x-4">
                                {#if termo.dataAceite}
                                    <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                        Aceito em {termo.dataAceite}
                                    </span>
                                {/if}
                                <button
                                    on:click={viewTerms}
                                    class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                                >
                                    Visualizar
                                </button>
                            </div>
                        </div>
                        <p class="text-gray-300">{termo.descricao}</p>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Termos Futuros -->
        <div class="space-y-6">
            <h2 class="text-2xl font-semibold text-white">Próximas Atualizações</h2>
            {#each termosDeServico.filter(termo => termo.status === 'futuro') as termo}
                <div class="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                    <div class="absolute inset-0 opacity-20">
                        <div class="stars"></div>
                    </div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-white">{termo.titulo}</h3>
                                <p class="text-sm text-gray-400">Versão {termo.versao} - Previsto para {formatDate(termo.dataPublicacao)}</p>
                            </div>
                            <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                Em breve
                            </span>
                        </div>
                        <p class="text-gray-300">{termo.descricao}</p>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Linha do Tempo -->
        <div class="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <h2 class="text-2xl font-semibold text-white mb-6">Linha do Tempo</h2>
            <div class="relative">
                <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-blue-500 to-purple-500"></div>
                <div class="space-y-8">
                    {#each termosDeServico as termo}
                        <div class="relative flex items-center">
                            <div class="flex-1 text-right pr-8">
                                <h3 class="font-semibold text-white">{termo.titulo}</h3>
                                <p class="text-sm text-gray-400">Versão {termo.versao}</p>
                            </div>
                            <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <div class="flex-1 pl-8">
                                <p class="text-sm text-gray-400">
                                    {termo.status === 'futuro' ? 'Previsto para' : 'Publicado em'} {formatDate(termo.dataPublicacao)}
                                </p>
                                {#if termo.dataAceite}
                                    <p class="text-sm text-green-400">Aceito em {termo.dataAceite}</p>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
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
</style> 