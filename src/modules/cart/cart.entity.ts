import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ThanhToan', synchronize: false })
export class Cart {
  @PrimaryColumn({ name: 'IDGioHang' })
  id: string;

  @Column({ name: 'IDUser' })
  user: number;

  @Column({ name: 'GiaVeTong' })
  price: number;

  @Column({ name: 'TrangThai' })
  status: number;
}
