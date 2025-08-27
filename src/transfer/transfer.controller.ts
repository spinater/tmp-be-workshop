import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('transfer')
export class TransferController {
  constructor(private transferService: TransferService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async transfer(@Request() req: any, @Body() dto: CreateTransferDto) {
    const fromUserId = req.user.userId;
    return this.transferService.create(fromUserId, dto.toUserId, dto.amount);
  }
}
