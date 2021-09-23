import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Ga', synchronize: false })
export class Station {
  @PrimaryColumn({ name: 'IDGa' })
  id: number;

  @Column({ name: 'TenGa' })
  name: string;

  @Column({ name: 'SoLuongDuongRay' })
  numTrack: number;

  @Column({ name: 'SoKM' })
  km: number;
}
