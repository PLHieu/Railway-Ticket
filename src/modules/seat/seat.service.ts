import { Injectable } from '@nestjs/common';
import { Seat } from './seat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as TicketStatus from '../../shared/constants/ticket-status.constant';
import { Ticket } from '../ticket/ticket.entity';
import { StationService } from '../station/station.service';
@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly stationService: StationService,
  ) {}

  async SearhSeat(data) {
    // co tau, toa, ver -> lay ra danh sach cho ngoi tu bang ChoNgoi
    const listSeats: any = await this.seatRepository.find({
      seatPosition: {
        train: data.train,
        coach: data.coach,
        verStructure: data.verStructure,
      },
    });

    /**  Duyet qua tat ca cho ngoi trong toa
     * --co tau, toa, chongoi, ngay di, ga di, ga den -> checkXem da cho nguoi mua hay chua
     * ----neu nhu co nguoi mua roi thi add them thuoc tinh da mua
     * ----neu nhu chua co nguoi mua / co nguoi mua roi nhung khong bi overlappe -> Empty
     */
    for (let i = 0; i < listSeats.length; i++) {
      listSeats[i].status = await this.CheckBoughtSeat({
        ...data,
        seat: listSeats[i].seat,
      });
    }

    return listSeats;
  }

  /**
   * kiem tra trang thai cua ve
   * Input la idTau, idToa, idChoNgoi, gadi, gaden, ngayXuatPhat cua Tau
   * Output la ve co 3 trang thai: Da mua, Co nguoi dang giu, Con Trong
   */
  async CheckBoughtSeat({
    train,
    coach,
    seat,
    leaveStation,
    arriveStation,
    departTime,
  }) {
    // tim kiem tat ca nhung nguoi mua ve tai seat do
    const listSeats: any = await this.ticketRepository.find({
      seatPosition: { train, coach, seat },
      departTime,
    });

    // Chua co ai mua ve tai seat nay
    if (listSeats == null || listSeats.length == 0) {
      return TicketStatus.EMPTY;
    }

    let someoneIsHolding = false;
    // Neu nhu co nguoi mua ba vi overlap route
    for (let i = 0; i < listSeats.length; i++) {
      if (
        await this.stationService.CheckOverlappedRouteService(
          listSeats[i].leaveStation,
          listSeats[i].arriveStation,
          leaveStation,
          arriveStation,
        )
      ) {
        if (listSeats[i].codeCart != null) {
          return TicketStatus.BOUGHT;
        }
        someoneIsHolding = true;
      }
    }
    if (someoneIsHolding) {
      return TicketStatus.SO_HOLDING;
    }
    return TicketStatus.EMPTY;
  }
}
