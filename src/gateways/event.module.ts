import { Module } from '@nestjs/common';
import { SeatModule } from 'src/modules/seat/seat.module';
import { EventGateway } from './event.gateway';

@Module({
  imports: [SeatModule],
  providers: [EventGateway],
})
export class EventModule {}
