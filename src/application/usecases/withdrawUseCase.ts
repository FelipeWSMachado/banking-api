import { InMemoryAccountRepository } from "../../infrastructure/persistence/inMemoryAccountRepository";
import { Account } from "../../domain/account";

export class WithdrawUseCase {
  constructor(private accountRepository: InMemoryAccountRepository) {}

  async execute(origin: string, amount: number): Promise<Account | null> {
    const account = await this.accountRepository.findById(origin);

    if (!account) {
      return null;
    }

    account.withdraw(amount);

    await this.accountRepository.save(account);

    return account;
  }
}
