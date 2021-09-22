import { Module } from '@nestjs/common';
import { SeatModule } from 'src/modules/seat/seat.module';
import { TicketModule } from 'src/modules/ticket/ticket.module';
import { EventGateway } from './event.gateway';

@Module({
  imports: [SeatModule, TicketModule],
  providers: [EventGateway],
})
export class EventModule {}
