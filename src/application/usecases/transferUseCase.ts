import { SQLiteAccountRepository } from "../../infrastructure/persistence/sqliteAccountRepository";
import { Account } from "../../domain/account";

export class TransferUseCase {
  constructor(private accountRepository: SQLiteAccountRepository) {}

  async execute(
    originId: string,
    destinationId: string,
    amount: number
  ): Promise<{ origin: Account; destination: Account } | null> {
    const origin = await this.accountRepository.findById(originId);
    const destination = await this.accountRepository.findById(destinationId);

    if (!origin) return null;
    if (!destination) return null;

    origin.withdraw(amount);
    destination.deposit(amount);

    await this.accountRepository.save(origin);
    await this.accountRepository.save(destination);

    return { origin, destination };
  }
}
