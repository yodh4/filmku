import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface Review {
  id: number;
  movie_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: Date;
}

@Injectable()
export class ReviewsRepository {
  constructor(private readonly db: DatabaseService) {}

  async findById(id: number): Promise<Review | null> {
    const query = 'SELECT * FROM reviews WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByMovieId(movieId: number, limit: number = 50, offset: number = 0): Promise<Review[]> {
    const query = `
      SELECT * FROM reviews 
      WHERE movie_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await this.db.query(query, [movieId, limit, offset]);
    return result.rows;
  }

  async findByUserId(userId: number): Promise<Review[]> {
    const query = 'SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await this.db.query(query, [userId]);
    return result.rows;
  }

  async findByUserAndMovie(userId: number, movieId: number): Promise<Review | null> {
    const query = 'SELECT * FROM reviews WHERE user_id = $1 AND movie_id = $2';
    const result = await this.db.query(query, [userId, movieId]);
    return result.rows[0] || null;
  }

  async create(movieId: number, userId: number, rating: number, comment: string): Promise<Review> {
    const query = `
      INSERT INTO reviews (movie_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await this.db.query(query, [movieId, userId, rating, comment]);
    return result.rows[0];
  }

  async update(id: number, rating?: number, comment?: string): Promise<Review | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (rating !== undefined) {
      updates.push(`rating = $${paramCount++}`);
      values.push(rating);
    }

    if (comment !== undefined) {
      updates.push(`comment = $${paramCount++}`);
      values.push(comment);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE reviews
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM reviews WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return (result?.rowCount ?? 0) > 0;
  }

  async countByMovieId(movieId: number): Promise<number> {
    const query = 'SELECT COUNT(*) FROM reviews WHERE movie_id = $1';
    const result = await this.db.query(query, [movieId]);
    return parseInt(result.rows[0].count);
  }

  async existsById(id: number): Promise<boolean> {
    const query = 'SELECT EXISTS(SELECT 1 FROM reviews WHERE id = $1)';
    const result = await this.db.query(query, [id]);
    return result.rows[0].exists;
  }
}