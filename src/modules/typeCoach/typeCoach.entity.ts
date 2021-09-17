import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'LoaiToaXe', synchronize: false })
export class TypeCoach {
  @PrimaryColumn({ name: 'IDLoaiToa' })
  id: number;

  @Column({ name: 'TenLoaiToa' })
  name: string;
}
