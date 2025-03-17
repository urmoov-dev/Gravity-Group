<!-- TermsOfService.svelte -->
<script lang="ts">
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    
    export let showTerms = true;
    let hasScrolledToBottom = false;
    let termsContainer: HTMLElement;

    function handleScroll(e: Event) {
        const target = e.target as HTMLElement;
        const isAtBottom = Math.abs((target.scrollHeight - target.scrollTop) - target.clientHeight) < 1;
        if (isAtBottom) {
            hasScrolledToBottom = true;
        }
    }

    function acceptTerms() {
        if (!hasScrolledToBottom) {
            alert('Por favor, leia os termos até o final antes de aceitar.');
            return;
        }
        dispatch('accept');
    }

    function rejectTerms() {
        dispatch('reject');
    }
</script>

{#if showTerms}
<div 
    class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    transition:fade
>
    <div class="bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <!-- Cabeçalho -->
        <div class="p-6 border-b border-gray-800">
            <h2 class="text-2xl font-bold text-blue-400">Termos de Serviço da Plataforma Gravity Group</h2>
            <p class="text-gray-400 mt-2">Última atualização: 2025</p>
        </div>

        <!-- Conteúdo dos Termos -->
        <div 
            class="p-6 overflow-y-auto flex-1 space-y-6 text-gray-300"
            on:scroll={handleScroll}
            bind:this={termsContainer}
        >
            <!-- Seção 1 -->
            <section>
                <h3 class="text-lg font-semibold text-blue-300 mb-3">1. INTRODUÇÃO</h3>
                <p class="leading-relaxed">
                    Bem-vindo aos Termos de Serviço do Gravity Group. Este documento estabelece as regras e diretrizes para o uso de nossa plataforma de gestão de investimentos, serviços relacionados e funcionalidades disponíveis aos usuários.
                </p>
                <p class="leading-relaxed mt-2">
                    A utilização da plataforma implica na aceitação integral destes Termos de Serviço. Caso não concorde com os termos estabelecidos, o usuário não deverá acessar ou utilizar nossos serviços.
                </p>
            </section>

            <!-- Seção 2 -->
            <section>
                <h3 class="text-lg font-semibold text-blue-300 mb-3">2. SERVIÇOS OFERECIDOS</h3>
                <p class="leading-relaxed">
                    O Gravity Group oferece uma plataforma inovadora voltada à gestão de investimentos, proporcionando:
                </p>
                <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>Análise e monitoramento de investimentos.</li>
                    <li>Gestão de carteira personalizada.</li>
                    <li>Relatórios detalhados de performance.</li>
                    <li>Consultoria especializada para investidores.</li>
                    <li>Acesso a oportunidades exclusivas de investimento.</li>
                    <li>Intermediação financeira, conforme aplicável e permitido por regulamentações vigentes.</li>
                </ul>
                <p class="leading-relaxed mt-2">
                    A plataforma tem caráter informativo e operacional, não substituindo consultoria financeira individualizada.
                </p>
            </section>

            <!-- Seção 3 -->
            <section>
                <h3 class="text-lg font-semibold text-blue-300 mb-3">3. RESPONSABILIDADES DO USUÁRIO</h3>
                <p class="leading-relaxed">
                    Ao utilizar a plataforma, o usuário concorda em:
                </p>
                <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>Fornecer informações corretas, completas e atualizadas durante o cadastro e uso da plataforma.</li>
                    <li>Manter a confidencialidade de suas credenciais de acesso e não compartilhá-las com terceiros.</li>
                    <li>Utilizar a plataforma dentro dos limites da legislação aplicável e das regulamentações financeiras pertinentes.</li>
                    <li>Não praticar atividades que possam comprometer a segurança, integridade ou funcionamento da plataforma.</li>
                </ul>
                <p class="leading-relaxed mt-2">
                    O Gravity Group se reserva o direito de suspender ou encerrar contas de usuários que violem estes Termos.
                </p>
            </section>

            <!-- Seção 4 -->
            <section>
                <h3 class="text-lg font-semibold text-blue-300 mb-3">4. PRIVACIDADE E SEGURANÇA</h3>
                <p class="leading-relaxed">
                    A privacidade e segurança dos dados dos usuários são prioridades do Gravity Group. Para garantir a proteção das informações:
                </p>
                <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>Utilizamos criptografia de ponta a ponta para dados sensíveis.</li>
                    <li>Seguimos todas as diretrizes estabelecidas pela Lei Geral de Proteção de Dados (LGPD).</li>
                    <li>Monitoramos continuamente a segurança da plataforma para evitar acessos não autorizados.</li>
                </ul>
                <p class="leading-relaxed mt-2">
                    Os dados do usuário não serão compartilhados com terceiros sem seu consentimento, exceto em casos exigidos por lei ou reguladores.
                </p>
                <p class="leading-relaxed mt-2">
                    Para aprimorar a experiência e consolidar informações de investimentos, a plataforma pode integrar dados provenientes de instituições financeiras nas quais o usuário possui ativos, sempre mediante autorização prévia.
                </p>
            </section>

            <!-- Seção 5 -->
            <section>
                <h3 class="text-lg font-semibold text-blue-300 mb-3">5. RISCOS E LIMITAÇÕES</h3>
                <p class="leading-relaxed">
                    Ao utilizar a plataforma Gravity Group, o usuário deve estar ciente dos seguintes aspectos:
                </p>
                <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>Todo investimento envolve riscos, e rentabilidades passadas não garantem resultados futuros.</li>
                    <li>Os valores investidos podem sofrer oscilações e até mesmo perdas, dependendo das condições do mercado.</li>
                    <li>As informações fornecidas pela plataforma são baseadas em dados disponíveis no momento, sem garantia de exatidão ou atualização em tempo real.</li>
                    <li>O usuário é exclusivamente responsável por suas decisões de investimento.</li>
                </ul>
                <p class="leading-relaxed mt-2">
                    O Gravity Group não se responsabiliza por decisões tomadas com base nas informações apresentadas na plataforma, nem por perdas financeiras decorrentes do uso dos serviços.
                </p>
            </section>

            <!-- Seção 6 -->
            <section>
                <h3 class="text-lg font-semibold text-blue-300 mb-3">6. ISENÇÕES DE RESPONSABILIDADE</h3>
                <p class="leading-relaxed">
                    O usuário reconhece e concorda que:
                </p>
                <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>A utilização da plataforma se dá por sua conta e risco.</li>
                    <li>O Gravity Group não pode ser responsabilizado por falhas técnicas, interrupções temporárias ou imprecisões nos dados fornecidos.</li>
                    <li>A plataforma pode incluir integrações com serviços de terceiros, pelos quais o Gravity Group não se responsabiliza.</li>
                    <li>O usuário se compromete a isentar o Gravity Group de qualquer reclamação ou ação legal decorrente do uso da plataforma.</li>
                </ul>
            </section>

            <!-- Seção 7 -->
            <section>
                <h3 class="text-lg font-semibold text-blue-300 mb-3">7. SUPORTE E COMUNICAÇÃO</h3>
                <p class="leading-relaxed">
                    Para garantir um atendimento de qualidade, o Gravity Group disponibiliza os seguintes canais de suporte:
                </p>
                <ul class="list-disc pl-6 mt-2 space-y-1">
                    <li>Atendimento via chat.</li>
                    <li>Suporte por e-mail para questões técnicas e administrativas.</li>
                    <li>Consultoria personalizada mediante agendamento.</li>
                    <li>Central de ajuda com documentação detalhada sobre a plataforma.</li>
                </ul>
                <p class="leading-relaxed mt-2">
                    O usuário poderá entrar em contato por meio dos canais disponibilizados na plataforma para esclarecimento de dúvidas ou resolução de problemas técnicos.
                </p>
            </section>

            <!-- Seção 8 -->
            <section>
                <h3 class="text-lg font-semibold text-blue-300 mb-3">8. ALTERAÇÕES NOS TERMOS E HISTÓRICO DE CONTRATOS</h3>
                <div class="space-y-2">
                    <p class="leading-relaxed">8.1. O Gravity Group poderá modificar estes Termos de Serviço a qualquer momento.</p>
                    <p class="leading-relaxed">8.2. No momento do login, o usuário será notificado sobre eventuais atualizações e precisará aceitar os novos termos para continuar utilizando a plataforma.</p>
                    <p class="leading-relaxed">8.3. A plataforma manterá um registro cronológico das versões dos Termos aceitos pelo usuário, garantindo transparência e rastreabilidade de todas as alterações contratuais.</p>
                </div>
            </section>

            <!-- Seção 9 -->
            <section>
                <h3 class="text-lg font-semibold text-blue-300 mb-3">9. DISPOSIÇÕES FINAIS</h3>
                <div class="space-y-2">
                    <p class="leading-relaxed">9.1. Estes Termos são regidos pelas leis brasileiras. Qualquer litígio será resolvido no foro da comarca de São Paulo/SP.</p>
                    <p class="leading-relaxed">9.2. Caso qualquer cláusula destes Termos seja considerada inválida ou inexequível, as demais permanecerão em pleno vigor e efeito.</p>
                </div>
            </section>
        </div>

        <!-- Rodapé com botões -->
        <div class="p-6 border-t border-gray-800 flex justify-end gap-4">
            <div class="flex-1 flex items-center">
                {#if !hasScrolledToBottom}
                    <p class="text-yellow-400 text-sm">⚠️ Por favor, leia os termos até o final antes de aceitar.</p>
                {/if}
            </div>
            <button
                class="px-6 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                on:click={rejectTerms}
            >
                Recusar
            </button>
            <button
                class="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={acceptTerms}
                disabled={!hasScrolledToBottom}
            >
                Aceitar
            </button>
        </div>
    </div>
</div>
{/if}

<style>
    /* Estilização adicional se necessário */
</style> 