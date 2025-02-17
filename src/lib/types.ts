import type { User } from 'firebase/auth';

export interface Investment {
  partner: string;
  initialAmount: number;
  currentAmount: number;
  startDate: string;
  returns: Array<{
    date: string;
    value: number;
  }>;
  roi: number;
  term: string;
  nextPayment: string;
  risk: string;
  category: string;
}

export interface ChartOptions {
  series: any[];
  chart: any;
  [key: string]: any;
}

export interface UserStore {
  user: User | null;
} 