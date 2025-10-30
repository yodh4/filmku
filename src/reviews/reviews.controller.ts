import { 
  Controller,
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  UseGuards, 
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, ReviewResponseDto, ReviewsListResponseDto } from './reviews.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('movies/:id/reviews')
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Param('id', ParseIntPipe) movieId: number,
    @Body() createReviewDto: CreateReviewDto,
    @Request() req,
  ): Promise<ReviewResponseDto> {
    const userId = req.user.userId;
    return this.reviewsService.create(movieId, userId, createReviewDto);
  }

  @Get('movies/:id/reviews')
  async getMovieReviews(
    @Param('id', ParseIntPipe) movieId: number,
  ): Promise<ReviewsListResponseDto> {
    const { reviews, total } = await this.reviewsService.findByMovieId(movieId);

    return {
      reviews,
      metadata: { total },
    };
  }

  @Patch('reviews/:id')
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req,
  ): Promise<ReviewResponseDto> {
    const userId = req.user.userId;
    return this.reviewsService.update(id, userId, updateReviewDto);
  }

  @Delete('reviews/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<{ message: string }> {
    const userId = req.user.userId;
    await this.reviewsService.delete(id, userId);
    return { message: 'Review deleted successfully' };
  }
}