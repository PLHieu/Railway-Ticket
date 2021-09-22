import { Column } from 'typeorm';

export class SeatPosition {
  @Column({ name: 'IDTau' })
  train: string;

  @Column({ name: 'IDToa' })
  coach: string;

  @Column({ name: 'IDChoNgoi' })
  seat: string;

  @Column({ name: 'Ver' })
  verStructure: number;

  constructor(
    train: string,
    coach: string,
    seat: string,
    verStructure: number,
  ) {
    this.train = train;
    this.coach = coach;
    this.seat = seat;
    this.verStructure = verStructure;
  }
}
