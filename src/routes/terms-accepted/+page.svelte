<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    type TermsVersion = 'v2-2024' | 'v3-2024';

    // Obter a versão aceita dos cookies
    let acceptedVersion = '';
    let acceptanceDate = '';

    if (typeof document !== 'undefined') {
        acceptedVersion = document.cookie.split('terms_version=')[1]?.split(';')[0] || '';
        acceptanceDate = document.cookie.includes('terms_acceptance_date') 
            ? new Date(decodeURIComponent(document.cookie.split('terms_acceptance_date=')[1]?.split(';')[0] || '')).toLocaleDateString('pt-BR')
            : '';
    }

    // Definição dos termos (igual à página original)
    const termsVersions: Record<TermsVersion, {
        title: string;
        lastUpdated: string;
        sections: Array<{
            title: string;
            content: string;
        }>;
    }> = {
        'v2-2024': {
            title: 'Termos de Serviço - Atualização 2024',
            lastUpdated: '01/03/2024',
            sections: [
                {
                    title: '1. Introdução',
                    content: 'Bem-vindo aos Termos de Serviço do Gravity Group. Este documento estabelece as regras e diretrizes que regem o uso de nossa plataforma de investimentos e serviços relacionados.'
                },
                {
                    title: '2. Serviços Oferecidos',
                    content: 'O Gravity Group oferece uma plataforma de gestão de investimentos que inclui análise e monitoramento de investimentos, gestão de carteira personalizada, relatórios detalhados de performance, consultoria especializada e acesso a oportunidades exclusivas de investimento.'
                },
                {
                    title: '3. Responsabilidades do Usuário',
                    content: 'Ao utilizar nossa plataforma, você se compromete a fornecer informações precisas e atualizadas, manter a confidencialidade de suas credenciais de acesso, utilizar a plataforma de acordo com as leis aplicáveis e não compartilhar seu acesso com terceiros.'
                },
                {
                    title: '4. Privacidade e Segurança',
                    content: 'Proteger seus dados é nossa prioridade. Nosso compromisso inclui criptografia de ponta a ponta para dados sensíveis, conformidade com regulamentações de proteção de dados e monitoramento contínuo de segurança.'
                },
                {
                    title: '5. Riscos e Limitações',
                    content: 'Todo investimento envolve riscos. É importante estar ciente que rentabilidade passada não garante resultados futuros, investimentos podem resultar em perdas e as decisões de investimento são de responsabilidade do usuário.'
                },
                {
                    title: '6. Suporte e Comunicação',
                    content: 'Oferecemos diversos canais de suporte, incluindo atendimento 24/7 via chat, suporte por email, consultoria personalizada agendada e central de ajuda com documentação detalhada.'
                }
            ]
        },
        'v3-2024': {
            title: 'Novos Termos de Serviço - Junho 2024',
            lastUpdated: '01/06/2024',
            sections: [
                {
                    title: '1. Introdução',
                    content: 'Versão atualizada dos Termos de Serviço do Gravity Group, incluindo novas funcionalidades e serviços planejados.'
                },
                {
                    title: '2. Novos Serviços',
                    content: 'Incluindo novas ferramentas de análise preditiva, integração com múltiplas corretoras e sistema avançado de recomendações personalizadas.'
                },
                {
                    title: '3. Responsabilidades Atualizadas',
                    content: 'Novas diretrizes para uso das ferramentas avançadas e responsabilidades relacionadas à automação de investimentos.'
                },
                {
                    title: '4. Segurança Aprimorada',
                    content: 'Implementação de autenticação multi-fator obrigatória e novos protocolos de segurança para operações automatizadas.'
                },
                {
                    title: '5. Riscos e Limitações',
                    content: 'Atualizações sobre riscos específicos das novas ferramentas e limitações dos sistemas automatizados.'
                },
                {
                    title: '6. Suporte Expandido',
                    content: 'Novo sistema de suporte com IA e atendimento especializado para usuários das ferramentas avançadas.'
                }
            ]
        }
    };

    $: currentTerms = acceptedVersion ? termsVersions[acceptedVersion as TermsVersion] : null;

    function goBack() {
        goto('/terms-history');
    }
</script>

<div class="min-h-screen bg-gradient-to-b from-black via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto bg-black/30 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/10">
        <div class="px-6 py-8">
            {#if currentTerms}
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-4xl font-bold text-white mb-2">{currentTerms.title}</h1>
                        <p class="text-gray-400">Última atualização: {currentTerms.lastUpdated}</p>
                        <p class="text-green-400 mt-2">
                            ✓ Aceito em {acceptanceDate}
                        </p>
                    </div>
                    <button
                        on:click={goBack}
                        class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black"
                    >
                        Voltar
                    </button>
                </div>

                <div class="prose prose-lg prose-invert max-w-none mb-8">
                    <div class="space-y-8 text-gray-300">
                        {#each currentTerms.sections as section}
                            <section>
                                <h2 class="text-2xl font-semibold text-green-500 mb-4">{section.title}</h2>
                                <p class="mb-4">{section.content}</p>
                            </section>
                        {/each}
                    </div>
                </div>
            {:else}
                <div class="text-center py-12">
                    <p class="text-xl text-gray-400">Nenhum termo aceito encontrado.</p>
                    <button
                        on:click={goBack}
                        class="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Voltar
                    </button>
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