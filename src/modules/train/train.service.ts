import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Train } from './train.entity';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train)
    private readonly trainRepository: Repository<Train>,
  ) {}

  findAll() {
    return this.trainRepository.find({
      relations: ['departStation', 'arriveStation'],
    });
  }
}
