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

  async CheckOverlappedRouteService(firstDep, firsrArr, secondDep, secondArr) {
    const firstDepKM = await this.findKMByID(firstDep);
    const firstArrKM = await this.findKMByID(firsrArr);
    const secondDepKM = await this.findKMByID(secondDep);
    const secondArrKM = await this.findKMByID(secondArr);

    //first direction: bac -> nam
    if (firstArrKM > firstDepKM) {
      // console.log("bac nam")
      if (firstArrKM <= secondDepKM || firstDepKM >= secondArrKM) {
        // console.log("khong trung");
        return false;
      }
      // console.log("trung")
      return true;
    }

    // second direction: nam -> bac
    if (firstArrKM < firstDepKM) {
      // console.log("nam bac")
      if (firstArrKM >= secondDepKM || firstDepKM <= secondArrKM) {
        // console.log("khong trung")
        return false;
      }
      // console.log("trung")
      return true;
    }
  }

  async findKMByID(id): Promise<number> {
    const station: Station = await this.stationRepository.findOne(id);
    return station.km;
  }
}
