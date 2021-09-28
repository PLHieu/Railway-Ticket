import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { Ticket } from './ticket.entity';

export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async holdTicket(dto: any) {
    const {
      train,
      coach,
      seat,
      verStructure,
      leaveTime,
      departTime,
      ...restProps
    } = dto;

    const ticket = await this.ticketRepository.create({
      seatPosition: { train, coach, seat, verStructure },
      leaveTime: new Date(leaveTime),
      departTime: new Date(departTime),
      ...restProps,
    });

    try {
      const result: any = await this.ticketRepository.save(ticket);
      return result;
    } catch (error) {
      return false;
    }
  }

  async unHoldTicket(dto: CreateTicketDto) {
    const { train, coach, seat, verStructure, departTime, leaveStation } = dto;

    const ticket = await this.ticketRepository.findOne({
      seatPosition: { train, coach, seat, verStructure },
      departTime: new Date(departTime),
      leaveStation,
    });

    await this.ticketRepository.delete({
      seatPosition: { train, coach, seat, verStructure },
      departTime: new Date(departTime),
      leaveStation,
    });

    return ticket;
  }

  async boughtTickets(tickets: number[], user: number, cart: string) {
    tickets.forEach(
      async (idTicket) =>
        await this.ticketRepository.update(idTicket, {
          user,
          cart,
        }),
    );
  }
}
