import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UsersRepository } from './users.repository';
import { CreateUserDto } from './users.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly userRepository: UsersRepository
    ) {}
    
    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findByUsername(username);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUsername = await this.userRepository.existsByUsername(createUserDto.username);
        if (existingUsername) {
            throw new ConflictException('Username already exists');
        }

        const existingEmail = await this.userRepository.existsByEmail(createUserDto.email);
        if (existingEmail) {
            throw new ConflictException('Email already exists');
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

        return this.userRepository.create(
            createUserDto.username,
            createUserDto.email,
            Buffer.from(passwordHash),
        );
    }

    async validatePassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password_hash.toString());
    }
}