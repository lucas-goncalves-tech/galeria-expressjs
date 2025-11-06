import { UserRepository } from 'features/(user)/user.repository';
import { RegisterDTO } from './dtos/register.dto';
import { ConflictError } from 'shared/erros/conflict.error';
import { CreateUserDTO } from 'features/(user)/dtos/create-user.dto';
import { LoginDTO } from './dtos/login.dto';
import { TokensDTO } from './dtos/tokens.dto';
import { UnauthorizedError } from 'shared/erros/unauthorized.error';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  private readonly SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
  private readonly JWT_SECRET = process.env.JWT_SECRET;
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  private readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  private readonly REFRESH_TOKEN_EXPIRES_IN =
    process.env.REFRESH_TOKEN_EXPIRES_IN;
  constructor(private readonly userRepository: UserRepository) {
    if (!this.SALT_ROUNDS || isNaN(this.SALT_ROUNDS)) {
      throw new Error('SALT_ROUNDS não está definido ou é inválido');
    }
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET não está definido');
    }
    if (!this.JWT_EXPIRES_IN) {
      throw new Error('JWT_EXPIRES_IN não está definido');
    }
    if (!this.REFRESH_TOKEN_SECRET) {
      throw new Error('REFRESH_TOKEN_SECRET não está definido');
    }
    if (!this.REFRESH_TOKEN_EXPIRES_IN) {
      throw new Error('REFRESH_TOKEN_EXPIRES_IN não está definido');
    }
  }

  async register(credentials: RegisterDTO) {
    const userExists = await this.userRepository.findByEmail(credentials.email);
    if (userExists) {
      throw new ConflictError('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(
      credentials.password,
      this.SALT_ROUNDS,
    );
    const newUser: CreateUserDTO = {
      name: credentials.username,
      email: credentials.email,
      password_hash: hashedPassword,
    };
    const { id, ...safeUser } = await this.userRepository.create(newUser);
    return safeUser;
  }

  async login(credentials: LoginDTO) {
    const userExists = await this.userRepository.findByEmail(credentials.email);
    if (!userExists) {
      throw new UnauthorizedError('Email/senha inválidos');
    }
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      userExists.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError('Email/senha inválidos');
    }

    const access_token = jwt.sign(
      { sub: userExists.id, role: userExists.role },
      this.JWT_SECRET!,
      {
        expiresIn: this.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      },
    );

    const refresh_token = jwt.sign(
      { sub: userExists.id },
      this.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: this
          .REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      },
    );

    return { access_token, refresh_token };
  }

  async me(userId: string) {
    return await this.userRepository.findById(userId);
  }
}
