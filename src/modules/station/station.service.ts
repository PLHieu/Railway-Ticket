import { Injectable } from '@nestjs/common';
import { Station } from './station.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
  ) {}

  findAll() {
    return this.stationRepository.find();
  }
}
