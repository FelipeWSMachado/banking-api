import { Account } from "../../domain/account";

export class InMemoryAccountRepository {
  private accounts: { [key: string]: Account } = {};

  async findById(id: string): Promise<Account | null> {
    const account = this.accounts[id];
    return account || null;
  }

  async save(account: Account): Promise<void> {
    this.accounts[account.getId()] = account;
  }

  async reset(): Promise<void> {
    this.accounts = {};
  }
}
