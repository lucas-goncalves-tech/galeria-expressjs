import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const credentials: RegisterDTO = req.body;

    const newUser = await this.authService.register(credentials);

    res.status(201).json(newUser);
  };

  login = async (req: Request, res: Response) => {
    const credentials: LoginDTO = req.body;

    const tokens = await this.authService.login(credentials);

    res
      .status(200)
      .cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ access_token: tokens.access_token });
  };

  me = async (req: Request, res: Response) => {
    const { sub } = req.user!;
    const user = await this.authService.me(sub);
    res.status(200).json(user);
  };
}
