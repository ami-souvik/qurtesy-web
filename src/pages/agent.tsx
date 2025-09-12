import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, TrendingUp, TrendingDown } from 'lucide-react';
import { CommandOrchestrator } from '../infrastructure/agent';
import { Message as MessageType } from '../types';
import { Message } from '../sqlite/message';
import { useSuggestion } from '../hooks';

export const Agent: React.FC = () => {
  const textareaRef = useRef(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const handleCreateMessageEvent = () => {
    setMessages(Message.get());
  };
  useEffect(() => {
    setMessages(Message.get());
    document.addEventListener('createMessage', handleCreateMessageEvent);
    return () => {
      document.removeEventListener('createMessage', handleCreateMessageEvent);
    };
  }, []);
  const [inputValue, setInputValue] = useState('');
  const orchestrator = useRef(CommandOrchestrator.getInstance());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const processMessage = () => {
    Message.create({ command: inputValue.trim() });
    orchestrator.current.processCommand(inputValue.trim().toLocaleLowerCase());
    setInputValue('');
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      processMessage();
    }
  };
  const TransactionCard: React.FC<{ message: MessageType }> = ({ message }) => (
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
    textareaRef.current.focus();
  };
  return (
    <div
      className="flex flex-col"
      style={{
        height: 'calc(100vh - var(--spacing) * 20)',
      }}
    >
      {/* Messages */}
      <div className="flex-1 space-y-2">
        <div className="flex justify-start">
          <div className="flex gap-3 max-w-xs sm:max-w-md lg:max-w-lg flex-row items-end">
            {/* Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 text-black dark:text-white">
              <Bot className="w-4 h-4" />
            </div>

            {/* Message Content */}
            <div className="rounded-2xl px-4 py-2 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-bl-md shadow-sm">
              <p className="text-sm leading-relaxed">
                Hi! I'm your financial assistant. You can tell me about transactions like 'Sent 500 to John' or 'Spent
                200 on dinner' and I'll help track them.
              </p>
            </div>
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
      <div className="w-full z-2 px-4">
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
              className="w-full resize-none rounded-md p-2 bg-white dark:bg-zinc-900 border border-gray-300 text-sm"
              rows={3}
            />
          </div>
          <button
            onClick={processMessage}
            className={`mb-2 pl-3 pt-3.5 pr-3.5 pb-3 rounded-full bg-white dark:bg-teal-700`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
