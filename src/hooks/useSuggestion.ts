import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';
import { sqlite } from '../config';
import { Account, Category } from '../types';

export function useSuggestion(input: string) {
  const categories = sqlite.categories.get<Category>();
  const accounts = sqlite.accounts.get<Account>();
  const categoryFuse = new Fuse(sqlite.categories.get(), {
    keys: [{ name: 'name', weight: 1 }],
    includeScore: true,
    threshold: 0.15,
    ignoreLocation: true,
    minMatchCharLength: 3, // Minimum character input set to be 3
    useExtendedSearch: true,
  });
  const accountFuse = new Fuse(sqlite.accounts.get(), {
    keys: [{ name: 'name', weight: 1 }],
    includeScore: true,
    threshold: 0.15,
    ignoreLocation: true,
    minMatchCharLength: 3, // Minimum character input set to be 3
    useExtendedSearch: true,
  });
  function isCategory(text: string) {
    return categoryFuse.search(text).length > 0;
  }
  function isAccount(text: string) {
    return accountFuse.search(text).length > 0;
  }
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
      setSuggestions(categories.map(({ name }) => name));
    } else if (endpart && isCategory(endpart.toLowerCase())) {
      setSuggestions(['from']);
    } else if (endpart?.toLowerCase().match(/^from$/i)) {
      // Suggested categories
      setSuggestions(accounts.map(({ name }) => name));
    } else if (endpart && isAccount(endpart.toLowerCase())) {
      // Suggested categories
      setSuggestions([]);
    }
  }, [input]);
  return {
    suggestions,
  };
}
