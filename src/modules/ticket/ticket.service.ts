import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { Ticket } from './ticket.entity';

export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async holdTicket(dto: CreateTicketDto) {
    const { train, coach, seat, verStructure, ...restProps } = dto;
    const ticket = await this.ticketRepository.create({
      seatPosition: { train, coach, seat, verStructure },
      ...restProps,
    });
    return this.ticketRepository.save(ticket);
  }
}
