// src/infrastructure/database/migrations/createAccountsTable.ts
import { db } from "../knex";

export async function createAccountsTable() {
  const tableExists = await db.schema.hasTable("accounts");

  if (tableExists) {
    console.log("Table 'accounts' already exists");
    return;
  }

  await db.schema.createTable("accounts", (table) => {
    table.string("id").primary();
    table.float("balance").notNullable().defaultTo(0);
  });
  console.log("Table 'accounts' created successfully");
}
