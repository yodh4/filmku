export class MovieResponseDto {
  id: number;
  created_at: Date;
  title: string;
  year: number;
  runtime: number;
  genres: string[];
}

export class MoviesListResponseDto {
  movies: MovieResponseDto[];
  metadata: {
    total: number;
    page: number;
    limit: number;
  };
}