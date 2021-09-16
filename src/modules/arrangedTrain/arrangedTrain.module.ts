import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArrangedTrainController } from './arrangedTrain.controller';
import { ArrangedTrain } from './arrangedTrain.entity';
import { ArrangedTrainService } from './arrangedTrain.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArrangedTrain])],
  controllers: [ArrangedTrainController],
  providers: [ArrangedTrainService],
})
export class ArrangedTrainModule {}
