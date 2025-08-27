import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(userData: Partial<User>) {
    const existing = await this.usersRepo.findOne({ where: { email: userData.email } });
    if (existing) throw new UnauthorizedException('Email already registered');
    const hashed = await bcrypt.hash(userData.password, 10);
    const user = this.usersRepo.create({ ...userData, password: hashed });
    return this.usersRepo.save(user);
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return null;
    const valid = await bcrypt.compare(pass, user.password);
    if (!valid) return null;
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
