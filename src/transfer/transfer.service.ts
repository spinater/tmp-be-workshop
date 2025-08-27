import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from './transfer.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TransferService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Transfer)
    private transfersRepo: Repository<Transfer>,
    @InjectRepository(User)
    private usersRepo: Repository<User>
  ) {}

  async create(fromUserId: string, toUserId: string, amount: number) {
    if (fromUserId === toUserId) throw new BadRequestException('Cannot transfer to self');

    return this.dataSource.transaction(async (manager) => {
      const from = await manager.findOne(User, { where: { id: fromUserId } });
      const to = await manager.findOne(User, { where: { id: toUserId } });
      if (!from || !to) throw new NotFoundException('User not found');
      if (from.points < amount) throw new BadRequestException('Insufficient points');

      from.points -= amount;
      to.points += amount;

      await manager.save(from);
      await manager.save(to);

      const transfer = manager.create(Transfer, { from, to, amount });
      return manager.save(transfer);
    });
  }
}
