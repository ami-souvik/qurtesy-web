CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer', 'lending', 'split')),
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'INR',
    category_id INTEGER,
    account_id INTEGER NOT NULL,
    transfer_account_id INTEGER, -- for transfers
    counterparty TEXT, -- for lending/borrow (person or org)
    description TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recurring_rule TEXT, -- for subscriptions, e.g. cron or RRULE
    parent_id INTEGER, -- for split transactions (link to main transaction)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
