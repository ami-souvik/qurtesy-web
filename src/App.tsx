import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import store from './store';
import './utils/firebase';
import { NavigationHeader } from './components/navigation';
import { HomePage, DashboardPage } from './pages';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <NavigationHeader />

          <main className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
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
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
