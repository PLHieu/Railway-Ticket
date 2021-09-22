export class CreateTicketDto {
  train: string;
  coach: string;
  seat: string;
  verStructure: number;
  departTime: Date;
  leaveStation: string;
  arriveStation: string;
  holdingTime: Date;
}
