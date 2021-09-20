import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SeatService } from 'src/modules/seat/seat.service';

@WebSocketGateway()
export class EventGateway {
  constructor(private readonly seatService: SeatService) {}

  @SubscribeMessage('search-seat')
  handleSearchSeat(@MessageBody() data) {
    return this.seatService.findSeatByTrainCoachAndVerStructure(
      data.idTrain,
      data.idCoach,
      data.verStructure,
    );
  }
}
