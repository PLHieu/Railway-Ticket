import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { Ticket } from './ticket.entity';

export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly cartService: CartService,
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
    const newCart = await this.cartService.createCart({
      id: cart,
      price: 0,
      user,
      status: 0,
    });

    tickets.forEach(
      async (idTicket) =>
        await this.ticketRepository.update(idTicket, {
          user,
          cart: newCart,
        }),
    );
  }

  /**
   * Get all unpaid outdated ticket && un bought outdated ticket
   */
  getAllOutDatedTicket() {
    return this.ticketRepository.find({
      where: [
        {
          // un bought outdated ticket
          cart: null,
          holdingTime: Raw(
            (alias) => `date_add(${alias}, interval 30 second) < NOW()`,
          ),
        },
        {
          // unpaid outdated ticket
          cart: {
            status: 0,
          },
          holdingTime: Raw(
            (alias) => `date_add(${alias}, interval 60 second) < NOW()`,
          ),
        },
      ],
      relations: ['cart'],
    });
  }

  deleteTicket(id) {
    return this.ticketRepository.delete(id);
  }
}
