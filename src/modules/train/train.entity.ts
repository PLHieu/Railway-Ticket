import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Station } from '../station/station.entity';

@Entity({ name: 'Tau', synchronize: false })
export class Train {
  @PrimaryColumn({ name: 'IDTau' })
  id: string;

  @Column({ name: 'TenTau' })
  name: string;

  @ManyToOne(() => Station)
  @JoinColumn({ name: 'IDGaXuatPhat' })
  departStation: string;

  @ManyToOne(() => Station)
  @JoinColumn({ name: 'IDGaDich' })
  arriveStation: string;

  @Column({ type: 'time', name: 'GioXuatPhat' })
  departTime: string;

  @Column({ name: 'ThoiGianDi' })
  timeTravel: number;

  @Column({ name: 'Ver' })
  ver: number;
}
