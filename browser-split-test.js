// Simple Split Test for Browser Console
// Navigate to http://localhost:5175 and open browser console, then run this script

async function testSplitInBrowser() {
  console.log('🧪 Starting Browser Split Test');

  try {
    // Test 1: Get profiles
    console.log('📋 Testing profiles API...');
    const profilesResponse = await fetch('http://localhost:8085/api/profiles/');
    const profiles = await profilesResponse.json();
    console.log('✅ Profiles retrieved:', profiles.length, 'profiles found');
    profiles.forEach((p) => console.log(`   - ${p.name} (${p.is_self ? 'Self' : 'Other'})`));

    // Test 2: Get accounts
    console.log('📋 Testing accounts API...');
    const accountsResponse = await fetch('http://localhost:8085/api/accounts/');
    const accounts = await accountsResponse.json();
    console.log('✅ Accounts retrieved:', accounts.length, 'accounts found');
    accounts.forEach((a) => console.log(`   - ${a.value}`));

    // Test 3: Get categories
    console.log('📋 Testing categories API...');
    const categoriesResponse = await fetch('http://localhost:8085/api/categories/?section=EXPENSE');
    const categories = await categoriesResponse.json();
    console.log('✅ Categories retrieved:', categories.length, 'categories found');
    categories.forEach((c) => console.log(`   - ${c.emoji} ${c.value}`));

    // Test 4: Try to create a split
    if (profiles.length >= 2 && accounts.length >= 1 && categories.length >= 1) {
      console.log('🎯 Creating test split...');

      const splitData = {
        name: 'Browser Test Split - Dinner',
        total_amount: 299.5,
        date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY format
        category_id: categories[0].id,
        created_by_account_id: accounts[0].id,
        participants: [{ profile_id: profiles[0].id }, { profile_id: profiles[1].id }],
        note: 'Test split created from browser console',
      };

      console.log('📝 Split data:', splitData);

      const createResponse = await fetch('http://localhost:8085/api/splits/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(splitData),
      });

      if (createResponse.ok) {
        const result = await createResponse.json();
        console.log('✅ Split created successfully!', result);

        // Test 5: Retrieve splits to verify
        console.log('📖 Retrieving splits to verify...');
        const splitsResponse = await fetch('http://localhost:8085/api/splits/');

        if (splitsResponse.ok) {
          const splits = await splitsResponse.json();
          console.log('✅ Splits retrieved successfully:', splits.length, 'splits found');

          if (splits.length > 0) {
            const latestSplit = splits[0];
            console.log('📋 Latest split details:');
            console.log(`   Name: ${latestSplit.name}`);
            console.log(`   Amount: ₹${latestSplit.total_amount}`);
            console.log(`   Participants: ${latestSplit.participants.length}`);

            latestSplit.participants.forEach((p, i) => {
              console.log(
                `   ${i + 1}. ${p.profile.name} - ₹${p.share_amount.toFixed(2)} (${p.is_paid ? 'Paid' : 'Pending'})`
              );
            });
          }
        } else {
          const errorText = await splitsResponse.text();
          console.error('❌ Failed to retrieve splits:', splitsResponse.status, errorText);
        }
      } else {
        const errorText = await createResponse.text();
        console.error('❌ Failed to create split:', createResponse.status, errorText);
      }
    } else {
      console.log('⚠️ Insufficient data to create split');
      console.log(`   Profiles: ${profiles.length}, Accounts: ${accounts.length}, Categories: ${categories.length}`);
    }

    console.log('🎉 Browser test completed!');
  } catch (error) {
    console.error('❌ Browser test failed:', error);
  }
}

// Auto-run the test
console.log('🔧 Split test function loaded. Running test...');
testSplitInBrowser();

// Also make it available globally
window.testSplitInBrowser = testSplitInBrowser;
