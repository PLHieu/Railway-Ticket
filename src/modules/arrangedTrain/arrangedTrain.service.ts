import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArrangedTrain } from './arrangedTrain.entity';

@Injectable()
export class ArrangedTrainService {
  constructor(
    @InjectRepository(ArrangedTrain)
    private readonly arrangedTrainRepository: Repository<ArrangedTrain>,
  ) {}

  findAll() {
    return this.arrangedTrainRepository.find({
      relations: ['station', 'train'],
    });
  }

  findTrainByLeaveArriveStationAndDepartDate({
    arriveStation,
    leaveStation,
    departDate,
  }) {
    return this.arrangedTrainRepository.query(
      `select * from PhanCongTau as pc1 
      where IDGa = "${leaveStation}" and Date(GioCapGa) = "${departDate}" and exists (
        select * from PhanCongTau as pc2 
        where pc2.IDGa = "${arriveStation}" and pc2.IDTau = pc1.IDTau and pc2.GioXuatPhat = pc1.GioXuatPhat and pc2.GioCapGa > pc1.GioCapGa
      )`,
    );
  }
}
