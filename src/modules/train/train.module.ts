import { TrainService } from './train.service';
import { TrainController } from './train.controller';
import { Train } from './train.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Train])],
  controllers: [TrainController],
  providers: [TrainService],
})
export class TrainModule {}
