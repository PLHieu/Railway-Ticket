import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { TicketService } from './ticket.service';
import { CartModule } from '../cart/cart.module';
@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), CartModule],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
