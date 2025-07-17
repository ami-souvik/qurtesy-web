import { useState } from 'react';
import { BASE_URL } from '../config';

interface TestResult {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  data: unknown;
  timestamp: string;
}

const LendSplitTester = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (type: 'success' | 'error' | 'info' | 'warning', message: string, data: unknown = null) => {
    setTestResults((prev) => [
      ...prev,
      {
        type,
        message,
        data,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const runTest = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Check lends API
      addResult('info', 'Testing lends API...');
      const lendsRes = await fetch(`${BASE_URL}/api/lends/`);
      const lends = await lendsRes.json();
      addResult('success', `✅ Found ${lends.length} lend transactions`, lends);

      // Test 2: Check lend summary
      addResult('info', 'Testing lend summary...');
      const summaryRes = await fetch(`${BASE_URL}/api/lends/summary/`);
      const summary = await summaryRes.json();
      addResult('success', '✅ Lend summary retrieved', summary);

      // Test 3: Check profiles API
      addResult('info', 'Testing profiles API...');
      const profilesRes = await fetch(`${BASE_URL}/api/profiles/`);
      const profiles: Array<{ id: number; name: string; is_self: boolean }> = await profilesRes.json();
      addResult('success', `✅ Found ${profiles.length} profiles`, profiles);

      // Test 4: Check accounts API
      addResult('info', 'Testing accounts API...');
      const accountsRes = await fetch(`${BASE_URL}/api/accounts/`);
      const accounts = await accountsRes.json();
      addResult('success', `✅ Found ${accounts.length} accounts`, accounts);

      // Test 5: Check categories API
      addResult('info', 'Testing categories API...');
      const categoriesRes = await fetch(`${BASE_URL}/api/categories/?section=EXPENSE`);
      const categories = await categoriesRes.json();
      addResult('success', `✅ Found ${categories.length} categories`, categories);

      // Test 6: Create a test lend transaction
      if (profiles.length >= 2 && accounts.length >= 1 && categories.length >= 1) {
        addResult('info', 'Creating test lend transaction...');

        const borrowerProfile = profiles.find((p) => !p.is_self);
        if (borrowerProfile) {
          const lendData = {
            amount: 199.99,
            date: new Date().toLocaleDateString('en-GB'),
            borrower_profile_id: borrowerProfile.id,
            category_id: categories[0].id,
            account_id: accounts[0].id,
            note: 'Frontend test lend transaction',
          };

          const createRes = await fetch(`${BASE_URL}/api/lends/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lendData),
          });

          if (createRes.ok) {
            const result = await createRes.json();
            addResult('success', '✅ Lend transaction created successfully!', result);

            // Test 7: Update repayment status
            addResult('info', 'Testing repayment status update...');
            const repaymentRes = await fetch(
              `http://localhost:8085/api/lends/${result.lend_transaction_id}/repayment`,
              {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  is_repaid: true,
                  repaid_date: new Date().toLocaleDateString('en-GB'),
                }),
              }
            );

            if (repaymentRes.ok) {
              addResult('success', '✅ Repayment status updated successfully!');
            } else {
              const errorText = await repaymentRes.text();
              addResult('error', `❌ Failed to update repayment status: ${errorText}`);
            }
          } else {
            const errorText = await createRes.text();
            addResult('error', `❌ Failed to create lend: ${errorText}`);
          }
        }
      } else {
        addResult('warning', '⚠️ Insufficient data to create lend transaction');
      }

      // Test 8: Create test split transaction and verify lend records
      if (profiles.length >= 2 && accounts.length >= 1 && categories.length >= 1) {
        addResult('info', 'Creating test split to verify lend integration...');

        const splitData = {
          name: 'Frontend Integration Test Split',
          total_amount: 450.75,
          date: new Date().toLocaleDateString('en-GB'),
          category_id: categories[0].id,
          created_by_account_id: accounts[0].id,
          participants: [{ profile_id: profiles[0].id }, { profile_id: profiles[1].id }],
          note: 'Frontend test split for lend integration',
        };

        const splitCreateRes = await fetch(`${BASE_URL}/api/splits/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(splitData),
        });

        if (splitCreateRes.ok) {
          const splitResult = await splitCreateRes.json();
          addResult('success', '✅ Split transaction created successfully!', splitResult);

          // Check if lend records were created
          addResult('info', 'Checking for automatically created lend records...');
          const updatedLendsRes = await fetch(`${BASE_URL}/api/lends/`);
          const updatedLends: Array<{ related_split_transaction_id?: number }> = await updatedLendsRes.json();

          const splitLends = updatedLends.filter(
            (lend: { related_split_transaction_id?: number }) =>
              lend.related_split_transaction_id === splitResult.split_transaction_id
          );

          if (splitLends.length > 0) {
            addResult('success', `✅ Found ${splitLends.length} lend records created from split!`, splitLends);
          } else {
            addResult('warning', '⚠️ No lend records found for the split transaction');
          }
        } else {
          const errorText = await splitCreateRes.text();
          addResult('error', `❌ Failed to create split: ${errorText}`);
        }
      }

      addResult('success', '🎉 All frontend tests completed!');
    } catch (error) {
      addResult('error', `❌ Frontend test failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Lend & Split Integration Tester</h2>

      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-2">What this test does:</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• Tests all lend and split APIs</li>
          <li>• Creates test lend transactions</li>
          <li>• Verifies split transactions automatically create lend records</li>
          <li>• Tests repayment status updates</li>
          <li>• Validates complete integration between lend and split features</li>
        </ul>
      </div>

      <button
        onClick={runTest}
        disabled={loading}
        className="mb-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg disabled:opacity-50 flex items-center space-x-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Running Tests...</span>
          </>
        ) : (
          <span>Run Lend & Split Integration Tests</span>
        )}
      </button>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.type === 'success'
                ? 'bg-green-500/20 border-green-500/50'
                : result.type === 'error'
                  ? 'bg-red-500/20 border-red-500/50'
                  : result.type === 'warning'
                    ? 'bg-yellow-500/20 border-yellow-500/50'
                    : 'bg-blue-500/20 border-blue-500/50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-white font-medium">{result.message}</span>
              <span className="text-slate-400 text-sm">{result.timestamp}</span>
            </div>
            {result.data ? (
              <details className="mt-2">
                <summary className="text-slate-300 cursor-pointer text-sm hover:text-white">View Details</summary>
                <pre className="mt-2 p-3 bg-slate-900/50 rounded text-xs text-slate-300 overflow-auto max-h-40">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>

      {testResults.length === 0 && !loading && (
        <div className="text-center py-8 text-slate-400">
          <p>Click the button above to run the integration tests</p>
        </div>
      )}
    </div>
  );
};

export default LendSplitTester;
