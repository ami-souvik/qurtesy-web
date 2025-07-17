import { Plus, Target } from 'lucide-react';
import { Button } from '../action/button';
import { PageWrapper } from '../layout';
import { KeyboardShortcutsHelp } from '../ui/keyboard-shortcuts-help';

// Placeholder components for new features
export const GoalsContent = () => (
  <PageWrapper
    title="Financial Goals"
    headerActions={
      <div className="flex items-center space-x-2">
        <KeyboardShortcutsHelp />
        <Button leftIcon={<Plus className="h-4 w-4 mr-2" />}>
          <span className="hidden sm:inline">New Goal</span>
        </Button>
      </div>
    }
  >
    <div className="glass-card rounded-xl p-8 text-center">
      <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-white mb-2">Set Your Financial Goals</h3>
      <p className="text-slate-400 mb-6">Track progress towards emergency fund, vacation, or retirement savings</p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Create Your First Goal
      </button>
    </div>
  </PageWrapper>
);
