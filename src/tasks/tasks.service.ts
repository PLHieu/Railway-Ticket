import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TicketService } from 'src/modules/ticket/ticket.service';
import { getDateString } from 'src/shared/utils/date.utils';
import * as TicketCode from '../shared/constants/event.constant';

@Injectable()
@WebSocketGateway()
export class TasksService {
  constructor(private readonly ticketService: TicketService) {}

  @WebSocketServer()
  server: Server;

  @Interval(20000)
  async handleInterval() {
    Logger.verbose('Checking outdated ticket');
    // Select all outdated ticket
    const outDatedTickets = await this.ticketService.getAllOutDatedTicket();

    outDatedTickets.forEach(async (ticket) => {
      // delete that ticket
      await this.ticketService.deleteTicket(ticket.id);
      Logger.verbose('Delete Out dated Ticket');

      //announce for room about that ticket
      this.server.sockets
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
          code: TicketCode.UNHOLD_SEAT_SUCCESSFULLY,
        });
      Logger.verbose('Announce to rooms');
    });
  }
}
