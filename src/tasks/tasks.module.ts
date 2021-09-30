import { Module } from '@nestjs/common';
import { TicketModule } from 'src/modules/ticket/ticket.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [TicketModule],
  providers: [TasksService],
})
export class TasksModule {}
