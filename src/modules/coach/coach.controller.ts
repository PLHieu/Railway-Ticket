import { Controller, Get, Post, Req } from '@nestjs/common';
import { CoachService } from './coach.service';
import { Request } from 'express';

@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Get()
  getAllCoach() {
    return this.coachService.findAll();
  }

  @Post('search')
  getCoach(@Req() req: Request) {
    return this.coachService.findAllCoachByTrainAndVerStructure(req.body);
  }
}
