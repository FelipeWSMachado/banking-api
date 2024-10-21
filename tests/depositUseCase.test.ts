import { InMemoryAccountRepository } from "../src/infrastructure/persistence/inMemoryAccountRepository";
import { DepositUseCase } from "../src/application/usecases/depositUseCase";
import { WithdrawUseCase } from "../src/application/usecases/withdrawUseCase";
import { TransferUseCase } from "../src/application/usecases/transferUseCase";

describe("Banking transfer tests", () => {
  let accountRepository: InMemoryAccountRepository;
  let depositUseCase: DepositUseCase;
  let withdrawUseCase: WithdrawUseCase;
  let transferUseCase: TransferUseCase;

  beforeEach(() => {
    accountRepository = new InMemoryAccountRepository();
    depositUseCase = new DepositUseCase(accountRepository);
    withdrawUseCase = new WithdrawUseCase(accountRepository);
    transferUseCase = new TransferUseCase(accountRepository);
  });

  // Reset state test
  it("should reset state", async () => {
    await accountRepository.reset();
    const account = await accountRepository.findById("100");
    expect(account).toBeNull();
  });

  // Get balance for non-existing account
  it("should not reurn an account balance for non-existing account", async () => {
    const account = await accountRepository.findById("1234");
    expect(account).toBeNull();
  });

  // Create account with initial balance
  it("should create account with initial balance", async () => {
    const account = await depositUseCase.execute("100", 10);
    expect(account.getId()).toBe("100");
    expect(account.getBalance()).toBe(10);
  });

  // Deposit into existing account
  it("should deposit into existing account", async () => {
    await depositUseCase.execute("100", 10); // initial deposit
    const account = await depositUseCase.execute("100", 10); // second deposit
    expect(account.getId()).toBe("100");
    expect(account.getBalance()).toBe(20);
  });

  // Get balance for existing account
  it("should get balance for existing account", async () => {
    await depositUseCase.execute("100", 20);
    const account = await accountRepository.findById("100");
    expect(account?.getBalance()).toBe(20);
  });

  // Withdraw from non-existing account
  it("should not withdrawing from non-existing account", async () => {
    const account = await withdrawUseCase.execute("200", 10);
    expect(account).toBeNull();
  });

  // Withdraw from existing account
  it("should withdraw from existing account", async () => {
    await depositUseCase.execute("100", 20);
    const account = await withdrawUseCase.execute("100", 5);
    expect(account?.getId()).toBe("100");
    expect(account?.getBalance()).toBe(15);
  });

  // Transfer from existing account
  it("should transfer from existing account to new account", async () => {
    await depositUseCase.execute("100", 15);
    const result = await transferUseCase.execute("100", "300", 15);
    expect(result?.origin.getBalance()).toBe(0);
    expect(result?.destination.getBalance()).toBe(15);
  });

  // Transfer from non-existing account
  it("should not transferring from non-existing account", async () => {
    const result = await transferUseCase.execute("200", "300", 15);
    expect(result).toBeNull();
  });
});
