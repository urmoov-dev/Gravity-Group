import app from '$lib/firebase';
import type { TermsVersion, UserTermsAcceptance, TermsMetadata } from '$lib/types/terms';
import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, Timestamp, getFirestore } from 'firebase/firestore';

const db = getFirestore(app)
export class TermsService {
    private static TERMS_COLLECTION = 'terms';
    private static ACCEPTANCES_COLLECTION = 'termsAcceptances';
    private static METADATA_DOC = 'metadata';

    static async getCurrentTerms(): Promise<TermsVersion | null> {
        const metadataRef = doc(db, this.TERMS_COLLECTION, this.METADATA_DOC);
        const metadataSnap = await getDoc(metadataRef);
        
        if (!metadataSnap.exists()) {
            return null;
        }

        const metadata = metadataSnap.data() as TermsMetadata;
        const currentTermsRef = doc(db, this.TERMS_COLLECTION, metadata.currentVersion);
        const currentTermsSnap = await getDoc(currentTermsRef);

        if (!currentTermsSnap.exists()) {
            return null;
        }

        return currentTermsSnap.data() as TermsVersion;
    }

    static async getTermsById(termsId: string): Promise<TermsVersion | null> {
        const termsRef = doc(db, this.TERMS_COLLECTION, termsId);
        const termsSnap = await getDoc(termsRef);

        if (!termsSnap.exists()) {
            return null;
        }

        return termsSnap.data() as TermsVersion;
    }

    static async getUserAcceptedTerms(userId: string): Promise<UserTermsAcceptance[]> {
        const acceptancesRef = collection(db, this.ACCEPTANCES_COLLECTION);
        const q = query(acceptancesRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            acceptedAt: (doc.data().acceptedAt as Timestamp).toDate()
        })) as UserTermsAcceptance[];
    }

    static async acceptTerms(userId: string, termsId: string, version: string): Promise<void> {
        const acceptance: Omit<UserTermsAcceptance, 'acceptedAt'> & { acceptedAt: Date } = {
            userId,
            termsId,
            version,
            acceptedAt: new Date()
        };

        await addDoc(collection(db, this.ACCEPTANCES_COLLECTION), acceptance);
    }

    static async hasAcceptedCurrentTerms(userId: string): Promise<boolean> {
        const currentTerms = await this.getCurrentTerms();
        if (!currentTerms) return false;

        const acceptances = await this.getUserAcceptedTerms(userId);
        return acceptances.some(acceptance => acceptance.termsId === currentTerms.id);
    }

    static async getAllTermsVersions(): Promise<TermsVersion[]> {
        const termsRef = collection(db, this.TERMS_COLLECTION);
        const querySnapshot = await getDocs(termsRef);
        
        return querySnapshot.docs
            .map(doc => doc.data() as TermsVersion)
            .filter(terms => terms.version !== undefined) // Exclui o documento de metadata
            .sort((a, b) => (b.effectiveDate as any) - (a.effectiveDate as any));
    }
} 