import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationModule } from '../station/station.module';
import { StationService } from '../station/station.service';
import { Ticket } from '../ticket/ticket.entity';
import { Seat } from './seat.entity';
import { SeatService } from './seat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seat]),
    TypeOrmModule.forFeature([Ticket]),
    StationModule,
  ],
  providers: [SeatService],
  exports: [SeatService],
})
export class SeatModule {}
