import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store, persistor } from './store';
import './utils/firebase';
import { MainPage, LandingPage } from './pages';
import SplitTester from './components/SplitTester';
import LendSplitTester from './components/LendSplitTester';

import { OverviewContent } from './components/dashboard/overview-content';
import { TransactionTracker } from './components/home/transaction-tracker';
import { BudgetTracker } from './components/budget/budget-tracker';
import { AccountSettings } from './components/settings';
import { RecurringTransactionManager } from './components/recurring';
import { GoalsContent } from './components/dashboard/goals-content';
import { InvestmentsContent } from './components/dashboard/investments-content';
import { ExportManager } from './components/export';
import { PhonePeImporter } from './components/import';
import { CurrencySettings } from './components/currency';
import { NotificationSettingsPanel } from './components/notifications';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Routes>
              <Route path="f" element={<MainPage />}>
                <Route path="overview" element={<OverviewContent />} />
                <Route path="home" element={<TransactionTracker />} />
                <Route path="budget" element={<BudgetTracker />} />
                <Route path="accounts" element={<AccountSettings />} />
                <Route path="recurring" element={<RecurringTransactionManager />} />
                <Route path="goals" element={<GoalsContent />} />
                <Route path="investments" element={<InvestmentsContent />} />
                <Route path="export" element={<ExportManager />} />
                <Route path="import" element={<PhonePeImporter />} />
                <Route
                  path="settings"
                  element={
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
                      </div>
                      <CurrencySettings />
                      <NotificationSettingsPanel />
                    </div>
                  }
                />
              </Route>
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/test/split" element={<SplitTester />} />
              <Route path="/test/lend-split" element={<LendSplitTester />} />
              <Route
                path="*"
                element={
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-white mb-4">Page Not Found</h1>
                    <p className="text-slate-400">The page you're looking for doesn't exist.</p>
                  </div>
                }
              />
            </Routes>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
