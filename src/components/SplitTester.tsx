import React, { useState } from 'react';

const SplitTester = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (type, message, data = null) => {
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
      // Test 1: Check profiles API
      addResult('info', 'Testing profiles API...');
      const profilesRes = await fetch('http://localhost:8085/api/profiles/');
      const profiles = await profilesRes.json();
      addResult('success', `✅ Found ${profiles.length} profiles`, profiles);

      // Test 2: Check accounts API
      addResult('info', 'Testing accounts API...');
      const accountsRes = await fetch('http://localhost:8085/api/accounts/');
      const accounts = await accountsRes.json();
      addResult('success', `✅ Found ${accounts.length} accounts`, accounts);

      // Test 3: Check categories API
      addResult('info', 'Testing categories API...');
      const categoriesRes = await fetch('http://localhost:8085/api/categories/?section=EXPENSE');
      const categories = await categoriesRes.json();
      addResult('success', `✅ Found ${categories.length} categories`, categories);

      // Test 4: Create test split
      if (profiles.length >= 2 && accounts.length >= 1 && categories.length >= 1) {
        addResult('info', 'Creating test split...');

        const splitData = {
          name: 'Automated Test Split',
          total_amount: 299.5,
          date: new Date().toLocaleDateString('en-GB'),
          category_id: categories[0].id,
          created_by_account_id: accounts[0].id,
          participants: [{ profile_id: profiles[0].id }, { profile_id: profiles[1].id }],
          note: 'Automated test split',
        };

        const createRes = await fetch('http://localhost:8085/api/splits/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(splitData),
        });

        if (createRes.ok) {
          const result = await createRes.json();
          addResult('success', '✅ Split created successfully!', result);

          // Test 5: Retrieve splits
          addResult('info', 'Retrieving splits...');
          const splitsRes = await fetch('http://localhost:8085/api/splits/');

          if (splitsRes.ok) {
            const splits = await splitsRes.json();
            addResult('success', `✅ Retrieved ${splits.length} splits`, splits);
          } else {
            const errorText = await splitsRes.text();
            addResult('error', `❌ Failed to retrieve splits: ${errorText}`);
          }
        } else {
          const errorText = await createRes.text();
          addResult('error', `❌ Failed to create split: ${errorText}`);
        }
      } else {
        addResult('warning', '⚠️ Insufficient data to create split');
      }
    } catch (error) {
      addResult('error', `❌ Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Split Functionality Tester</h2>

      <button
        onClick={runTest}
        disabled={loading}
        className="mb-6 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? 'Running Tests...' : 'Run Split Tests'}
      </button>

      <div className="space-y-3">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              result.type === 'success'
                ? 'bg-green-500/20 border border-green-500/50'
                : result.type === 'error'
                  ? 'bg-red-500/20 border border-red-500/50'
                  : result.type === 'warning'
                    ? 'bg-yellow-500/20 border border-yellow-500/50'
                    : 'bg-blue-500/20 border border-blue-500/50'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-white">{result.message}</span>
              <span className="text-slate-400 text-sm">{result.timestamp}</span>
            </div>
            {result.data && (
              <details className="mt-2">
                <summary className="text-slate-300 cursor-pointer">View Data</summary>
                <pre className="mt-2 p-2 bg-slate-900/50 rounded text-xs text-slate-300 overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SplitTester;
