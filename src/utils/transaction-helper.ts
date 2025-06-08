// Quick script to manually add PhonePe transactions
// This can be used in the browser console or as a utility function

const addPhonePeTransactions = async () => {
  const transactions = [
    // Food & Dining
    { merchant: 'ZOMATO', amount: 566.05, date: '22/05/2025', category: 'Food & Dining' },
    { merchant: 'Zomato Ltd', amount: 387.55, date: '22/05/2025', category: 'Food & Dining' },
    { merchant: 'Zomato Online Order', amount: 661.75, date: '20/05/2025', category: 'Food & Dining' },
    { merchant: 'Suraj Fuchka Stall', amount: 30, date: '19/05/2025', category: 'Food & Dining' },
    { merchant: 'HOTEL AQUA VILLA', amount: 40, date: '18/05/2025', category: 'Food & Dining' },
    { merchant: 'HOTEL AQUA VILLA', amount: 616, date: '18/05/2025', category: 'Food & Dining' },
    { merchant: 'FRESH JUICE AND FRUTIS CORNER', amount: 55, date: '09/05/2025', category: 'Food & Dining' },
    { merchant: 'SOVAN PAN STALL', amount: 292, date: '03/05/2025', category: 'Food & Dining' },
    { merchant: 'SABIRS HOTEL', amount: 567, date: '02/05/2025', category: 'Food & Dining' },
    { merchant: 'UTSAB KITCHEN', amount: 70, date: '01/05/2025', category: 'Food & Dining' },
    { merchant: 'UTSAB KITCHEN', amount: 260, date: '01/05/2025', category: 'Food & Dining' },
    { merchant: 'UTSAB KITCHEN', amount: 180, date: '28/04/2025', category: 'Food & Dining' },
    { merchant: 'NEW HAJI BIRYANI', amount: 260, date: '29/04/2025', category: 'Food & Dining' },
    { merchant: 'M S ALDO CAFE EATERY WORKSPACE', amount: 730, date: '24/04/2025', category: 'Food & Dining' },

    // Groceries
    { merchant: 'Blinkit', amount: 420, date: '22/05/2025', category: 'Groceries' },
    { merchant: 'Prapti Stores', amount: 32, date: '23/05/2025', category: 'Groceries' },
    { merchant: 'S S RICE', amount: 430, date: '18/05/2025', category: 'Groceries' },
    { merchant: 'MAA TARA VARIETY STORES', amount: 120, date: '18/05/2025', category: 'Groceries' },
    { merchant: 'GROFERS INDIA PRIVATE LIMITED', amount: 236, date: '18/05/2025', category: 'Groceries' },
    { merchant: 'SADHANANDA STORE', amount: 177, date: '10/05/2025', category: 'Groceries' },
    { merchant: 'GROFERS INDIA PRIVATE LIMITED', amount: 2040, date: '02/05/2025', category: 'Groceries' },

    // Technology
    { merchant: 'Saradindu Cloud', amount: 300, date: '22/05/2025', category: 'Technology' },
    { merchant: 'Saradindu Cloud', amount: 135, date: '17/05/2025', category: 'Technology' },
    { merchant: 'AWS India', amount: 4.26, date: '09/05/2025', category: 'Technology' },
    { merchant: 'Starmax Infotech Pvt Ltd', amount: 350, date: '03/05/2025', category: 'Technology' },

    // Entertainment
    { merchant: 'WWW TATAPLAYBINGE COM', amount: 249, date: '13/05/2025', category: 'Entertainment' },
    { merchant: 'NETFLIX COM', amount: 199, date: '01/05/2025', category: 'Entertainment' },

    // Transportation
    { merchant: 'IRCTC UTS', amount: 100, date: '27/04/2025', category: 'Transportation' },

    // Business
    { merchant: 'HTGFRIENDS FOOD and BEVERAGES', amount: 4931, date: '17/05/2025', category: 'Business' },
    { merchant: 'GOLDEN JOY', amount: 5070, date: '04/05/2025', category: 'Business' },
    { merchant: 'Rishu Cafe', amount: 3500, date: '03/05/2025', category: 'Business' },

    // Personal Transfers (sample of larger amounts)
    { merchant: 'TUHIN ROY', amount: 1000, date: '18/05/2025', category: 'Personal Transfers' },
    { merchant: 'Achintya Kumar Sarkar', amount: 530, date: '03/05/2025', category: 'Personal Transfers' },
    { merchant: 'Shreyas', amount: 240, date: '25/04/2025', category: 'Personal Transfers' },
  ];

  console.log(`Ready to import ${transactions.length} sample transactions`);
  console.log('Total amount: ₹' + transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2));

  return transactions;
};

// Categorized summary
const getCategorySummary = async () => {
  const transactions: {
    merchant: string;
    amount: number;
    date: string;
    category: string;
  }[] = await addPhonePeTransactions();
  const categories: {
    [key: string]: {
      count: number;
      total: number;
    };
  } = {};

  transactions.forEach((t) => {
    if (!categories[t.category]) {
      categories[t.category] = { count: 0, total: 0 };
    }
    categories[t.category].count++;
    categories[t.category].total += t.amount;
  });

  return categories;
};

export { addPhonePeTransactions, getCategorySummary };
