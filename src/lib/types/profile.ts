export interface InvestmentLevel {
  id: string;
  name: string;
  minValue: number;
  maxValue: number | null;
  icon: string;
  color: string;
  benefits: string[];
  description: string;
  nextGoal?: string;
}

export const investmentLevels: InvestmentLevel[] = [
  {
    id: 'mercury',
    name: 'Mercúrio',
    minValue: 0,
    maxValue: 50000,
    icon: '☄️',
    color: 'text-gray-400',
    benefits: [
      'Acesso à plataforma básica',
      'Suporte por email',
      'Relatórios mensais'
    ],
    description: 'O primeiro passo na sua jornada espacial.',
    nextGoal: 'Alcance R$50.000 para chegar a Vênus'
  },
  {
    id: 'venus',
    name: 'Vênus',
    minValue: 50000,
    maxValue: 150000,
    icon: '🌅',
    color: 'text-orange-400',
    benefits: [
      'Todos os benefícios anteriores',
      'Consultor dedicado',
      'Relatórios semanais',
      'Primeiro produto exclusivo'
    ],
    description: 'O planeta mais quente, assim como seus investimentos.',
    nextGoal: 'Alcance R$150.000 para chegar à Terra'
  },
  {
    id: 'earth',
    name: 'Terra',
    minValue: 150000,
    maxValue: 300000,
    icon: '🌍',
    color: 'text-blue-400',
    benefits: [
      'Todos os benefícios anteriores',
      'Análises personalizadas',
      'Acesso a eventos exclusivos',
      'Clube de investidores'
    ],
    description: 'Sua base de operações estabelecida.',
    nextGoal: 'Alcance R$300.000 para atravessar o Cinturão de Asteroides'
  },
  {
    id: 'asteroid-belt',
    name: 'Cinturão de Asteroides',
    minValue: 300000,
    maxValue: 500000,
    icon: '💫',
    color: 'text-yellow-300',
    benefits: [
      'Todos os benefícios anteriores',
      'Mineração de oportunidades',
      'Produtos diversificados',
      'Proteção patrimonial'
    ],
    description: 'Navegando por múltiplas oportunidades.',
    nextGoal: 'Alcance R$500.000 para chegar a Marte'
  },
  {
    id: 'mars',
    name: 'Marte',
    minValue: 500000,
    maxValue: 1000000,
    icon: '🔴',
    color: 'text-red-500',
    benefits: [
      'Todos os benefícios anteriores',
      'Equipe dedicada',
      'Produtos de alta rentabilidade',
      'Eventos VIP'
    ],
    description: 'Conquistando novos territórios.',
    nextGoal: 'Alcance R$1.000.000 para chegar a Júpiter'
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    minValue: 1000000,
    maxValue: 2500000,
    icon: '🌟',
    color: 'text-amber-500',
    benefits: [
      'Todos os benefícios anteriores',
      'Gestão de patrimônio personalizada',
      'Acesso a fundos restritos',
      'Encontros com CEOs'
    ],
    description: 'O maior dos planetas, para grandes investidores.',
    nextGoal: 'Alcance R$2.500.000 para chegar a Saturno'
  },
  {
    id: 'saturn',
    name: 'Saturno',
    minValue: 2500000,
    maxValue: 5000000,
    icon: '🪐',
    color: 'text-purple-400',
    benefits: [
      'Todos os benefícios anteriores',
      'Estratégias exclusivas',
      'Comitê de investimentos',
      'Eventos internacionais'
    ],
    description: 'Seu patrimônio brilha como os anéis de Saturno.',
    nextGoal: 'Alcance R$5.000.000 para chegar a Urano'
  },
  {
    id: 'uranus',
    name: 'Urano',
    minValue: 5000000,
    maxValue: 7500000,
    icon: '❄️',
    color: 'text-cyan-400',
    benefits: [
      'Todos os benefícios anteriores',
      'Produtos sob medida',
      'Equipe internacional',
      'Acesso à diretoria'
    ],
    description: 'Inovando além das fronteiras conhecidas.',
    nextGoal: 'Alcance R$7.500.000 para chegar a Netuno'
  },
  {
    id: 'neptune',
    name: 'Netuno',
    minValue: 7500000,
    maxValue: null,
    icon: '🌊',
    color: 'text-blue-600',
    benefits: [
      'Todos os benefícios anteriores',
      'Estruturação de produtos próprios',
      'Participação em decisões estratégicas',
      'Benefícios ilimitados',
      'Membro do conselho Gravity'
    ],
    description: 'O ápice do universo Gravity Group.',
    nextGoal: 'Você alcançou o nível máximo!'
  }
]; 