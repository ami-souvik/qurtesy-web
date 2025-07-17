import { TrendingUp } from 'lucide-react';
import { PageWrapper } from '../layout';

export const InvestmentsContent = () => (
  <PageWrapper
    title="Investment Portfolio"
    headerActions={
      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        + Add Investment
      </button>
    }
  >
    <div className="glass-card rounded-xl p-8 text-center">
      <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-white mb-2">Track Your Investments</h3>
      <p className="text-slate-400 mb-6">Monitor stocks, mutual funds, and other investment performance</p>
      <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        Connect Your Portfolio
      </button>
    </div>
  </PageWrapper>
);
