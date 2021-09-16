import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Station } from '../station/station.entity';
import { Train } from '../train/train.entity';

@Entity({ name: 'PhanCongTau', synchronize: false })
export class ArrangedTrain {
  @PrimaryColumn({ name: 'IDTau' })
  @ManyToOne(() => Train)
  @JoinColumn({ name: 'IDTau' })
  train: Train;

  @PrimaryColumn({ name: 'IDGa' })
  @ManyToOne(() => Station)
  @JoinColumn({ name: 'IDGa' })
  station: Station;

  @PrimaryColumn({ type: 'datetime', name: 'GioXuatPhat' })
  departTime: Date;

  @Column({ type: 'datetime', name: 'GioCapGa' })
  arriveTime: Date;

  @Column({ type: 'datetime', name: 'GioRoiGa' })
  leaveTime: Date;

  @Column({ name: 'Ver' })
  verStructure: number;
}
