import React, { useState, useRef, useEffect } from 'react';
import { User, Bot, TrendingUp, TrendingDown, Mic, SendHorizonal } from 'lucide-react';
// import { CommandOrchestrator } from '../infrastructure/agent';
import { Message } from '../types';
import { sqlite } from '../config';
import { useSuggestion } from '../hooks';
import { handler } from '../infrastructure/agent/handler';

export const Agent: React.FC = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const handleCreateMessageEvent = () => {
    setMessages(sqlite.messages.fetch());
  };
  useEffect(() => {
    textareaRef.current?.focus();
    setMessages(sqlite.messages.fetch());
    document.addEventListener('messages.create', handleCreateMessageEvent);
    return () => {
      document.removeEventListener('messages.create', handleCreateMessageEvent);
    };
  }, []);
  const [inputValue, setInputValue] = useState('');
  // const orchestrator = useRef(CommandOrchestrator.getInstance());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const processMessage = async () => {
    if (inputValue.trim()) {
      sqlite.messages.create({ command: inputValue.trim() });
      // orchestrator.current.processCommand(inputValue.trim().toLocaleLowerCase());
      const reply = await handler(inputValue.trim().toLocaleLowerCase());
      sqlite.messages.create({
        command: reply,
        is_agent: true,
      });
      setInputValue('');
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      processMessage();
    }
  };
  const TransactionCard: React.FC<{ message: Message }> = ({ message }) => (
    <div
      className={`mt-2 p-3 rounded-lg border ${
        message.transaction_type === 'expense' ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        {message.transaction_type === 'lending' ? (
          <>
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800">Lending</span>
          </>
        ) : (
          <>
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-red-800">Expense</span>
          </>
        )}
      </div>
      <div className="mt-1 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <span className="font-semibold">
            Date:{' '}
            {new Date(message.transaction_date).toLocaleTimeString([], {
              day: 'numeric',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">Amount: {message.transaction_amount}</span>
        </div>
        {message.category_name && <div className="text-gray-600">Category: {message.category_name}</div>}
        {message.account_name && <div className="text-gray-600">Account: {message.account_name}</div>}
      </div>
    </div>
  );
  const { suggestions } = useSuggestion(inputValue);
  const handleClickSuggestion = (suggestion: string) => {
    if (inputValue.endsWith(' ')) {
      setInputValue(`${inputValue}${suggestion}`);
    } else {
      setInputValue(!inputValue ? `${suggestion} ` : `${inputValue} ${suggestion} `);
    }
    textareaRef.current?.focus();
  };
  return (
    <>
      {/* Messages */}
      <div className="flex flex-1 flex-col justify-end space-y-2">
        <div className="flex gap-3 max-w-xs sm:max-w-md lg:max-w-lg flex-row items-end">
          {/* Avatar */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 text-black dark:text-white">
            <Bot className="w-4 h-4" />
          </div>

          {/* Message Content */}
          <div className="rounded-2xl px-4 py-2 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-bl-md shadow-sm">
            <p className="text-sm leading-relaxed">
              Hi! I'm your financial assistant. You can tell me about transactions like 'Sent 500 to John' or 'Spent 200
              on dinner' and I'll help track them.
            </p>
          </div>
        </div>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.is_agent ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`flex gap-3 max-w-xs sm:max-w-md lg:max-w-lg ${
                message.is_agent ? 'flex-row' : 'flex-row-reverse'
              } items-end`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.is_agent ? 'bg-white dark:bg-zinc-900 text-black dark:text-white' : 'bg-teal-700 text-white'
                }`}
              >
                {message.is_agent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.is_agent
                    ? 'bg-white dark:bg-zinc-900 text-black dark:text-white rounded-bl-md shadow-sm'
                    : 'bg-teal-700 text-white rounded-br-md'
                }`}
              >
                <p className="text-sm leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                  {message.command}
                </p>

                {/* Transaction Card */}
                {message.transaction_id && <TransactionCard message={message} />}

                <p className={`text-xs mt-2 ${message.is_agent ? 'text-gray-500' : 'text-blue-200'}`}>
                  {new Date(message.updated_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div
        className="fixed bottom-0 z-1"
        style={{
          width: 'calc(100vw - var(--spacing) * 8)',
        }}
      >
        {/* Example prompts */}
        <div className="my-2 flex flex-wrap justify-end gap-2">
          {suggestions.map((sugg) => (
            <button
              key={sugg}
              onClick={() => handleClickSuggestion(sugg)}
              className="text-xs px-2 py-1 bg-teal-700 text-white rounded-lg hover:bg-gray-200 transition-colors"
            >
              {sugg}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Try: 'Sent 500 to Sarah' or 'Spent 200 on dinner'"
              className="w-full resize-none rounded-md p-2 bg-white dark:bg-zinc-900 text-sm"
              rows={3}
            />
          </div>
          <div className="mb-2 flex flex-col gap-2">
            <button
              onClick={processMessage}
              className={`w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-teal-700`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={processMessage}
              className={`w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-teal-700`}
            >
              <SendHorizonal className="w-4.5 h-4.5 -rotate-45" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
