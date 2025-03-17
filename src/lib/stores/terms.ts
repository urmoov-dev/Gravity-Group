import { writable } from 'svelte/store';

interface TermsAcceptance {
    version: string;
    acceptedAt: Date | null;
    hasAccepted: boolean;
}

interface TermsHistory {
    version: string;
    acceptedAt: Date;
}

// Versão atual dos termos
const CURRENT_TERMS_VERSION = '2025.01.01';

// Tenta recuperar o estado dos termos do localStorage
const storedTerms = typeof window !== 'undefined' ? localStorage.getItem('terms') : null;
const storedHistory = typeof window !== 'undefined' ? localStorage.getItem('terms_history') : null;

const initialTerms: TermsAcceptance = storedTerms
    ? JSON.parse(storedTerms)
    : {
        version: CURRENT_TERMS_VERSION,
        acceptedAt: null,
        hasAccepted: false
    };

const initialHistory: TermsHistory[] = storedHistory
    ? JSON.parse(storedHistory)
    : [];

function createTermsStore() {
    const { subscribe, set, update } = writable<TermsAcceptance>(initialTerms);
    const historyStore = writable<TermsHistory[]>(initialHistory);

    return {
        subscribe,
        getCurrentVersion: () => CURRENT_TERMS_VERSION,
        history: {
            subscribe: historyStore.subscribe,
            get: () => {
                let history: TermsHistory[] = [];
                if (typeof window !== 'undefined') {
                    const stored = localStorage.getItem('terms_history');
                    if (stored) {
                        history = JSON.parse(stored);
                    }
                }
                return history;
            }
        },
        accept: () => update(state => {
            const now = new Date();
            const newState = {
                ...state,
                version: CURRENT_TERMS_VERSION, // Garantir que estamos aceitando a versão atual
                acceptedAt: now,
                hasAccepted: true
            };

            // Adiciona ao histórico
            const historyEntry: TermsHistory = {
                version: CURRENT_TERMS_VERSION,
                acceptedAt: now
            };
            
            let history: TermsHistory[] = [];
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('terms_history');
                if (stored) {
                    history = JSON.parse(stored);
                }
                
                // Verifica se já existe um registro para esta versão
                const existingEntryIndex = history.findIndex(entry => entry.version === CURRENT_TERMS_VERSION);
                if (existingEntryIndex >= 0) {
                    // Atualiza a data de aceitação
                    history[existingEntryIndex].acceptedAt = now;
                } else {
                    // Adiciona novo registro
                    history.push(historyEntry);
                }
                
                localStorage.setItem('terms_history', JSON.stringify(history));
                localStorage.setItem('terms', JSON.stringify(newState));
                
                // Salva também em cookie para fácil acesso em componentes SSR
                document.cookie = `terms_accepted=true;path=/;max-age=${60 * 60 * 24 * 365}`;
                document.cookie = `terms_version=${CURRENT_TERMS_VERSION};path=/;max-age=${60 * 60 * 24 * 365}`;
                document.cookie = `terms_acceptance_date=${now.toISOString()};path=/;max-age=${60 * 60 * 24 * 365}`;
            }
            
            historyStore.set(history);
            return newState;
        }),
        reject: () => update(state => {
            const newState = {
                ...state,
                acceptedAt: null,
                hasAccepted: false
            };
            // Salva no localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('terms', JSON.stringify(newState));
                // Remove os cookies
                document.cookie = 'terms_accepted=false;path=/;max-age=0';
                document.cookie = 'terms_version=;path=/;max-age=0';
                document.cookie = 'terms_acceptance_date=;path=/;max-age=0';
            }
            return newState;
        }),
        reset: () => {
            const newState = {
                version: CURRENT_TERMS_VERSION,
                acceptedAt: null,
                hasAccepted: false
            };
            // Salva no localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('terms', JSON.stringify(newState));
                // Remove os cookies
                document.cookie = 'terms_accepted=false;path=/;max-age=0';
                document.cookie = 'terms_version=;path=/;max-age=0';
                document.cookie = 'terms_acceptance_date=;path=/;max-age=0';
            }
            set(newState);
        }
    };
}

export const terms = createTermsStore(); 