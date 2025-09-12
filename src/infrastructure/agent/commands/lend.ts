import { AgentResponse, BaseCommand } from './base';

export class LendCommand implements BaseCommand {
  regex = /(?:sent|send|lent|lend|gave|give)\s+(\d+)\s+to\s+([a-zA-Z\s]+)/i;

  canHandle(command: string): boolean {
    return Boolean(command.match(this.regex));
  }

  handle(): AgentResponse {
    // Extract amount, category and account
    return {
      reply: 'Lend command processing called',
      end: true,
    };
  }

  reset() {}
}
