import { Injectable } from '@nestjs/common';
import { Seat } from './seat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  findSeatByTrainCoachAndVerStructure(
    train: string,
    coach: string,
    verStructure: number,
  ) {
    return this.seatRepository.find({
      seatPosition: {
        train: train,
        coach: coach,
        verStructure,
      },
    });
  }
}
