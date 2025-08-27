import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>
  ) {}

  async findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }
}
