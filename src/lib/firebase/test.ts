import { auth } from './config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getTermsSignature, signTerms } from './terms';
import { 
    getOnboardingStatus, 
    createOnboardingStatus, 
    updateOnboardingStep, 
    hasCompletedOnboarding 
} from './onboarding';

// Função para testar autenticação
async function testAuth() {
    try {
        // Substitua com um email e senha de teste
        const userCredential = await signInWithEmailAndPassword(auth, 'teste@exemplo.com', 'senha123');
        console.log('✅ Autenticação bem-sucedida:', userCredential.user.email);
        return userCredential.user;
    } catch (error) {
        console.error('❌ Erro na autenticação:', error);
        return null;
    }
}

// Função para testar termos de serviço
async function testTerms(user: any) {
    try {
        // Testa busca de assinatura
        console.log('🔍 Buscando assinatura dos termos...');
        const signature = await getTermsSignature(user, '2025.03.20');
        console.log('📝 Assinatura encontrada:', signature);

        // Se não houver assinatura, testa assinatura dos termos
        if (!signature) {
            console.log('✍️ Assinando termos...');
            await signTerms(user, '2025.03.20');
            const newSignature = await getTermsSignature(user, '2025.03.20');
            console.log('✅ Nova assinatura criada:', newSignature);
        }
    } catch (error) {
        console.error('❌ Erro nos testes de termos:', error);
    }
}

// Função para testar onboarding
async function testOnboarding(user: any) {
    try {
        // Testa busca de status do onboarding
        console.log('🔍 Buscando status do onboarding...');
        let status = await getOnboardingStatus(user);
        console.log('📊 Status atual:', status);

        // Se não houver status, cria um novo
        if (!status) {
            console.log('📝 Criando novo status de onboarding...');
            await createOnboardingStatus(user);
            status = await getOnboardingStatus(user);
            console.log('✅ Novo status criado:', status);
        }

        // Testa atualização de passos
        console.log('🔄 Atualizando passos do onboarding...');
        await updateOnboardingStep(user, 'profileCompleted', true);
        await updateOnboardingStep(user, 'termsAccepted', true);
        
        // Verifica se completou o onboarding
        const completed = await hasCompletedOnboarding(user);
        console.log('🎯 Onboarding completo?', completed);
        
        // Busca status final
        const finalStatus = await getOnboardingStatus(user);
        console.log('📊 Status final:', finalStatus);
    } catch (error) {
        console.error('❌ Erro nos testes de onboarding:', error);
    }
}

// Função principal de teste
export async function runTests() {
    console.log('🚀 Iniciando testes do Firebase...');
    
    const user = await testAuth();
    if (user) {
        await testTerms(user);
        await testOnboarding(user);
    }
    
    console.log('✨ Testes concluídos!');
} 