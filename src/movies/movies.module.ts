import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MoviesRepository } from './movies.repository';

@Module({
  providers: [MoviesService, MoviesRepository],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}