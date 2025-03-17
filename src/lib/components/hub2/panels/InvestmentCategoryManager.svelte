<!-- InvestmentCategoryManager.svelte -->
<script lang="ts">
    import { investmentCategories, updateCategory, updateExample, addCategory } from '$lib/stores/investment';
    import HologramDisplay from '../HologramDisplay.svelte';
    import { fade, slide } from 'svelte/transition';
    import type { InvestmentCategory, InvestmentExample } from '$lib/types/profile';
    import * as XLSX from 'xlsx';

    let editingCategory: InvestmentCategory | null = null;
    let editingExample: InvestmentExample | null = null;
    let importError: string | null = null;
    let importSuccess: boolean = false;

    function startEditingCategory(category: InvestmentCategory) {
        editingCategory = { ...category };
        editingExample = { ...category.examples[0] };
    }

    function saveChanges() {
        if (editingCategory && editingExample) {
            updateCategory(editingCategory.id, {
                name: editingCategory.name,
                description: editingCategory.description,
                minAmount: editingCategory.minAmount,
                maxAmount: editingCategory.maxAmount
            });

            updateExample(editingCategory.id, editingExample.id, editingExample);

            editingCategory = null;
            editingExample = null;
        }
    }

    function cancelEditing() {
        editingCategory = null;
        editingExample = null;
    }

    // Função para processar o arquivo Excel
    async function handleFileUpload(event: Event) {
        importError = null;
        importSuccess = false;
        const input = event.target as HTMLInputElement;
        const file = input?.files?.[0];

        if (!file) {
            importError = "Nenhum arquivo selecionado";
            return;
        }

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Limpar categorias existentes
            investmentCategories.set([]);

            // Agrupar dados por categoria
            const categoriesMap = new Map();
            
            jsonData.forEach((row: any) => {
                if (!row.Categoria || !row['Corpo Celeste'] || !row['Massa Aproximada (kg)'] || !row.Descricao) {
                    throw new Error("Formato inválido: todas as linhas devem ter Categoria, Corpo Celeste, Massa Aproximada e Descrição");
                }

                const categoria = row.Categoria;
                const valorInvestimento = Number(row['Massa Aproximada (Unidade Terrestre)'].toString().replace(/[R$\s,.]/g, ''));
                
                if (!categoriesMap.has(categoria)) {
                    categoriesMap.set(categoria, {
                        minValue: valorInvestimento,
                        examples: []
                    });
                }

                const categoryData = categoriesMap.get(categoria);
                categoryData.examples.push({
                    corpoceleste: row['Corpo Celeste'],
                    massa: row['Massa Aproximada (kg)'],
                    valor: valorInvestimento,
                    descricao: row.Descricao
                });

                // Atualizar valor mínimo se necessário
                if (valorInvestimento < categoryData.minValue) {
                    categoryData.minValue = valorInvestimento;
                }
            });

            // Converter dados agrupados em categorias
            for (const [categoria, dados] of categoriesMap) {
                const newCategory: InvestmentCategory = {
                    id: Date.now() + Math.random(),
                    name: categoria,
                    minAmount: dados.minValue,
                    maxAmount: null,
                    description: dados.examples[0].descricao,
                    examples: dados.examples.map(ex => ({
                        id: Date.now() + Math.random(),
                        name: ex.corpoceleste,
                        description: ex.descricao,
                        icon: getIconForCategory(categoria),
                        celestialBody: ex.corpoceleste,
                        risk: getRiskLevel(ex.valor),
                        expectedReturn: getExpectedReturn(ex.valor),
                        minimumInvestment: ex.valor
                    }))
                };

                addCategory(newCategory);
            }

            // Ordenar categorias por valor mínimo e definir valores máximos
            investmentCategories.update(($categories) => {
                const sorted = $categories.sort((a, b) => a.minAmount - b.minAmount);
                return sorted.map((category, index) => {
                    if (index < sorted.length - 1) {
                        category.maxAmount = sorted[index + 1].minAmount - 0.01;
                    }
                    return category;
                });
            });

            importSuccess = true;
            input.value = '';
        } catch (error) {
            importError = error instanceof Error ? error.message : "Erro ao processar o arquivo";
            console.error(error);
        }
    }

    // Função para baixar o template Excel
    function downloadTemplate() {
        const template = [
            {
                'Categoria': 'Anã Marrom',
                'Corpo Celeste': 'Gliese 229 B',
                'Massa Aproximada (kg)': '5.97E+24',
                'Massa Aproximada (Unidade Terrestre)': 'R$ 1.000,00',
                'Descricao': 'Objeto subestelar orbitando a estrela Gliese 229, localizado a aproximadamente 19 anos-luz.'
            }
        ];

        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Template');
        XLSX.writeFile(wb, 'template_categorias_astronomicas.xlsx');
    }

    // Funções auxiliares
    function getIconForCategory(categoria: string): string {
        const icons: { [key: string]: string } = {
            'Anã Marrom': '🌑',
            'Anã Vermelha': '🔴',
            'Anã Branca': '⚪',
            'Estrela de Classe F': '⭐',
            'Estrela de Classe A': '💫',
            'Estrela de Neutrons': '✨',
            'Buraco Negro de Massa Estelar': '🕳️',
            'Estrela Supergigante': '🌟',
            'Estrela Wolf-Rayet': '💥',
            'Estrela Hipergigante': '🌠',
            'Buraco Negro de Massa Intermediária': '⚫',
            'Buraco Negro Supermassivo': '⬛'
        };
        return icons[categoria] || '🌟';
    }

    function getRiskLevel(valor: number): 'Baixo' | 'Moderado' | 'Alto' {
        if (valor < 20000) return 'Baixo';
        if (valor < 200000) return 'Moderado';
        return 'Alto';
    }

    function getExpectedReturn(valor: number): string {
        if (valor < 20000) return '8-12% a.a.';
        if (valor < 200000) return '12-18% a.a.';
        if (valor < 1000000) return '18-25% a.a.';
        return '25-40% a.a.';
    }

    // Formatar valor monetário
    function formatCurrency(value: number): string {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    // Formatar número científico
    function formatScientific(value: number): string {
        return value.toExponential(2);
    }
</script>

<HologramDisplay>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h3 class="text-2xl font-bold text-blue-400">Gerenciar Categorias Astronômicas</h3>
            
            <!-- Área de Importação -->
            <div class="flex items-center gap-4">
                <button
                    class="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm"
                    on:click={downloadTemplate}
                >
                    📥 Baixar Template
                </button>
                <label
                    class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer text-sm"
                >
                    📤 Importar Excel
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        class="hidden"
                        on:change={handleFileUpload}
                    />
                </label>
            </div>
        </div>

        <!-- Mensagens de Feedback -->
        {#if importError}
            <div class="bg-red-900/50 text-red-400 p-4 rounded-lg" transition:fade>
                ❌ {importError}
            </div>
        {/if}
        {#if importSuccess}
            <div class="bg-green-900/50 text-green-400 p-4 rounded-lg" transition:fade>
                ✅ Dados importados com sucesso!
            </div>
        {/if}

        <!-- Lista de Categorias -->
        <div class="space-y-4">
            {#each $investmentCategories as category (category.id)}
                <div
                    class="bg-gray-900/50 rounded-lg p-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
                    on:click={() => startEditingCategory(category)}
                    class:ring-2={editingCategory?.id === category.id}
                    class:ring-blue-500={editingCategory?.id === category.id}
                >
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl">{category.examples[0].icon}</span>
                                <h4 class="text-lg font-semibold text-white">{category.name}</h4>
                            </div>
                            <p class="text-sm text-gray-400 mt-1">{category.examples[0].celestialBody}</p>
                            <p class="text-xs text-gray-500 mt-1">{category.description}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-sm text-cyan-400">
                                Massa: {formatScientific(category.minAmount * 5.97e24)} kg
                            </div>
                            <div class="text-sm text-blue-400">
                                Investimento: {formatCurrency(category.minAmount)}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Formulário de Edição -->
        {#if editingCategory && editingExample}
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" transition:fade>
                <div
                    class="fixed inset-4 lg:inset-x-1/4 lg:inset-y-16 bg-gray-900 rounded-lg shadow-2xl p-6 overflow-y-auto"
                    transition:slide
                >
                    <h3 class="text-2xl font-bold text-blue-400 mb-6">Editar Categoria</h3>

                    <!-- Campos da Categoria -->
                    <div class="space-y-4 mb-8">
                        <div>
                            <label class="block text-gray-400 mb-1" for="name">Nome da Categoria</label>
                            <input
                                type="text"
                                id="name"
                                class="w-full bg-gray-800 rounded px-3 py-2 text-white"
                                bind:value={editingCategory.name}
                            />
                        </div>
                        <div>
                            <label class="block text-gray-400 mb-1" for="description"
                                >Descrição da Categoria</label
                            >
                            <textarea
                                id="description"
                                class="w-full bg-gray-800 rounded px-3 py-2 text-white"
                                rows="3"
                                bind:value={editingCategory.description}
                            />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-400 mb-1" for="minAmount"
                                    >Valor Mínimo</label
                                >
                                <input
                                    type="number"
                                    id="minAmount"
                                    class="w-full bg-gray-800 rounded px-3 py-2 text-white"
                                    bind:value={editingCategory.minAmount}
                                />
                            </div>
                            <div>
                                <label class="block text-gray-400 mb-1" for="maxAmount"
                                    >Valor Máximo</label
                                >
                                <input
                                    type="number"
                                    id="maxAmount"
                                    class="w-full bg-gray-800 rounded px-3 py-2 text-white"
                                    bind:value={editingCategory.maxAmount}
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Campos do Exemplo -->
                    <h4 class="text-xl font-semibold text-blue-300 mb-4">Exemplo de Investimento</h4>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-400 mb-1" for="exampleName"
                                >Nome do Produto</label
                            >
                            <input
                                type="text"
                                id="exampleName"
                                class="w-full bg-gray-800 rounded px-3 py-2 text-white"
                                bind:value={editingExample.name}
                            />
                        </div>
                        <div>
                            <label class="block text-gray-400 mb-1" for="exampleDescription"
                                >Descrição do Produto</label
                            >
                            <textarea
                                id="exampleDescription"
                                class="w-full bg-gray-800 rounded px-3 py-2 text-white"
                                rows="3"
                                bind:value={editingExample.description}
                            />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-400 mb-1" for="icon">Ícone</label>
                                <input
                                    type="text"
                                    id="icon"
                                    class="w-full bg-gray-800 rounded px-3 py-2 text-white"
                                    bind:value={editingExample.icon}
                                />
                            </div>
                            <div>
                                <label class="block text-gray-400 mb-1" for="celestialBody"
                                    >Corpo Celeste</label
                                >
                                <input
                                    type="text"
                                    id="celestialBody"
                                    class="w-full bg-gray-800 rounded px-3 py-2 text-white"
                                    bind:value={editingExample.celestialBody}
                                />
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-400 mb-1" for="risk">Risco</label>
                                <select
                                    id="risk"
                                    class="w-full bg-gray-800 rounded px-3 py-2 text-white"
                                    bind:value={editingExample.risk}
                                >
                                    <option value="Baixo">Baixo</option>
                                    <option value="Moderado">Moderado</option>
                                    <option value="Alto">Alto</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-400 mb-1" for="expectedReturn"
                                    >Retorno Esperado</label
                                >
                                <input
                                    type="text"
                                    id="expectedReturn"
                                    class="w-full bg-gray-800 rounded px-3 py-2 text-white"
                                    bind:value={editingExample.expectedReturn}
                                />
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-400 mb-1" for="minimumInvestment"
                                >Investimento Mínimo</label
                            >
                            <input
                                type="number"
                                id="minimumInvestment"
                                class="w-full bg-gray-800 rounded px-3 py-2 text-white"
                                bind:value={editingExample.minimumInvestment}
                            />
                        </div>
                    </div>

                    <!-- Botões de Ação -->
                    <div class="flex justify-end gap-4 mt-8">
                        <button
                            class="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                            on:click={cancelEditing}
                        >
                            Cancelar
                        </button>
                        <button
                            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                            on:click={saveChanges}
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</HologramDisplay>

<style>
    /* Adicione estilos específicos aqui se necessário */
</style> 