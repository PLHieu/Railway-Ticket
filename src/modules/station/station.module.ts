import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StationService } from './station.service';
import { StationController } from './station.controller';
import { Station } from './station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Station])],
  controllers: [StationController],
  providers: [StationService],
  exports: [StationService],
})
export class StationModule {}
