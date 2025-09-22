import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store, persistor } from './store';
import { RootPage, LandingPage } from './pages';
import SplitTester from './components/SplitTester';
import LendSplitTester from './components/LendSplitTester';
import { Agent } from './pages/agent';
import { OverviewContent } from './pages/overview';
import { TransactionTracker } from './pages/transactions';
import { BudgetTracker } from './pages/budget-tracker';
import { DataManagement } from './components/data-management';
import { RecurringTransactionManager } from './components/recurring';
import { GoalsContent } from './components/dashboard/goals-content';
import { InvestmentsContent } from './components/dashboard/investments-content';
import { ImportManager, ExportManager } from './components/statement';
import { TransactionForm } from './components/form/transaction-form';
import { LoadingScreen } from './components/loading-screen';
import { registerSW } from './utils/pwa';
import PWAInstallBanner from './components/pwa-install-banner';
import Assistant from './components/voice/assistant';
import { useInitApp } from './hooks';
import { Settings } from './pages/settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootPage />}>
          <Route path="agent" element={<Agent />} />
          <Route path="overview" element={<OverviewContent />} />
          <Route path="transactions" element={<TransactionTracker />}>
            <Route path="modal/transaction" element={<TransactionForm />} />
          </Route>
          <Route path="budget" element={<BudgetTracker />} />
          <Route path="accounts" element={<DataManagement />} />
          <Route path="recurring" element={<RecurringTransactionManager />} />
          <Route path="goals" element={<GoalsContent />} />
          <Route path="investments" element={<InvestmentsContent />} />
          <Route path="export" element={<ExportManager />} />
          <Route path="import" element={<ImportManager />} />
          <Route path="settings" element={<Settings />} />
          <Route path="voice" element={<Assistant />} />
        </Route>
        <Route path="/f/landing" element={<LandingPage />} />
        <Route path="/f/test/split" element={<SplitTester />} />
        <Route path="/f/test/lend-split" element={<LendSplitTester />} />
        <Route
          path="*"
          element={
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
              <p className="text-slate-400">The page you're looking for doesn't exist.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

// Root component with provider
export default function AppWithProvider() {
  const { loading } = useInitApp();
  useEffect(() => {
    registerSW();
  }, []);
  if (loading) return <LoadingScreen />;
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <App />
        {/* PWA Install Banner */}
        <PWAInstallBanner />
      </PersistGate>
    </Provider>
  );
}
