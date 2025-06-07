import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import store from './store';
import './utils/firebase';
import { MainPage, LandingPage } from './pages';
import SplitTester from './components/SplitTester';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* <NavigationHeader /> */}
          {/* <main className="container mx-auto"> */}
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/test-split" element={<SplitTester />} />
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
          {/* </main> */}
        </div>
      </Router>
    </Provider>
  );
}

export default App;
