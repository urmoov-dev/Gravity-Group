import { writable, derived } from 'svelte/store';
import type { InvestmentCategory, InvestmentExample } from '$lib/types/profile';
import { INVESTMENT_CATEGORIES } from '$lib/types/profile';

// Store para as categorias de investimento
export const investmentCategories = writable<InvestmentCategory[]>(INVESTMENT_CATEGORIES);

// Store derivada para encontrar a categoria atual baseada no valor investido
export const getCurrentCategory = derived(
    investmentCategories,
    ($categories) => (amount: number) => {
        return $categories.find(
            (category) =>
                amount >= category.minAmount &&
                (category.maxAmount === null || amount < category.maxAmount)
        );
    }
);

// Store derivada para encontrar o exemplo de investimento baseado no ID da categoria
export const getCategoryExample = derived(
    investmentCategories,
    ($categories) => (categoryId: number) => {
        const category = $categories.find((cat) => cat.id === categoryId);
        return category?.examples[0];
    }
);

// Função para atualizar uma categoria
export function updateCategory(categoryId: number, updatedCategory: Partial<InvestmentCategory>) {
    investmentCategories.update(($categories) => {
        const index = $categories.findIndex((cat) => cat.id === categoryId);
        if (index !== -1) {
            $categories[index] = { ...$categories[index], ...updatedCategory };
        }
        return $categories;
    });
}

// Função para atualizar um exemplo de investimento
export function updateExample(
    categoryId: number,
    exampleId: number,
    updatedExample: Partial<InvestmentExample>
) {
    investmentCategories.update(($categories) => {
        const categoryIndex = $categories.findIndex((cat) => cat.id === categoryId);
        if (categoryIndex !== -1) {
            const exampleIndex = $categories[categoryIndex].examples.findIndex(
                (ex) => ex.id === exampleId
            );
            if (exampleIndex !== -1) {
                $categories[categoryIndex].examples[exampleIndex] = {
                    ...$categories[categoryIndex].examples[exampleIndex],
                    ...updatedExample
                };
            }
        }
        return $categories;
    });
}

// Função para adicionar uma nova categoria
export function addCategory(newCategory: InvestmentCategory) {
    investmentCategories.update(($categories) => [...$categories, newCategory]);
}

// Função para remover uma categoria
export function removeCategory(categoryId: number) {
    investmentCategories.update(($categories) =>
        $categories.filter((category) => category.id !== categoryId)
    );
}

// Função para adicionar um exemplo a uma categoria
export function addExample(categoryId: number, newExample: InvestmentExample) {
    investmentCategories.update(($categories) => {
        const categoryIndex = $categories.findIndex((cat) => cat.id === categoryId);
        if (categoryIndex !== -1) {
            $categories[categoryIndex].examples.push(newExample);
        }
        return $categories;
    });
}

// Função para remover um exemplo de uma categoria
export function removeExample(categoryId: number, exampleId: number) {
    investmentCategories.update(($categories) => {
        const categoryIndex = $categories.findIndex((cat) => cat.id === categoryId);
        if (categoryIndex !== -1) {
            $categories[categoryIndex].examples = $categories[categoryIndex].examples.filter(
                (example) => example.id !== exampleId
            );
        }
        return $categories;
    });
} 