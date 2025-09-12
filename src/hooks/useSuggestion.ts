import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';

const categories: Array<string> = ['food', 'transport', 'education'];
const accounts: Array<string> = ['cash', 'accounts', 'cards', 'investments'];
const fusedCategories = new Fuse(categories, {
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 3, // Minimum character input set to be 3
  useExtendedSearch: true,
});
function isCategory(text: string) {
  return fusedCategories.search(text).length > 0;
}

export function useSuggestion(input: string) {
  const [suggestions, setSuggestions] = useState<Array<string>>([]);
  useEffect(() => {
    if (!input) {
      setSuggestions(['Spent']);
    }
    const endpart = input.trim().split(' ').pop();

    if (endpart?.toLowerCase().match(/spent|spend|paid|pay|bought|buy/i)) {
      // Suggested amounts
      setSuggestions(['50', '200', '300']);
    } else if (endpart && Number.isFinite(+endpart)) {
      setSuggestions(['on', 'for']);
    } else if (endpart?.toLowerCase().match(/^(?:on|for)$/i)) {
      // Suggested categories
      setSuggestions(categories);
    } else if (endpart && isCategory(endpart.toLowerCase())) {
      setSuggestions(['from']);
    } else if (endpart?.toLowerCase().match(/^from$/i)) {
      // Suggested categories
      setSuggestions(accounts);
    }
  }, [input]);
  return {
    suggestions,
  };
}
