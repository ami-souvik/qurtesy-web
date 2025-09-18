import Fuse from 'fuse.js';
import { Account as AccountType, Category as CategoryType, TransactionType } from '../../../types';
import { AgentResponse, BaseCommand } from './base';
import { sqlite } from '../../../config';

export class ExpenseCommand implements BaseCommand {
  identifiers = ['spent', 'spend', 'paid', 'pay', 'bought', 'buy', 'expend'];
  // /(?:spent|spend|paid|pay|bought|buy|expend)\s+(\d+)\s+(?:on|for)\s+([a-zA-Z\s]+)/i;
  regex = {
    command: /\b(?:spent|spend|paid|pay|bought|buy|expend)\b/i,
    // eg. Spent 500 on transport, 200 paid for food
    amount:
      /(?:\b(\d+(?:\.\d+)?)\b\s*(?:spent|spend|paid|pay|bought|buy|expend)|(?:spent|spend|paid|pay|bought|buy|expend)\s*\b(\d+(?:\.\d+)?))/i,
    category: /(?:on|for|a|an|the)\s+([a-zA-Z]+)/i,
    account: /(?:from)\s+([a-zA-Z\s]+)/,
  };
  requestContext: {
    askedFor?: 'amount' | 'category' | 'account';
    amount?: string;
    category?: string;
    account?: string;
  } = {};
  categoryFuse: Fuse<CategoryType>;
  accountFuse: Fuse<AccountType>;

  constructor() {
    this.categoryFuse = new Fuse(sqlite.categories.get(), {
      keys: [{ name: 'name', weight: 1 }],
      includeScore: true,
      threshold: 0.15,
      ignoreLocation: true,
      minMatchCharLength: 3, // Minimum character input set to be 3
      useExtendedSearch: true,
    });
    this.accountFuse = new Fuse(sqlite.accounts.get(), {
      keys: [{ name: 'name', weight: 1 }],
      includeScore: true,
      threshold: 0.15,
      ignoreLocation: true,
      minMatchCharLength: 3, // Minimum character input set to be 3
      useExtendedSearch: true,
    });
  }

  canHandle(command: string): boolean {
    return this.regex.command.test(command);
  }

  identifyCategory(category: string) {
    const result = this.categoryFuse.search(category).map(({ item }) => item);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  }

  identifyAccount(account: string) {
    const result = this.accountFuse.search(account).map(({ item }) => item);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  }

  parseCommand(command: string) {
    // Extract amount, category and account
    if (this.regex.amount.test(command)) {
      const match = command.match(this.regex.amount);
      if (match) {
        this.requestContext.amount = match[1] || match[2];
      }
    }
    if (this.regex.category.test(command)) {
      const match = command.match(this.regex.category);
      if (match) {
        this.requestContext.category = match[1];
      }
    }
    if (this.regex.account.test(command)) {
      const match = command.match(this.regex.account);
      if (match) {
        this.requestContext.account = match[1];
      }
    }
  }

  generateAgentResponse(command: string): AgentResponse {
    if (!this.requestContext.amount) {
      this.requestContext.askedFor = 'amount';
      return {
        reply: 'How much you spent?',
        end: false,
      };
    }
    if (!this.requestContext.category) {
      this.requestContext.askedFor = 'category';
      return {
        reply: 'On what?',
        end: false,
      };
    }
    if (!this.requestContext.account) {
      this.requestContext.askedFor = 'account';
      return {
        reply: 'From which account?',
        end: false,
      };
    }
    const category = this.identifyCategory(this.requestContext.category);
    const account = this.identifyAccount(this.requestContext.account);
    if (!category) {
      this.requestContext.askedFor = 'category';
      return {
        reply: 'Category not defined. Can you please specify the exact category?',
      };
    }
    if (!account) {
      this.requestContext.askedFor = 'account';
      return {
        reply: 'Account not defined. Can you please specify the exact account?',
      };
    }
    const transaction = {
      date: new Date(),
      type: TransactionType.expense,
      amount: Number(this.requestContext.amount),
      category_name: this.requestContext.category,
      category_id: category.id,
      account_name: this.requestContext.account,
      account_id: account.id,
      note: command,
    };
    this.reset();
    return {
      reply: `Processed`,
      transaction,
      end: true,
    };
  }

  handle(command: string): AgentResponse {
    if (!this.requestContext.askedFor) this.parseCommand(command);
    else {
      if (this.requestContext.askedFor === 'amount') {
        this.requestContext.amount = command;
      }
      if (this.requestContext.askedFor === 'category') {
        this.requestContext.category = command;
      }
      if (this.requestContext.askedFor === 'account') {
        this.requestContext.account = command;
      }
      delete this.requestContext['askedFor'];
    }
    return this.generateAgentResponse(command);
  }

  reset() {
    this.requestContext = {};
  }
}
