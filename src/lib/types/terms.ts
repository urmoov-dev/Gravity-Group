export interface TermsVersion {
    id: string;
    version: string;
    effectiveDate: Date;
    content: string;
    isActive: boolean;
}

export interface UserTermsAcceptance {
    userId: string;
    termsId: string;
    acceptedAt: Date;
    version: string;
}

export interface TermsMetadata {
    currentVersion: string;
    versions: {
        [version: string]: {
            effectiveDate: Date;
            path: string;
        }
    }
} 