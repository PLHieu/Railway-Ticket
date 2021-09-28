import { Module } from '@nestjs/common';
import { SeatModule } from 'src/modules/seat/seat.module';
import { TicketModule } from 'src/modules/ticket/ticket.module';
import { UserModule } from 'src/modules/user/user.module';
import { EventGateway } from './event.gateway';

@Module({
  imports: [SeatModule, TicketModule, UserModule],
  providers: [EventGateway],
})
export class EventModule {}
