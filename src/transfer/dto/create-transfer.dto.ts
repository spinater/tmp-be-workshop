import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class CreateTransferDto {
  @IsUUID()
  @IsNotEmpty()
  toUserId!: string;

  @IsInt()
  @Min(1)
  amount!: number;
}
