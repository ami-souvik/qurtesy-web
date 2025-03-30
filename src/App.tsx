import { Provider } from 'react-redux';
import store from './store';
import './utils/firebase';
import { Tabs } from './components/tabs';
import { Summary } from './components/summary';
import AudioRecorder from './components/audio-recorder';

function App() {
  return (
    <Provider store={store}>
      <div className="w-screen h-screen grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 p-12">
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          <Summary />
          <AudioRecorder />
        </div>
        <div className="row-span-2">
          <Tabs />
        </div>
      </div>
    </Provider>
  );
}

export default App;
