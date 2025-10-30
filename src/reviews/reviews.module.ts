import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.repository';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [MoviesModule],
  providers: [ReviewsService, ReviewsRepository],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}