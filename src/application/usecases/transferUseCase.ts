import { SQLiteAccountRepository } from "../../infrastructure/persistence/sqliteAccountRepository";
import { Account } from "../../domain/account";

export class TransferUseCase {
  constructor(private accountRepository: SQLiteAccountRepository) {}

  async execute(
    originId: string,
    destinationId: string,
    amount: number
  ): Promise<{ origin: Account; destination: Account }> {
    const origin = await this.accountRepository.findById(originId);
    if (!origin) {
      throw new Error("Origin account not found");
    }

    let destination = await this.accountRepository.findById(destinationId);
    if (!destination) {
      destination = new Account(destinationId, 0);
    }

    origin.withdraw(amount);
    destination.deposit(amount);

    await this.accountRepository.save(origin);
    await this.accountRepository.save(destination);

    return { origin, destination };
  }
}
