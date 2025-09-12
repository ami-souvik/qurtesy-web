import {
  Home,
  BarChart3,
  PiggyBank,
  Repeat,
  Settings,
  TrendingUp,
  Target,
  Download,
  Upload,
  Wallet,
  BotMessageSquare,
} from 'lucide-react';
import { Api } from './axios';
import { SQlite } from './sqlite';

const api = new Api();
const sqlite = new SQlite();

const routes = {
  agent: {
    label: 'Financial Assistant',
    icon: BotMessageSquare,
    category: 'main',
  },
  overview: {
    label: 'Overview',
    icon: BarChart3,
    category: 'main',
  },
  transactions: {
    label: 'Transactions',
    icon: Home,
    category: 'main',
  },
  budget: {
    label: 'Budgets',
    icon: PiggyBank,
    category: 'planning',
  },
  accounts: {
    label: 'Data Management',
    icon: Wallet,
    category: 'planning',
  },
  recurring: {
    label: 'Recurring',
    icon: Repeat,
    category: 'planning',
  },
  goals: {
    label: 'Goals',
    icon: Target,
    category: 'planning',
  },
  investments: {
    label: 'Investments',
    icon: TrendingUp,
    category: 'planning',
  },
  export: {
    label: 'Export',
    icon: Download,
    category: 'tools',
  },
  import: {
    label: 'Import',
    icon: Upload,
    category: 'tools',
  },
  settings: {
    label: 'Settings',
    icon: Settings,
    category: 'tools',
  },
} as const;

export { api, sqlite, routes };
