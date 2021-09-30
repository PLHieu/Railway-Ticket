import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SeatService } from 'src/modules/seat/seat.service';
import { CreateTicketDto } from 'src/modules/ticket/dtos/create-ticket.dto';
import { TicketService } from 'src/modules/ticket/ticket.service';
import { getDateString } from 'src/shared/utils/date.utils';
import * as TicketStatus from '../shared/constants/ticket-status.constant';
import * as EventCode from '../shared/constants/event.constant';
import { UserService } from 'src/modules/user/user.service';
import * as randomstring from 'randomstring';

@WebSocketGateway()
export class EventGateway implements OnGatewayConnection {
  constructor(
    private readonly seatService: SeatService,
    private readonly ticketService: TicketService,
    private readonly userService: UserService,
  ) {}

  handleConnection(client: any) {
    client.handshake.session.holdedTicket = [];
    client.handshake.session.save();
  }

  @SubscribeMessage('search-seat')
  async handleSearchSeat(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ) {
    const seats: any = await this.seatService.SearhSeat(data);
    if (seats) {
      const holdedTickets = client.handshake.session.holdedTicket;

      for (let i = 0; i < seats.length; i++) {
        if (seats[i].status === TicketStatus.SO_HOLDING) {
          if (
            checkSeatInHoledTickets(
              holdedTickets,
              seats[i],
              data.arriveStation,
              data.leaveStation,
              data.departTime,
            )
          ) {
            seats[i].status = TicketStatus.ME_HOLDING;
          }
        }
      }

      // leave current room
      for (const roomname of client.rooms) {
        if (roomname != client.id) {
          client.leave(roomname);
        }
      }

      // add socket to room
      client.join(
        data.train +
          '-' +
          data.coach +
          '-' +
          getDateString(new Date(data.departTime)),
      );

      // return for client
      return { data: seats, code: EventCode.GET_SEAT_SUCCESSFULLY };
    }
  }

  @SubscribeMessage('hold-ticket')
  async holdTicket(
    @MessageBody() dto: CreateTicketDto,
    @ConnectedSocket() socket: any,
  ) {
    const ticket = await this.ticketService.holdTicket(dto);

    if (ticket) {
      // thong bao den cac socket dang o cung room
      socket
        .to(
          dto.train +
            '-' +
            dto.coach +
            '-' +
            getDateString(new Date(dto.departTime)),
        )
        .emit('event', {
          data: {
            seat: dto.seat,
            leaveStation: dto.leaveStation,
            arriveStation: dto.arriveStation,
          },
          code: EventCode.HOLD_SEAT_SUCCESSFULLY,
        });

      socket.handshake.session.holdedTicket.push(ticket);
      socket.handshake.session.save();

      return {
        data: {
          ticket,
        },
        code: EventCode.CREATE_TICKET_SUCCESSFULLY,
      };
    }
  }

  @SubscribeMessage('unhold-ticket')
  async unHoldTicket(@MessageBody() data, @ConnectedSocket() socket) {
    const ticket = await this.ticketService.unHoldTicket(data);
    if (ticket) {
      // thong bao den cac socket dang o cung room
      console.log('Thong bao huy ve den cac socket khac');
      socket
        .to(
          data.train +
            '-' +
            data.coach +
            '-' +
            getDateString(new Date(data.departTime)),
        )
        .emit('event', {
          data: {
            seat: data.seat,
            leaveStation: data.leaveStation,
            arriveStation: data.arriveStation,
          },
          code: EventCode.UNHOLD_SEAT_SUCCESSFULLY,
        });

      // Xoa ve khoi session
      await deleteTicketFromSession(socket.handshake.session, ticket.id);
      socket.handshake.session.save();

      return {
        data: {
          ticket,
        },
        code: EventCode.DELETE_TICKET_SUCCESSFULLY,
      };
    }
  }

  @SubscribeMessage('bought-ticket')
  async boughtTicket(@MessageBody() { userInfo }, @ConnectedSocket() socket) {
    // console.log(userInfo);
    const newUser = await this.userService.createUser(userInfo.name);
    const codeCart = randomstring.generate(6);
    await this.ticketService.boughtTickets(
      socket.handshake.session.holdedTicket.map((ticket) => ticket.id),
      newUser.id,
      codeCart,
    );

    // announce to room: BOUGHT
    socket.handshake.session.holdedTicket.forEach((ticket) => {
      socket
        .to(
          `${ticket.seatPosition.train}-${
            ticket.seatPosition.coach
          }-${getDateString(new Date(ticket.departTime))}`,
        )
        .emit('event', {
          data: {
            seat: ticket.seatPosition.seat,
            leaveStation: ticket.leaveStation,
            arriveStation: ticket.arriveStation,
          },
          code: EventCode.SOMEONE_BOUGHT_TICKET_SUCCESSFULLY,
        });
    });
  }
}

const checkSeatInHoledTickets = (
  holdedTickets,
  seat,
  arriveStation,
  leaveStation,
  departTime,
) => {
  for (let i = 0; i < holdedTickets.length; i++) {
    if (
      seat.seatPosition.train.toString() ===
        holdedTickets[i].seatPosition.train.toString() &&
      seat.seatPosition.coach.toString() ===
        holdedTickets[i].seatPosition.coach.toString() &&
      seat.seatPosition.seat.toString() ===
        holdedTickets[i].seatPosition.seat.toString() &&
      leaveStation.toString() === holdedTickets[i].leaveStation.toString() &&
      arriveStation.toString() === holdedTickets[i].arriveStation.toString() &&
      departTime.toString() === holdedTickets[i].departTime.toISOString()
    ) {
      return true;
    }
  }
  return false;
};

function deleteTicketFromSession(session, idTicketOrder) {
  const holdedTicket = session.holdedTicket;
  let i = 0;
  for (; i < holdedTicket.length; i++) {
    if (holdedTicket[i].idTicketOrder == idTicketOrder) {
      break;
    }
  }
  holdedTicket.splice(i, 1);
}
