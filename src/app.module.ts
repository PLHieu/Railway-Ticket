import { TrainModule } from './modules/train/train.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationModule } from './modules/station/station.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ArrangedTrainModule } from './modules/arrangedTrain/arrangedTrain.module';
import { CoachModule } from './modules/coach/coach.module';
import { EventModule } from './gateways/event.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    StationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    TrainModule,
    ArrangedTrainModule,
    CoachModule,
    EventModule,
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
