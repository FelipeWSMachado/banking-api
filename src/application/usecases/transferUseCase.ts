import { InMemoryAccountRepository } from "../../infrastructure/persistence/inMemoryAccountRepository";
import { Account } from "../../domain/account";

export class TransferUseCase {
  constructor(private accountRepository: InMemoryAccountRepository) {}

  async execute(
    originId: string,
    destinationId: string,
    amount: number
  ): Promise<{ origin: Account; destination: Account } | null> {
    const origin = await this.accountRepository.findById(originId);

    if (!origin) {
      return null;
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
