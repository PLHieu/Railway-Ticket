import { SeatPosition } from 'src/shared/class/seatPosition.class';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from '../cart/cart.entity';

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

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'GioHang' })
  cart: Cart;

  @Column({ name: 'holdingTime' })
  holdingTime: Date;
}
