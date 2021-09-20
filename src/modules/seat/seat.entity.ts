import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ChoNgoi', synchronize: false })
export class Seat {
  @PrimaryColumn({ name: 'IDTau' })
  train: string;

  @PrimaryColumn({ name: 'IDToa' })
  coach: string;

  @PrimaryColumn({ name: 'IDChoNgoi' })
  seat: string;

  @Column({ name: 'IDLoaiCho' })
  type: string;

  @Column({ name: 'GiaVeCoSo' })
  price: number;

  @Column({ name: 'Ver' })
  verStructure: number;
}
