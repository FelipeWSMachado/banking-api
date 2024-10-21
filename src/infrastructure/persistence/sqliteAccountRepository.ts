import { db } from "../database/knex";
import { Account } from "../../domain/account";
import { sanitizeId } from "../../shared/sanatize";

export class SQLiteAccountRepository {
  async findById(id: string): Promise<Account | null> {
    const sanitizedId = sanitizeId(id);

    const accountData = await db.raw(
      "SELECT * FROM accounts WHERE id =" + sanitizedId
    );

    if (accountData.length === 0) {
      return null;
    }

    return new Account(accountData[0].id, accountData[0].balance);
  }

  async save(account: Account): Promise<void> {
    const exists = await this.findById(account.getId());

    if (!exists) {
      return await db("accounts").insert({
        id: account.getId(),
        balance: account.getBalance(),
      });
    }

    return await db("accounts")
      .where({ id: account.getId() })
      .update({ balance: account.getBalance() });
  }

  async reset(): Promise<void> {
    await db("accounts").truncate();
  }
}
