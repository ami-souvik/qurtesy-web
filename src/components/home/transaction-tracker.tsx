import { Tabs } from '../../components/tabs';

export const TransactionTracker: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Current Activity */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> */}
      {/* Left Panel - Summary & Tools */}
      {/* <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card rounded-2xl p-6 animate-slide-in">
                    <Summary />
                    </div>
                    <div className="glass-card rounded-2xl p-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
                    <AudioRecorder />
                    </div>
                </div> */}

      {/* Right Panel - Transactions */}
      {/* <div className="lg:col-span-2"> */}
      <div className="glass-card rounded-2xl p-6 h-full animate-slide-in" style={{ animationDelay: '0.2s' }}>
        <Tabs />
      </div>
      {/* </div> */}
      {/* </div> */}
    </div>
  );
};
