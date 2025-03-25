import { Provider } from 'react-redux';
import store from './store';
import { Tabs } from './components/tabs';
import { Summary } from './components/summary';

function App() {
  return (
    <Provider store={store}>
      <div className="w-screen h-screen grid grid-cols-2 grid-rows-2 gap-4 p-12">
        <div className="grid grid-cols-2 grid-rows-2">
          <Summary />
        </div>
        <div className="row-span-2">
          <Tabs />
        </div>
      </div>
    </Provider>
  );
}

export default App;
