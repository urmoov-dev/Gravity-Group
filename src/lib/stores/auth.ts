import { writable } from 'svelte/store';
import { auth } from '$lib/firebase';
import type { User } from 'firebase/auth';

export const user = writable<User | null>(null);

// Inicializar o listener de autenticação
if (typeof window !== 'undefined') {
    auth.onAuthStateChanged((firebaseUser) => {
        user.set(firebaseUser);
    });
} 