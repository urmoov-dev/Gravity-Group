import type { LayoutLoad } from './$types';
import type { User } from 'firebase/auth';
import { auth } from '$lib/firebase';

export const load: LayoutLoad = async () => {
    if (typeof window !== 'undefined') {
        return new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
                unsubscribe();
                resolve({ user });
            });
        });
    }
    
    return { user: null };
}; 