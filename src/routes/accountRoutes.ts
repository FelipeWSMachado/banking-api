import { Router, Request, Response } from "express";
import { InMemoryAccountRepository } from "../infrastructure/persistence/inMemoryAccountRepository"; // Alterado
import { AccountController } from "../presentation/controllers/accountController";
import { DepositUseCase } from "../application/usecases/depositUseCase";
import { TransferUseCase } from "../application/usecases/transferUseCase";
import { WithdrawUseCase } from "../application/usecases/withdrawUseCase";

// Usar o repositório em memória
const accountRepository = new InMemoryAccountRepository();
const depositUseCase = new DepositUseCase(accountRepository);
const transferUseCase = new TransferUseCase(accountRepository);
const withdrawUseCase = new WithdrawUseCase(accountRepository);
const accountController = new AccountController(
  depositUseCase,
  transferUseCase,
  withdrawUseCase
);

const router = Router();

const eventHandlers: Record<string, (req: Request, res: Response) => void> = {
  deposit: (req: Request, res: Response) => accountController.deposit(req, res),
  withdraw: (req: Request, res: Response) =>
    accountController.withdraw(req, res),
  transfer: (req: Request, res: Response) =>
    accountController.transfer(req, res),
};

router.post("/event", async (req: Request, res: Response) => {
  const { type } = req.body;

  const handler = eventHandlers[type];

  if (!handler) {
    return res.status(400).json({ message: "Invalid event type" });
  }

  await handler(req, res);
});

router.get("/balance", async (req: Request, res: Response) => {
  const accountId = req.query.account_id;

  if (!accountId) {
    return res.status(400).json({ message: "Account ID is required" });
  }

  const account = await accountRepository.findById(accountId as string);
  if (!account) {
    return res.status(404).json(0);
  }

  return res.status(200).json(account.getBalance());
});

router.post("/reset", async (req: Request, res: Response) => {
  try {
    await accountRepository.reset();
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ message: "Failed to reset accounts" });
  }
});

export const accountRoutes = router;
