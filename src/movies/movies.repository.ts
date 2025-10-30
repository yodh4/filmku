import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface Movie {
  id: number;
  created_at: Date;
  title: string;
  year: number;
  runtime: number;
  genres: string[];
}

@Injectable()
export class MoviesRepository {
  constructor(private readonly db: DatabaseService) {}

  async findById(id: number): Promise<Movie | null> {
    const query = 'SELECT * FROM movies WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async findAll(limit: number = 20, offset: number = 0): Promise<Movie[]> {
    const query = `
      SELECT * FROM movies 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await this.db.query(query, [limit, offset]);
    return result.rows;
  }

  async count(): Promise<number> {
    const query = 'SELECT COUNT(*) FROM movies';
    const result = await this.db.query(query);
    return parseInt(result.rows[0].count);
  }

  async existsById(id: number): Promise<boolean> {
    const query = 'SELECT EXISTS(SELECT 1 FROM movies WHERE id = $1)';
    const result = await this.db.query(query, [id]);
    return result.rows[0].exists;
  }

  async findByTitle(title: string): Promise<Movie[]> {
    const query = 'SELECT * FROM movies WHERE title ILIKE $1 ORDER BY created_at DESC';
    const result = await this.db.query(query, [`%${title}%`]);
    return result.rows;
  }

  async findByYear(year: number): Promise<Movie[]> {
    const query = 'SELECT * FROM movies WHERE year = $1 ORDER BY created_at DESC';
    const result = await this.db.query(query, [year]);
    return result.rows;
  }

  async findByGenre(genre: string): Promise<Movie[]> {
    const query = 'SELECT * FROM movies WHERE $1 = ANY(genres) ORDER BY created_at DESC';
    const result = await this.db.query(query, [genre]);
    return result.rows;
  }
}