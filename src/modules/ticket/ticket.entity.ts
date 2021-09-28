import { SeatPosition } from 'src/shared/class/seatPosition.class';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'DatVe', synchronize: false })
export class Ticket {
  @PrimaryGeneratedColumn({ name: 'IDDatVe' })
  id: number;

  @Column(() => SeatPosition, { prefix: false })
  seatPosition: SeatPosition;

  @Column({ name: 'IDUser' })
  user: number;

  @Column({ name: 'GiaVeTong' })
  price: number;

  @Column({ name: 'IDGaDi' })
  leaveStation: string;

  @Column({ name: 'KMGaDi' })
  kmLeaveStation: number;

  @Column({ name: 'IDGaDen' })
  arriveStation: string;

  @Column({ name: 'KMGaDen' })
  kmArriveStation: number;

  @Column({ name: 'GioDi' })
  leaveTime: Date;

  @Column({ name: 'GioDen' })
  arriveTime: Date;

  @Column({ name: 'GioKhoiHanh' })
  departTime: Date;

  @Column({ name: 'GioHang' })
  cart: string;
}
