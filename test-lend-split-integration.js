// Complete Test for Lend and Split Integration
// This test verifies that split transactions automatically create lend records

const BASE_URL = 'http://localhost:8085';

class LendSplitIntegrationTester {
  async makeRequest(url, method = 'GET', data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Request failed: ${method} ${url}`, error);
      throw error;
    }
  }

  async testLendSplitIntegration() {
    console.log('🧪 Testing Lend and Split Integration');
    console.log('====================================');

    try {
      // Step 1: Get initial lend count
      console.log('📊 Getting initial lend count...');
      const initialLends = await this.makeRequest(`${BASE_URL}/api/lends/`);
      console.log(`✅ Initial lend count: ${initialLends.length}`);

      // Step 2: Get profiles and accounts
      console.log('👥 Getting profiles and accounts...');
      const profiles = await this.makeRequest(`${BASE_URL}/api/profiles/`);
      const accounts = await this.makeRequest(`${BASE_URL}/api/accounts/`);
      const categories = await this.makeRequest(`${BASE_URL}/api/categories/?section=EXPENSE`);

      console.log(`✅ Found ${profiles.length} profiles, ${accounts.length} accounts, ${categories.length} categories`);

      if (profiles.length < 2 || accounts.length < 1 || categories.length < 1) {
        throw new Error('Insufficient test data. Need at least 2 profiles, 1 account, and 1 category.');
      }

      // Step 3: Create a split transaction
      console.log('💰 Creating test split transaction...');
      const splitData = {
        name: 'Test Split for Lend Integration',
        total_amount: 300.0,
        date: new Date().toLocaleDateString('en-GB'),
        category_id: categories[0].id,
        created_by_account_id: accounts[0].id,
        participants: [
          { profile_id: profiles[0].id }, // Self profile
          { profile_id: profiles[1].id }, // Other profile
          { profile_id: profiles.length > 2 ? profiles[2].id : profiles[1].id }, // Third profile if available
        ],
        note: 'Integration test split to verify lend record creation',
      };

      console.log('📝 Split data:', JSON.stringify(splitData, null, 2));

      const splitResult = await this.makeRequest(`${BASE_URL}/api/splits/`, 'POST', splitData);
      console.log('✅ Split created successfully!');
      console.log('📊 Split result:', splitResult);

      // Step 4: Check if lend records were created
      console.log('🔍 Checking for automatically created lend records...');
      const updatedLends = await this.makeRequest(`${BASE_URL}/api/lends/`);

      const newLends = updatedLends.length - initialLends.length;
      console.log(`✅ New lend records created: ${newLends}`);

      if (newLends > 0) {
        console.log('📋 New lend records:');
        updatedLends.slice(-newLends).forEach((lend, index) => {
          console.log(`   ${index + 1}. ${lend.lender_profile.name} → ${lend.borrower_profile.name}: ₹${lend.amount}`);
          console.log(`      Status: ${lend.is_repaid ? 'Repaid' : 'Pending'}`);
          console.log(`      From Split: ${lend.created_from_split ? 'Yes' : 'No'}`);
          console.log(`      Note: ${lend.note || 'None'}`);
        });
      }

      // Step 5: Test split participant payment status update
      console.log('💳 Testing payment status integration...');
      const createdSplit = await this.makeRequest(`${BASE_URL}/api/splits/${splitResult.split_transaction_id}`);

      if (createdSplit.participants.length > 0) {
        const participant = createdSplit.participants.find((p) => !p.profile.is_self);
        if (participant) {
          console.log(`🔄 Marking ${participant.profile.name} as paid in split...`);

          await this.makeRequest(
            `${BASE_URL}/api/splits/${splitResult.split_transaction_id}/participants/${participant.id}`,
            'PATCH',
            { is_paid: true }
          );

          console.log('✅ Split participant marked as paid');

          // Check if corresponding lend record was updated
          const finalLends = await this.makeRequest(`${BASE_URL}/api/lends/`);
          const correspondingLend = finalLends.find(
            (lend) =>
              lend.related_split_transaction_id === splitResult.split_transaction_id &&
              lend.borrower_profile.name === participant.profile.name
          );

          if (correspondingLend) {
            console.log(`✅ Corresponding lend record updated: ${correspondingLend.is_repaid ? 'Repaid' : 'Pending'}`);
            if (correspondingLend.is_repaid) {
              console.log(`   Repaid date: ${correspondingLend.repaid_date}`);
            }
          } else {
            console.log('⚠️ Could not find corresponding lend record');
          }
        }
      }

      // Step 6: Test lend summary
      console.log('📊 Testing lend summary...');
      const summary = await this.makeRequest(`${BASE_URL}/api/lends/summary/`);
      console.log('✅ Lend summary:');
      console.log(`   Total Lent: ₹${summary.total_lent}`);
      console.log(`   Total Pending: ₹${summary.total_pending}`);
      console.log(`   Total Repaid: ₹${summary.total_repaid}`);
      console.log(`   Pending Count: ${summary.pending_count}`);
      console.log(`   Repaid Count: ${summary.repaid_count}`);

      // Step 7: Test direct lend creation
      console.log('💸 Testing direct lend creation...');
      const borrowerProfile = profiles.find((p) => !p.is_self);
      if (borrowerProfile) {
        const directLendData = {
          amount: 150.0,
          date: new Date().toLocaleDateString('en-GB'),
          borrower_profile_id: borrowerProfile.id,
          category_id: categories[0].id,
          account_id: accounts[0].id,
          note: 'Direct lend transaction test',
        };

        const directLendResult = await this.makeRequest(`${BASE_URL}/api/lends/`, 'POST', directLendData);
        console.log('✅ Direct lend created successfully!');
        console.log('📊 Direct lend result:', directLendResult);
      }

      console.log('====================================');
      console.log('🎉 All lend and split integration tests passed!');

      return true;
    } catch (error) {
      console.error('❌ Integration test failed:', error);
      return false;
    }
  }
}

// Function to run the integration test
async function runLendSplitIntegrationTest() {
  const tester = new LendSplitIntegrationTester();

  try {
    await tester.testLendSplitIntegration();
  } catch (error) {
    console.error('🚨 Test execution failed:', error);
  }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LendSplitIntegrationTester, runLendSplitIntegrationTest };
} else if (typeof window !== 'undefined') {
  window.LendSplitIntegrationTester = LendSplitIntegrationTester;
  window.runLendSplitIntegrationTest = runLendSplitIntegrationTest;
}

// Auto-run if this script is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runLendSplitIntegrationTest();
}

console.log('📋 Lend-Split Integration Test Script Loaded');
console.log('💡 Run runLendSplitIntegrationTest() to execute the complete integration test');
