import { Controller, Get, Post, Req } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { StationService } from './station.service';

@Controller('station')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  @Get()
  getAll() {
    return this.stationService.findAll();
  }

  @Get('session')
  getSesion(@Req() req: any) {
    return req.session.holdedTicket;
  }

  @Post('checkoverlap')
  async checkOverLap(@MessageBody() body) {
    const {
      firstLeaveStation,
      firstArriveStation,
      secondLeaveStation,
      secondArriveStation,
    } = body;
    const result = await this.stationService.CheckOverlappedRouteService(
      firstLeaveStation,
      firstArriveStation,
      secondLeaveStation,
      secondArriveStation,
    );

    return {
      data: {
        overLapped: result,
      },
    };
  }
}
