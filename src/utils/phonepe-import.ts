// Conversion rate: 1 USD = 83 INR (approximate)
export const INR_TO_USD = 1 / 83;

export interface ParsedTransaction {
  date: string;
  merchant: string;
  amount: number; // in INR
  type: 'DEBIT' | 'CREDIT';
}

// Category mapping based on merchant names and patterns
export const categoryMappings = {
  food: {
    keywords: ['zomato', 'hotel', 'restaurant', 'kitchen', 'biryani', 'cafe', 'eatery', 'fuchka', 'juice', 'fruits'],
    name: 'Food & Dining',
    emoji: '🍽️',
  },
  groceries: {
    keywords: ['grofers', 'blinkit', 'stores', 'variety', 'rice', 'pan stall'],
    name: 'Groceries',
    emoji: '🛒',
  },
  entertainment: {
    keywords: ['netflix', 'tataplaybinge'],
    name: 'Entertainment',
    emoji: '🎬',
  },
  technology: {
    keywords: ['aws', 'cloud', 'infotech', 'saradindu'],
    name: 'Technology',
    emoji: '💻',
  },
  transport: {
    keywords: ['irctc', 'uts'],
    name: 'Transportation',
    emoji: '🚗',
  },
  personal: {
    keywords: ['kumar', 'roy', 'das', 'paul', 'nandy', 'maiti', 'bhagat', 'danish', 'molla', 'ghosh'],
    name: 'Personal Transfers',
    emoji: '👤',
  },
  business: {
    keywords: ['golden joy', 'rishu cafe', 'workspace', 'friends food'],
    name: 'Business',
    emoji: '💼',
  },
  household: {
    keywords: ['glass store'],
    name: 'Household',
    emoji: '🏠',
  },
};
