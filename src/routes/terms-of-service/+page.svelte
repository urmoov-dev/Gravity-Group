<script>
    import { user } from '$lib/stores/auth';

    let accepted = false;
    let loading = false;
    let showAcceptButton = true;

    // Verificar se os termos já foram aceitos
    if (typeof document !== 'undefined') {
        showAcceptButton = !document.cookie.includes('terms_accepted=true');
    }

    async function acceptTerms() {
        if (!accepted) return;
        loading = true;

        try {
            const response = await fetch('/api/accept-terms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                showAcceptButton = false;
                window.location.href = '/hub';
            }
        } catch (error) {
            console.error('Erro ao aceitar os termos:', error);
            loading = false;
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-b from-black via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto bg-black/30 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/10">
        <div class="px-6 py-8">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-white mb-2">Termos de Serviço</h1>
                <p class="text-gray-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            <div class="prose prose-lg prose-invert max-w-none mb-8">
                <div class="space-y-8 text-gray-300">
                    <section>
                        <h2 class="text-2xl font-semibold text-green-500 mb-4">1. Introdução</h2>
                        <p class="mb-4">
                            Bem-vindo aos Termos de Serviço do Gravity Group. Este documento estabelece as regras e diretrizes
                            que regem o uso de nossa plataforma de investimentos e serviços relacionados. Ao utilizar nossos
                            serviços, você concorda com estes termos em sua totalidade.
                        </p>
                    </section>

                    <section>
                        <h2 class="text-2xl font-semibold text-green-500 mb-4">2. Serviços Oferecidos</h2>
                        <p class="mb-4">
                            O Gravity Group oferece uma plataforma de gestão de investimentos que inclui:
                        </p>
                        <ul class="list-disc pl-6 mb-4 space-y-2">
                            <li>Análise e monitoramento de investimentos</li>
                            <li>Gestão de carteira personalizada</li>
                            <li>Relatórios detalhados de performance</li>
                            <li>Consultoria especializada</li>
                            <li>Acesso a oportunidades exclusivas de investimento</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-semibold text-green-500 mb-4">3. Responsabilidades do Usuário</h2>
                        <p class="mb-4">
                            Ao utilizar nossa plataforma, você se compromete a:
                        </p>
                        <ul class="list-disc pl-6 mb-4 space-y-2">
                            <li>Fornecer informações precisas e atualizadas</li>
                            <li>Manter a confidencialidade de suas credenciais de acesso</li>
                            <li>Utilizar a plataforma de acordo com as leis aplicáveis</li>
                            <li>Não compartilhar seu acesso com terceiros</li>
                            <li>Reportar imediatamente qualquer atividade suspeita</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-semibold text-green-500 mb-4">4. Privacidade e Segurança</h2>
                        <p class="mb-4">
                            Proteger seus dados é nossa prioridade. Nosso compromisso inclui:
                        </p>
                        <ul class="list-disc pl-6 mb-4 space-y-2">
                            <li>Criptografia de ponta a ponta para dados sensíveis</li>
                            <li>Conformidade com regulamentações de proteção de dados</li>
                            <li>Monitoramento contínuo de segurança</li>
                            <li>Atualizações regulares de nossos protocolos de segurança</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-semibold text-green-500 mb-4">5. Riscos e Limitações</h2>
                        <p class="mb-4">
                            Todo investimento envolve riscos. É importante estar ciente que:
                        </p>
                        <ul class="list-disc pl-6 mb-4 space-y-2">
                            <li>Rentabilidade passada não garante resultados futuros</li>
                            <li>Investimentos podem resultar em perdas</li>
                            <li>Decisões de investimento são de responsabilidade do usuário</li>
                            <li>Recomendamos diversificação da carteira</li>
                        </ul>
                    </section>

                    <section>
                        <h2 class="text-2xl font-semibold text-green-500 mb-4">6. Suporte e Comunicação</h2>
                        <p class="mb-4">
                            Oferecemos diversos canais de suporte:
                        </p>
                        <ul class="list-disc pl-6 mb-4 space-y-2">
                            <li>Atendimento 24/7 via chat</li>
                            <li>Suporte por email</li>
                            <li>Consultoria personalizada agendada</li>
                            <li>Central de ajuda com documentação detalhada</li>
                        </ul>
                    </section>
                </div>
            </div>

            {#if showAcceptButton}
                <div class="flex items-center justify-center gap-4 mt-6">
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            bind:checked={accepted}
                            class="form-checkbox h-5 w-5 text-green-500 transition duration-150 ease-in-out bg-black/50 border-white/20"
                        />
                        <span class="text-gray-300">Li e aceito os termos de serviço</span>
                    </label>
                </div>

                <div class="mt-8 flex justify-center">
                    <button
                        on:click={acceptTerms}
                        disabled={!accepted || loading}
                        class="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold
                               hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition duration-150 ease-in-out"
                    >
                        {loading ? 'Processando...' : 'Aceitar e Continuar'}
                    </button>
                </div>
            {:else}
                <div class="mt-8 flex justify-center">
                    <a
                        href="/hub"
                        class="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold
                               hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                               transition duration-150 ease-in-out"
                    >
                        Voltar para o Hub
                    </a>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    :global(.prose) {
        max-width: none;
    }
    
    :global(.prose h2) {
        color: #22c55e;
    }

    :global(.prose ul) {
        margin: 0;
    }

    :global(.prose li) {
        margin: 0;
    }
</style> 