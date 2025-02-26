import { writable } from 'svelte/store';
import type { UserProfile } from '$lib/types/profile';
import { ASTRONOMICAL_LEVELS } from '$lib/types/profile';

function calculateLevel(amount: number) {
    const currentLevel = ASTRONOMICAL_LEVELS.reduce((prev, current) => {
        if (amount >= current.requiredAmount) {
            return current;
        }
        return prev;
    }, ASTRONOMICAL_LEVELS[0]);

    const nextLevelIndex = ASTRONOMICAL_LEVELS.findIndex(level => level.id === currentLevel.id) + 1;
    const nextLevel = nextLevelIndex < ASTRONOMICAL_LEVELS.length ? ASTRONOMICAL_LEVELS[nextLevelIndex] : null;

    let progressToNext = 0;
    if (nextLevel) {
        const range = nextLevel.requiredAmount - currentLevel.requiredAmount;
        const progress = amount - currentLevel.requiredAmount;
        progressToNext = Math.min((progress / range) * 100, 100);
    }

    return {
        currentAmount: amount,
        currentLevel,
        nextLevel,
        progressToNext
    };
}

function createProfileStore() {
    const { subscribe, set, update } = writable<UserProfile>(calculateLevel(0));

    return {
        subscribe,
        updateAmount: (amount: number) => {
            set(calculateLevel(amount));
        },
        reset: () => {
            set(calculateLevel(0));
        }
    };
}

export const profile = createProfileStore(); 