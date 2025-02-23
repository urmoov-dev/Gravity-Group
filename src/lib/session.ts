import { auth } from './firebase';
import type { User } from 'firebase/auth';

export async function setSessionCookie() {
    const user = auth.currentUser;
    if (!user) return null;

    const idToken = await user.getIdToken();
    
    // Definir o cookie de sessão
    document.cookie = `session=${idToken}; path=/; max-age=${60 * 60 * 24}; samesite=lax`;
    
    return idToken;
}

export function clearSessionCookie() {
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'terms_accepted=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
} 