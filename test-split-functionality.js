// Test script for Split functionality with dummy data
// Run this in browser console or as a Node.js script

const BASE_URL = 'http://localhost:8085';

// Test data
const testData = {
  profiles: [
    { name: 'Alice Johnson', email: 'alice@example.com', is_self: true },
    { name: 'Bob Smith', email: 'bob@example.com', is_self: false },
    { name: 'Charlie Brown', email: 'charlie@example.com', is_self: false },
    { name: 'Diana Prince', email: 'diana@example.com', is_self: false },
  ],
  accounts: [
    { value: 'Personal Account', balance: 5000 },
    { value: 'Credit Card', balance: 0 },
    { value: 'Savings Account', balance: 10000 },
  ],
  categories: [
    { value: 'Food & Dining', emoji: '🍽️', section: 'EXPENSE' },
    { value: 'Entertainment', emoji: '🎬', section: 'EXPENSE' },
    { value: 'Travel', emoji: '✈️', section: 'EXPENSE' },
  ],
};

class SplitTester {
  constructor() {
    this.createdProfiles = [];
    this.createdAccounts = [];
    this.createdCategories = [];
    this.createdSplits = [];
  }

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

  async setupTestData() {
    console.log('🚀 Setting up test data...');

    try {
      // Create test accounts if they don't exist
      console.log('📋 Creating test accounts...');
      const existingAccounts = await this.makeRequest(`${BASE_URL}/api/accounts/`);

      for (const accountData of testData.accounts) {
        const exists = existingAccounts.some((acc) => acc.value === accountData.value);
        if (!exists) {
          const account = await this.makeRequest(`${BASE_URL}/api/accounts/`, 'POST', accountData);
          this.createdAccounts.push(account);
          console.log(`✅ Created account: ${accountData.value}`);
        } else {
          console.log(`⚪ Account already exists: ${accountData.value}`);
        }
      }

      // Create test categories if they don't exist
      console.log('📂 Creating test categories...');
      const existingCategories = await this.makeRequest(`${BASE_URL}/api/categories/?section=EXPENSE`);

      for (const categoryData of testData.categories) {
        const exists = existingCategories.some((cat) => cat.value === categoryData.value);
        if (!exists) {
          const category = await this.makeRequest(`${BASE_URL}/api/categories/?section=EXPENSE`, 'POST', categoryData);
          this.createdCategories.push(category);
          console.log(`✅ Created category: ${categoryData.value}`);
        } else {
          console.log(`⚪ Category already exists: ${categoryData.value}`);
        }
      }

      // Create test profiles if they don't exist
      console.log('👥 Creating test profiles...');
      const existingProfiles = await this.makeRequest(`${BASE_URL}/api/profiles/`);

      for (const profileData of testData.profiles) {
        const exists = existingProfiles.some((profile) => profile.name === profileData.name);
        if (!exists) {
          const profile = await this.makeRequest(`${BASE_URL}/api/profiles/`, 'POST', profileData);
          this.createdProfiles.push(profile);
          console.log(`✅ Created profile: ${profileData.name}`);
        } else {
          console.log(`⚪ Profile already exists: ${profileData.name}`);
        }
      }

      console.log('✨ Test data setup complete!');
      return true;
    } catch (error) {
      console.error('❌ Failed to setup test data:', error);
      return false;
    }
  }

  async createTestSplit() {
    console.log('🎯 Creating test split transaction...');

    try {
      // Get current accounts, categories, and profiles
      const accounts = await this.makeRequest(`${BASE_URL}/api/accounts/`);
      const categories = await this.makeRequest(`${BASE_URL}/api/categories/?section=EXPENSE`);
      const profiles = await this.makeRequest(`${BASE_URL}/api/profiles/`);

      if (accounts.length === 0 || categories.length === 0 || profiles.length < 2) {
        throw new Error('Insufficient test data. Need at least 1 account, 1 category, and 2 profiles.');
      }

      // Create a test split with 3 participants
      const splitData = {
        name: 'Team Dinner at Pizza Place',
        total_amount: 450.75,
        date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY format
        category_id: categories[0].id,
        created_by_account_id: accounts[0].id,
        participants: [
          { profile_id: profiles[0].id },
          { profile_id: profiles[1].id },
          { profile_id: profiles.length > 2 ? profiles[2].id : profiles[1].id },
        ],
        note: 'Team dinner to celebrate project completion. Pizza, drinks, and dessert included.',
      };

      console.log('📝 Split data:', splitData);

      const result = await this.makeRequest(`${BASE_URL}/api/splits/`, 'POST', splitData);

      console.log('✅ Split transaction created successfully!');
      console.log('📊 Result:', result);

      this.createdSplits.push(result.split_transaction_id);
      return result;
    } catch (error) {
      console.error('❌ Failed to create split transaction:', error);
      return null;
    }
  }

  async testSplitRetrieval() {
    console.log('📖 Testing split retrieval...');

    try {
      const splits = await this.makeRequest(`${BASE_URL}/api/splits/`);
      console.log(`✅ Retrieved ${splits.length} split transactions`);

      if (splits.length > 0) {
        const latestSplit = splits[0];
        console.log('📋 Latest split details:');
        console.log(`   Name: ${latestSplit.name}`);
        console.log(`   Amount: ₹${latestSplit.total_amount}`);
        console.log(`   Date: ${latestSplit.date}`);
        console.log(`   Participants: ${latestSplit.participants.length}`);
        console.log(`   Settled: ${latestSplit.is_settled ? 'Yes' : 'No'}`);
        console.log(`   Pending: ₹${latestSplit.total_pending}`);

        console.log('👥 Participants:');
        latestSplit.participants.forEach((participant, index) => {
          console.log(
            `   ${index + 1}. ${participant.profile.name} - ₹${participant.share_amount.toFixed(2)} (${participant.is_paid ? 'Paid' : 'Pending'})`
          );
        });

        return latestSplit;
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to retrieve splits:', error);
      return null;
    }
  }

  async testPaymentStatusUpdate(split) {
    console.log('💳 Testing payment status updates...');

    if (!split || !split.participants.length) {
      console.log('❌ No split data available for payment testing');
      return false;
    }

    try {
      const participant = split.participants[0];
      console.log(`🔄 Marking ${participant.profile.name} as paid...`);

      await this.makeRequest(`${BASE_URL}/api/splits/${split.id}/participants/${participant.id}`, 'PATCH', {
        is_paid: true,
      });

      console.log('✅ Payment status updated successfully!');

      // Verify the update
      const updatedSplits = await this.makeRequest(`${BASE_URL}/api/splits/`);
      const updatedSplit = updatedSplits.find((s) => s.id === split.id);

      if (updatedSplit) {
        const updatedParticipant = updatedSplit.participants.find((p) => p.id === participant.id);
        if (updatedParticipant && updatedParticipant.is_paid) {
          console.log('✅ Payment status verified in database');
          return true;
        }
      }

      console.log('⚠️ Payment status update not reflected');
      return false;
    } catch (error) {
      console.error('❌ Failed to update payment status:', error);
      return false;
    }
  }

  async runCompleteTest() {
    console.log('🧪 Starting Complete Split Functionality Test');
    console.log('================================================');

    let success = true;

    // Step 1: Setup test data
    success = (await this.setupTestData()) && success;

    // Step 2: Create a test split
    const splitResult = await this.createTestSplit();
    success = splitResult !== null && success;

    // Step 3: Test split retrieval
    const latestSplit = await this.testSplitRetrieval();
    success = latestSplit !== null && success;

    // Step 4: Test payment status updates
    if (latestSplit) {
      const paymentTestSuccess = await this.testPaymentStatusUpdate(latestSplit);
      success = paymentTestSuccess && success;
    }

    console.log('================================================');
    if (success) {
      console.log('🎉 All tests passed! Split functionality is working correctly.');
    } else {
      console.log('❌ Some tests failed. Please check the errors above.');
    }

    return success;
  }

  async cleanup() {
    console.log('🧹 Cleaning up test data...');

    // Note: You might want to implement cleanup logic here
    // For now, we'll leave the test data as it can be useful for UI testing
    console.log('💡 Test data preserved for manual UI testing');
  }
}

// Function to run the test
async function runSplitTest() {
  const tester = new SplitTester();

  try {
    await tester.runCompleteTest();
  } catch (error) {
    console.error('🚨 Test execution failed:', error);
  }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SplitTester, runSplitTest };
} else if (typeof window !== 'undefined') {
  window.SplitTester = SplitTester;
  window.runSplitTest = runSplitTest;
}

// Auto-run if this script is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runSplitTest();
}

console.log('📋 Split Test Script Loaded');
console.log('💡 Run runSplitTest() to execute the complete test suite');
