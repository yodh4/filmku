import { Injectable, NotFoundException } from '@nestjs/common';
import { MoviesRepository, Movie } from './movies.repository';

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async findById(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findById(id);
    
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async findAll(page?: number, limit?: number): Promise<{ movies: Movie[]; total: number }> {
    const total = await this.moviesRepository.count();
    
    if (!page && !limit) {
      const movies = await this.moviesRepository.findAll(total, 0);
      return { movies, total };
    }

    const actualPage = page || 1;
    const actualLimit = limit || 20;
    const offset = (actualPage - 1) * actualLimit;
    
    const movies = await this.moviesRepository.findAll(actualLimit, offset);
    return { movies, total };
  }

  async getMovieCount(): Promise<number> {
    return this.moviesRepository.count();
  }
}