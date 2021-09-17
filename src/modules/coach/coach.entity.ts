import { Train } from './../train/train.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TypeCoach } from '../typeCoach/typeCoach.entity';

@Entity({ name: 'ToaXe', synchronize: false })
export class Coach {
  @PrimaryColumn({ name: 'IDTau' })
  @ManyToOne(() => Train)
  @JoinColumn({ name: 'IDTau' })
  train: Train;

  @PrimaryColumn({ name: 'IDToa' })
  id: number;

  @Column({ name: 'TenToa' })
  name: string;

  @ManyToOne(() => TypeCoach)
  @JoinColumn({ name: 'IDLoaiToa' })
  @Column({ name: 'IDLoaiToa' })
  type: TypeCoach;

  @Column({ name: 'SoLuongCho' })
  numSeat: number;

  @Column({ name: 'Ver' })
  verStructure: number;
}
