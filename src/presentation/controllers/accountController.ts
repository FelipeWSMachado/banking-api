// src/presentation/controllers/accountController.ts
import { Request, Response } from "express";
import { DepositUseCase } from "../../application/usecases/depositUseCase";
import { TransferUseCase } from "../../application/usecases/transferUseCase";
import { WithdrawUseCase } from "../../application/usecases/withdrawUseCase";

export class AccountController {
  constructor(
    private depositUseCase: DepositUseCase,
    private transferUseCase: TransferUseCase,
    private withdrawUseCase: WithdrawUseCase
  ) {}

  // Método de depósito
  async deposit(req: Request, res: Response) {
    const { destination, amount } = req.body;

    try {
      const account = await this.depositUseCase.execute(destination, amount);

      if (!account) {
        return res.status(404).json(0);
      }

      res.status(201).json({
        destination: { id: account.getId(), balance: account.getBalance() },
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }

  // Método de saque
  async withdraw(req: Request, res: Response) {
    const { origin, amount } = req.body;

    try {
      const account = await this.withdrawUseCase.execute(origin, amount);

      if (!account) {
        return res.status(404).json(0);
      }

      res.status(201).json({
        origin: { id: account.getId(), balance: account.getBalance() },
      });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ message: err.message });
    }
  }

  // Método de transferência
  async transfer(req: Request, res: Response) {
    const { origin, destination, amount } = req.body;

    try {
      const acc = await this.transferUseCase.execute(
        origin,
        destination,
        amount
      );

      if (!acc?.origin || !acc?.destination) {
        return res.status(404).json(0);
      }

      res.status(201).json({
        origin: {
          id: acc.origin.getId(),
          balance: acc.origin.getBalance(),
        },
        destination: {
          id: acc.destination.getId(),
          balance: acc.destination.getBalance(),
        },
      });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ message: err.message });
    }
  }
}
