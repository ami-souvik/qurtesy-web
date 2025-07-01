import { Tabs } from '../tabs';
import { PageWrapper } from '../layout';

export const TransactionTracker: React.FC = () => {
  return (
    <PageWrapper
      title="Transaction Management"
      subtitle="Track and manage your income, expenses, transfers, and investments"
    >
      <div className="rounded-2xl h-full animate-slide-in">
        <Tabs />
      </div>
    </PageWrapper>
  );
};
