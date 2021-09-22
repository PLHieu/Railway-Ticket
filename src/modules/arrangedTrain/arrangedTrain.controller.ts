import { Controller, Get, Post, Req } from '@nestjs/common';
import { ArrangedTrainService } from './arrangedTrain.service';
import { Request } from 'express';

@Controller('arrangedtrain')
export class ArrangedTrainController {
  constructor(private readonly arrangedTrainService: ArrangedTrainService) {}

  @Get()
  getAll() {
    return this.arrangedTrainService.findAll();
  }

  @Post('search')
  searchTrain(@Req() req: Request) {
    // console.log(req.body);
    return this.arrangedTrainService
      .findTrainByLeaveArriveStationAndDepartDate(req.body)
      .then((arrangedTrains) =>
        arrangedTrains.map((train) => {
          return {
            id: train.IDTau,
            verStructure: train.Ver,
            arriveTime: train.GioCapGa,
            leaveTime: train.GioRoiGa,
            departTime: train.GioXuatPhat,
            station: train.IDGa,
          };
        }),
      );
  }
}
