import { TrainService } from './train.service';
import { Controller, Get } from '@nestjs/common';

@Controller('train')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @Get()
  getAll() {
    return this.trainService.findAll();
  }
}
