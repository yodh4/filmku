import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieResponseDto, MoviesListResponseDto } from './movies.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getMovies(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<MoviesListResponseDto> {
    const parsedPage = page ? parseInt(page.toString()) : undefined;
    const parsedLimit = limit ? parseInt(limit.toString()) : undefined;
    
    const { movies, total } = await this.moviesService.findAll(parsedPage, parsedLimit);

    return {
      movies,
      metadata: {
        total,
        page: parsedPage || 1,
        limit: parsedLimit || total,
      },
    };
  }

  @Get(':id')
  async getMovie(@Param('id', ParseIntPipe) id: number): Promise<MovieResponseDto> {
    return this.moviesService.findById(id);
  }
}