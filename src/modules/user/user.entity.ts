import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'KhachHang', synchronize: false })
export class User {
  @PrimaryGeneratedColumn({ name: 'IDKH' })
  id: number;

  @Column({ name: 'HoTen' })
  name: string;
}
