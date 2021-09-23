import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SeatService } from 'src/modules/seat/seat.service';
import { CreateTicketDto } from 'src/modules/ticket/dtos/create-ticket.dto';
import { TicketService } from 'src/modules/ticket/ticket.service';

@WebSocketGateway()
export class EventGateway implements OnGatewayConnection {
  constructor(
    private readonly seatService: SeatService,
    private readonly ticketService: TicketService,
  ) {}

  handleConnection(client: any) {
    client.handshake.session.holdedTicket = [];
    client.handshake.session.save();
  }

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
    @ConnectedSocket() socket: any,
  ) {
    const ticket = await this.ticketService.holdTicket(dto);
    socket.emit('event', {
      code: 1,
      data: ticket,
    });
    socket.handshake.session.holdedTicket.push(ticket);
    socket.handshake.session.save();
  }
}
