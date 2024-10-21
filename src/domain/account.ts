export class Account {
  constructor(private id: string, private balance: number = 0) {}

  deposit(amount: number) {
    this.balance += amount;
  }

  withdraw(amount: number) {
    if (this.balance < amount) throw new Error("Insufficient funds");
    this.balance -= amount;
  }

  getBalance(): number {
    return this.balance;
  }

  getId(): string {
    return this.id;
  }
}
