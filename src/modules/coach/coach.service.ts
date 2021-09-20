import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coach } from './coach.entity';

@Injectable()
export class CoachService {
  constructor(
    @InjectRepository(Coach)
    private readonly coachRepository: Repository<Coach>,
  ) {}

  findAll() {
    return this.coachRepository.find({ relations: ['train', 'type'] });
  }

  findAllCoachByTrainAndVerStructure({ id, ver }) {
    return this.coachRepository.find({
      where: {
        train: id,
        verStructure: ver,
      },
      relations: ['type'],
    });
  }
}
