import { Provider } from 'react-redux';
import store from './store';
import { DailyExpenses } from './components/daily-expenses';
import { Tab, Tabs } from './components/ui';

function App() {
  return (
    <Provider store={store}>
      <div className="w-[100vw] h-[100vh] grid grid-cols-2 grid-rows-2 gap-4">
        <div>
          <p>total balance</p>
          <p>20,000/-</p>
          <div className="flex gap-4">
            <div className="border-r">
              <p>income</p>
              <p>40,000/-</p>
            </div>
            <div className="border-r">
              <p>expenses</p>
              <p>20,000/-</p>
            </div>
            <div>
              <p>total</p>
              <p>20,000/-</p>
            </div>
          </div>
        </div>
        <div>
          <Tabs>
            <Tab label="Daily Expenses">
              <DailyExpenses />
            </Tab>
            <Tab label="Investments" />
            <Tab label="Lend" />
            <Tab label="Group/Share Expense" />
          </Tabs>
        </div>
      </div>
    </Provider>
  );
}

export default App;
