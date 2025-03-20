import { DailyExpenses } from './components/daily-expenses';

function App() {
  return (
    <div className="w-full h-[100vh] grid grid-cols-2 grid-rows-2 gap-4">
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
        <DailyExpenses />
      </div>
      {/* <div>
        <h3>Investments</h3>
      </div>
      <div>
        <h3>Lend</h3>
      </div>
      <div>
        <h3>Group/Share Expense</h3>
      </div> */}
    </div>
  );
}

export default App;
