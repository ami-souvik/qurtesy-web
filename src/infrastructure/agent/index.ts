import { sqlite } from '../../config';
import { AgentResponse, BaseCommand, ExpenseCommand, LendCommand } from './commands';

export class CommandOrchestrator {
  private static instance: CommandOrchestrator;
  private commands: BaseCommand[] = [];
  private activeCommand: BaseCommand | null = null;

  private constructor() {
    this.registerComands();
  }

  public static getInstance(): CommandOrchestrator {
    if (!CommandOrchestrator.instance) {
      CommandOrchestrator.instance = new CommandOrchestrator();
    }
    return CommandOrchestrator.instance;
  }

  private registerComands() {
    this.registerCommand(new ExpenseCommand());
    this.registerCommand(new LendCommand());
  }

  private registerCommand(command: BaseCommand) {
    this.commands.push(command);
  }

  private resetCommands() {
    this.commands.forEach((cmd) => cmd.reset());
  }

  private processResponse(response: AgentResponse) {
    const { reply, transaction } = response;
    const txnId = transaction && sqlite.transactions.create(transaction);
    sqlite.messages.create({
      command: reply,
      is_agent: true,
      transaction_id: txnId,
      category_id: transaction?.category_id,
      account_id: transaction?.account_id,
    });
  }

  public processCommand(input: string): void {
    if (!this.activeCommand) {
      this.activeCommand = this.commands.find((cmd) => cmd.canHandle(input)) || null;
    }
    if (this.activeCommand) {
      try {
        const { reply, transaction, end } = this.activeCommand.handle(input);
        if (end) this.reset();
        this.processResponse({ reply, transaction });
      } catch (error) {
        console.log('Error occurrent: ', error);
        this.handleFallback();
      }
    } else {
      this.handleFallback();
    }
  }

  private handleFallback(): void {
    this.processResponse({
      reply: 'Sorry I did not get that, can you please repeat your request?',
    });
  }

  public reset() {
    this.activeCommand = null;
    this.resetCommands();
  }
}
