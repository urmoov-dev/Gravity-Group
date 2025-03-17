import { writable } from 'svelte/store';
import { ASTRONOMICAL_LEVELS } from '$lib/types/profile';

function createLevelStore() {
    const { subscribe, set, update } = writable(ASTRONOMICAL_LEVELS[0]);

    return {
        subscribe,
        setLevel: (levelId: number) => {
            const level = ASTRONOMICAL_LEVELS.find(l => l.id === levelId);
            if (level) {
                set(level);
            }
        },
        reset: () => set(ASTRONOMICAL_LEVELS[0])
    };
}

export const currentLevel = createLevelStore(); 