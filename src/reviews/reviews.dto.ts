import { IsInt, IsString, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}

export class UpdateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsString()
  @IsNotEmpty()
  comment?: string;
}

export class ReviewResponseDto {
  id: number;
  movie_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: Date;
}

export class ReviewsListResponseDto {
  reviews: ReviewResponseDto[];
  metadata: {
    total: number;
  };
}