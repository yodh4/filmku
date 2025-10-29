import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

export interface User {
  id: number;
  created_at: Date;
  username: string;
  email: string;
  password_hash: Buffer;
}

@Injectable()
export class UsersRepository {
    constructor (
        private readonly db: DatabaseService
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await this.db.query(query, [email]);
        return result.rows[0] || null;
    }

    async findByUsername(username: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await this.db.query(query, [username]);
        return result.rows[0] || null;
    }

    async create(username: string, email: string, passwordHash: Buffer): Promise<User> {
        const query = `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING *
        `;
        const result = await this.db.query(query, [username, email, passwordHash]);
        return result.rows[0];
    }

    async existsByEmail(email: string): Promise<boolean> {
        const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';
        const result = await this.db.query(query, [email]);
        return result.rows[0].exists;
    }

    async existsByUsername(username: string): Promise<boolean> {
        const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)';
        const result = await this.db.query(query, [username]);
        return result.rows[0].exists;
    }
}