import { CreateTransaction } from '../../../types';

export interface BaseCommand {
  canHandle(command: string): boolean;
  handle(command: string): AgentResponse;
  reset(): void;
}

export type AgentResponse = {
  reply: string;
  transaction?: CreateTransaction;
  end?: boolean;
};
