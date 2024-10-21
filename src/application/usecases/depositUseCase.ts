import { SQLiteAccountRepository } from "../../infrastructure/persistence/sqliteAccountRepository";
import { Account } from "../../domain/account";

export class DepositUseCase {
  constructor(private accountRepository: SQLiteAccountRepository) {}

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
