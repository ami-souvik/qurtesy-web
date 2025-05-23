import { Provider } from 'react-redux';
import store from './store';
import './utils/firebase';
import { Tabs } from './components/tabs';
import { Summary } from './components/summary';
import AudioRecorder from './components/audio-recorder';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <header className="glass-card border-b border-slate-700/50 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Q</span>
                </div>
                <h1 className="text-xl font-bold text-white">Qurtesy Finance</h1>
              </div>
              <div className="text-sm text-slate-400">Welcome back!</div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-120px)]">
            {/* Left Panel - Summary & Tools */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card rounded-2xl p-6 animate-slide-in">
                <Summary />
              </div>
              <div className="glass-card rounded-2xl p-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <AudioRecorder />
              </div>
            </div>

            {/* Right Panel - Transactions */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6 h-full animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <Tabs />
              </div>
            </div>
          </div>
        </main>
      </div>
    </Provider>
  );
}

export default App;
