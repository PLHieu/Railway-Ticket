import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeCoach } from './typeCoach.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeCoach])],
  controllers: [],
  exports: [],
})
export class TypeCoachModule {}
