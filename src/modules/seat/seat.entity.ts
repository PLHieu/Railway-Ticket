import { SeatPosition } from 'src/shared/class/seatPosition.class';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ChoNgoi', synchronize: false })
export class Seat {
  @PrimaryColumn({ name: 'ID' })
  id: number;

  @Column(() => SeatPosition, { prefix: false })
  seatPosition: SeatPosition;

  @Column({ name: 'IDLoaiCho' })
  type: string;

  @Column({ name: 'GiaVeCoSo' })
  price: number;
}
