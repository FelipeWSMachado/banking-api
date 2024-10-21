import { InMemoryAccountRepository } from "../../infrastructure/persistence/inMemoryAccountRepository";
import { Account } from "../../domain/account";

export class DepositUseCase {
  constructor(private accountRepository: InMemoryAccountRepository) {}

  async execute(destination: string, amount: number): Promise<Account> {
    let account = await this.accountRepository.findById(destination);

    if (!account) {
      account = new Account(destination);
    }

    account.deposit(amount);
    await this.accountRepository.save(account);

    return account;
  }
}
