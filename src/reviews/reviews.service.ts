import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { ReviewsRepository, Review } from './reviews.repository';
import { CreateReviewDto, UpdateReviewDto } from './reviews.dto';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly moviesService: MoviesService,
  ) {}

  async create(movieId: number, userId: number, createReviewDto: CreateReviewDto): Promise<Review> {
    await this.moviesService.findById(movieId);

    const existingReview = await this.reviewsRepository.findByUserAndMovie(userId, movieId);
    if (existingReview) {
      throw new ConflictException('You have already reviewed this movie');
    }

    return this.reviewsRepository.create(
      movieId,
      userId,
      createReviewDto.rating,
      createReviewDto.comment,
    );
  }

  async findByMovieId(movieId: number): Promise<{ reviews: Review[]; total: number }> {
    await this.moviesService.findById(movieId);

    const reviews = await this.reviewsRepository.findByMovieId(movieId);
    const total = await this.reviewsRepository.countByMovieId(movieId);

    return { reviews, total };
  }

  async findById(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findById(id);
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async update(id: number, userId: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findById(id);

    if (review.user_id !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updatedReview = await this.reviewsRepository.update(
      id,
      updateReviewDto.rating,
      updateReviewDto.comment,
    );

    if (!updatedReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return updatedReview;
  }

  async delete(id: number, userId: number): Promise<void> {
    const review = await this.findById(id);

    if (review.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const deleted = await this.reviewsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }
}