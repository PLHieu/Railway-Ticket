import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { SeatService } from 'src/modules/seat/seat.service';
import { CreateTicketDto } from 'src/modules/ticket/dtos/create-ticket.dto';
import { TicketService } from 'src/modules/ticket/ticket.service';

@WebSocketGateway()
export class EventGateway {
  constructor(
    private readonly seatService: SeatService,
    private readonly ticketService: TicketService,
  ) {}

  @SubscribeMessage('search-seat')
  handleSearchSeat(@MessageBody() data) {
    return this.seatService.findSeatByTrainCoachAndVerStructure(
      data.idTrain,
      data.idCoach,
      data.verStructure,
    );
  }

  @SubscribeMessage('hold-ticket')
  async holdTicket(
    @MessageBody() dto: CreateTicketDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const ticket = await this.ticketService.holdTicket(dto);
    socket.emit('event', {
      code: 1,
      data: ticket,
    });
  }
}
