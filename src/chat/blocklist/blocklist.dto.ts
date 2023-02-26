import { IsNotEmpty } from 'class-validator';

export class BlockListDto {
  owner: string;
  target: string;
}
