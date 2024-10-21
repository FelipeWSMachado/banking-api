import { SQLiteAccountRepository } from "../../infrastructure/persistence/sqliteAccountRepository";
import { Account } from "../../domain/account";

export class WithdrawUseCase {
  constructor(private accountRepository: SQLiteAccountRepository) {}

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
