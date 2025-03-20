<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { terms } from '$lib/stores/terms';
    import { auth } from '$lib/firebase';
    import UnifiedLayout from '$lib/components/UnifiedLayout.svelte';
    import GravityCard from '$lib/components/GravityCard.svelte';

    let version: string;
    let docContent: string = '';
    let loading = true;
    let acceptedAt: string = '';
    let isCurrentVersion = false;
    let sections: {title: string, id: string}[] = [];
    let activeSection = '';
    
    // Define se usamos o tema claro ou escuro (false = escuro)
    let lightMode = false;
    
    // Cor de destaque da aplicação
    const accentColor = '#3b82f6'; // Azul

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (!firebaseUser) {
                goto('/login');
            }
        });

        // Obter a versão do URL
        version = $page.url.searchParams.get('version') || '';
        
        if (!version) {
            goto('/terms-history');
            return;
        }

        // Verificar se é a versão atual
        isCurrentVersion = version === terms.getCurrentVersion();
        
        // Buscar o histórico de aceitação
        const historyItem = terms.history.get().find(item => item.version === version);
        
        if (historyItem) {
            acceptedAt = formatDate(historyItem.acceptedAt);
        }
        
        // Buscar o conteúdo dos termos da API/armazenamento
        fetchTermsDocument(version);

        return () => {
            unsubscribe();
        };
    });

    async function fetchTermsDocument(version: string) {
        loading = true;
        try {
            // Em um ambiente real, isso seria uma chamada à API:
            // const response = await fetch(`/api/terms/${version}`);
            // const data = await response.json();
            // docContent = data.content;
            
            // Simulando a chamada com um atraso
            await new Promise(resolve => setTimeout(resolve, 800));
            docContent = getTermsContent(version);
            
            // Extrair seções do documento para criar o índice
            extractSections();
        } catch (error) {
            console.error('Erro ao buscar documento:', error);
            docContent = '<p>Erro ao carregar o documento. Por favor, tente novamente.</p>';
        } finally {
            loading = false;
        }
    }

    function extractSections() {
        // Método simples para extrair cabeçalhos H3 e criar um índice
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = docContent;
        
        const headings = tempDiv.querySelectorAll('h3');
        sections = Array.from(headings).map((h, index) => {
            const title = h.textContent || `Seção ${index + 1}`;
            const id = `section-${index}`;
            h.id = id; // adiciona ID ao cabeçalho no HTML
            return { title, id };
        });
    }

    function scrollToSection(id: string) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function formatDate(dateString: string | Date): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getTermsContent(version: string): string {
        // Simulação de conteúdo dos termos para diferentes versões
        const content: Record<string, string> = {
            '2025.01.01': `
                <h2>Termos de Serviço - Gravity Group</h2>
                <p class="version-date">Versão 2025.01.01 - Vigente a partir de 15/01/2025</p>
                
                <h3 id="introducao">1. Introdução</h3>
                <p>Bem-vindo aos Termos de Serviço do Gravity Group. Este documento constitui um acordo legal entre você, usuário, e o Gravity Group, referido como "nós", "nosso" ou "empresa".</p>
                
                <h3 id="servicos">2. Serviços Oferecidos</h3>
                <p>Oferecemos uma plataforma de investimentos com serviços de consultoria financeira, análise de mercado e recomendações de investimentos personalizadas.</p>
                
                <h3 id="privacidade">3. Políticas de Privacidade</h3>
                <p>Ao utilizar nossos serviços, você concorda com nossa Política de Privacidade atualizada que inclui:</p>
                <ul>
                    <li><span class="highlight">Coleta de dados aprimorada para personalização de serviços</span></li>
                    <li><span class="highlight">Compartilhamento de dados com parceiros estratégicos</span></li>
                    <li><span class="highlight">Uso de inteligência artificial para análise de comportamento financeiro</span></li>
                </ul>
                
                <h3 id="internacionais">4. Investimentos Internacionais</h3>
                <p>Nossa plataforma agora oferece acesso a investimentos internacionais, sujeitos às seguintes condições:</p>
                <ul>
                    <li>Conformidade com regulamentações locais e internacionais</li>
                    <li>Exposição a riscos cambiais</li>
                    <li>Taxas diferenciadas para operações internacionais</li>
                    <li>Requisitos mínimos de patrimônio para acesso a determinados produtos</li>
                </ul>
                
                <h3 id="responsabilidades">5. Responsabilidades</h3>
                <p>Os usuários são responsáveis por:</p>
                <ul>
                    <li>Manter suas credenciais de acesso seguras</li>
                    <li>Fornecer informações precisas e atualizadas</li>
                    <li>Compreender os riscos associados aos investimentos</li>
                    <li><span class="highlight">Estar ciente que rentabilidade passada não garante resultados futuros</span></li>
                </ul>
                
                <h3 id="taxas">6. Taxas e Comissões</h3>
                <p>Detalhes sobre taxas e comissões estão disponíveis na seção de Preços da plataforma e podem variar conforme o nível do investidor.</p>
            `,
            '2024.02.15': `
                <h2>Termos de Serviço - Gravity Group</h2>
                <p class="version-date">Versão 2024.02.15 - Vigente a partir de 15/02/2024</p>
                
                <h3 id="introducao">1. Introdução</h3>
                <p>Bem-vindo aos Termos de Serviço do Gravity Group. Este documento constitui um acordo legal entre você, usuário, e o Gravity Group.</p>
                
                <h3 id="servicos">2. Serviços Oferecidos</h3>
                <p>Oferecemos uma plataforma de investimentos com serviços de consultoria financeira e análise de mercado.</p>
                
                <h3 id="privacidade">3. Políticas de Privacidade</h3>
                <p>Ao utilizar nossos serviços, você concorda com nossa Política de Privacidade que inclui:</p>
                <ul>
                    <li>Coleta de dados básicos para funcionamento da plataforma</li>
                    <li>Armazenamento seguro de informações pessoais</li>
                    <li>Opção de não compartilhamento de dados com terceiros</li>
                </ul>
                
                <h3 id="responsabilidades">4. Responsabilidades</h3>
                <p>Os usuários são responsáveis por:</p>
                <ul>
                    <li>Manter suas credenciais de acesso seguras</li>
                    <li>Fornecer informações precisas</li>
                    <li>Compreender os riscos associados aos investimentos</li>
                </ul>
                
                <h3 id="taxas">5. Taxas e Comissões</h3>
                <p>Detalhes sobre taxas e comissões estão disponíveis na seção de Preços da plataforma.</p>
            `,
            '2023.08.10': `
                <h2>Termos de Serviço - Gravity Group</h2>
                <p class="version-date">Versão 2023.08.10 - Vigente a partir de 10/08/2023</p>
                
                <h3 id="introducao">1. Introdução</h3>
                <p>Este documento estabelece os termos e condições para uso dos serviços do Gravity Group.</p>
                
                <h3 id="servicos">2. Serviços Básicos</h3>
                <p>Nossa plataforma oferece serviços básicos de consultoria de investimentos.</p>
                
                <h3 id="privacidade">3. Privacidade</h3>
                <p>Seus dados são protegidos conforme nossa política de privacidade.</p>
                
                <h3 id="responsabilidades">4. Responsabilidades</h3>
                <p>O usuário é responsável pelo uso adequado da plataforma.</p>
                
                <h3 id="taxas">5. Taxas</h3>
                <p>As taxas são cobradas conforme tabela vigente no momento da contratação.</p>
            `
        };

        // Verificar na store de termos se há um documento para esta versão
        const termsDoc = terms.getDocumentByVersion?.(version);
        if (termsDoc) {
            return termsDoc;
        }
        
        return content[version] || '<p>Documento não encontrado para esta versão.</p>';
    }

    function handleBack() {
        goto('/terms-history');
    }
</script>

<UnifiedLayout {activeSection} {lightMode} {accentColor}>
    <div class="container mx-auto p-6">
        <GravityCard title={`Termos de Serviço - Versão ${version}`} {lightMode} {accentColor}>
            <div class="mb-4 flex justify-between items-center">
                <div>
                    <div class="flex items-center flex-wrap gap-2">
                        {#if isCurrentVersion}
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800">
                                Versão atual
                            </span>
                        {/if}
                        <span class={lightMode ? "text-black/60" : "text-white/60"}>
                            Assinado em: {acceptedAt}
                        </span>
                    </div>
                </div>
                <button
                    on:click={handleBack}
                    class="px-4 py-2 rounded-lg text-center transition-colors"
                    style:background-color={`${accentColor}20`}
                    style:color={accentColor}
                    style:border={`1px solid ${accentColor}40`}
                >
                    Voltar
                </button>
            </div>

            <div class="flex flex-col md:flex-row gap-6">
                <!-- Índice -->
                {#if sections.length > 0 && !loading}
                <div class="md:w-1/4 shrink-0">
                    <div class="sticky top-6 p-4 rounded-lg mb-4" 
                         style:background-color={lightMode ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)"} 
                         style:border={`1px solid ${lightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`}>
                        <h3 class={`text-lg font-semibold mb-3 ${lightMode ? "text-black" : "text-white"}`}>Índice</h3>
                        <ul class="space-y-2">
                            {#each sections as section}
                                <li>
                                    <button 
                                        on:click={() => scrollToSection(section.id)}
                                        class="text-left hover:underline transition-all w-full px-2 py-1 rounded"
                                        style:color={accentColor}
                                        style:background-color={`${accentColor}10`}
                                    >
                                        {section.title}
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>
                {/if}

                <!-- Conteúdo do documento -->
                <div class={sections.length > 0 && !loading ? "md:w-3/4" : "w-full"}>
                    <div class="border rounded-lg p-6" style:border-color={lightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}
                         style:background-color={lightMode ? "white" : "rgba(0,0,0,0.2)"}>
                        {#if loading}
                            <div class="flex justify-center py-12">
                                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style:border-color={accentColor}></div>
                            </div>
                        {:else}
                            <div class="terms-content" class:light-mode={lightMode}>
                                {@html docContent}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

            <div class="mt-6 p-4 rounded-lg border" 
                 style:border-color={lightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}
                 style:background-color={lightMode ? "rgba(59, 130, 246, 0.05)" : "rgba(59, 130, 246, 0.1)"}>
                <div class="flex items-start">
                    <span class="mr-3 mt-1 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style:color={accentColor}>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </span>
                    <div>
                        <p class="font-medium mb-1" style:color={accentColor}>Documento Verificado Digitalmente</p>
                        <p class="text-sm" class:text-black={lightMode} class:text-white={!lightMode} style:opacity="0.7">
                            Este documento foi assinado eletronicamente em {acceptedAt}. A assinatura foi registrada com segurança em nosso sistema usando criptografia avançada e blockchain.
                        </p>
                    </div>
                </div>
            </div>
        </GravityCard>
    </div>
</UnifiedLayout>

<style>
    .terms-content {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
        line-height: 1.7;
    }

    .terms-content.light-mode {
        color: rgba(0, 0, 0, 0.9);
    }

    .terms-content h2 {
        font-size: 1.75rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: white;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .terms-content.light-mode h2 {
        color: black;
        border-bottom-color: rgba(0, 0, 0, 0.1);
    }

    .terms-content .version-date {
        font-size: 0.9rem;
        color: #3b82f6;
        margin-bottom: 2rem;
        font-style: italic;
    }

    .terms-content h3 {
        font-size: 1.3rem;
        font-weight: 600;
        margin-top: 2rem;
        margin-bottom: 1rem;
        color: white;
        position: relative;
        padding-left: 1rem;
    }

    .terms-content.light-mode h3 {
        color: black;
    }

    .terms-content h3::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0.25rem;
        bottom: 0.25rem;
        width: 3px;
        background-color: #3b82f6;
        border-radius: 3px;
    }

    .terms-content p {
        margin-bottom: 1.2rem;
        text-align: justify;
    }

    .terms-content ul {
        list-style-type: none;
        padding-left: 0.5rem;
        margin-bottom: 1.5rem;
    }

    .terms-content li {
        margin-bottom: 0.75rem;
        position: relative;
        padding-left: 1.5rem;
    }

    .terms-content li::before {
        content: "•";
        position: absolute;
        left: 0;
        color: #3b82f6;
        font-weight: bold;
    }

    .terms-content .highlight {
        background-color: rgba(59, 130, 246, 0.15);
        padding: 0.15rem 0.3rem;
        border-radius: 0.25rem;
        font-weight: 500;
    }

    /* Animações */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .terms-content {
        animation: fadeIn 0.6s ease-out;
    }

    /* Media query para responsividade */
    @media (max-width: 768px) {
        .terms-content h2 {
            font-size: 1.5rem;
        }
        
        .terms-content h3 {
            font-size: 1.2rem;
        }
    }
</style> 