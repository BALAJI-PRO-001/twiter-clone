import { Request, Response, NextFunction } from 'express';


export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  res.status(200).json({
    success: true,
    message: 'Test: New user created successfully.'
  });
}


export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  
}


export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  
}