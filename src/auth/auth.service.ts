import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, LoginResponseDto, RegisterResponseDto } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
        const user = await this.usersService.create(registerDto);

        return {
            message: 'User registered successfully. Please login to continue.',
            user: {
                username: user.username,
                email: user.email,
            },
        };
    }

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        const user = await this.usersService.findByEmail(loginDto.email);
        
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.usersService.validatePassword(
            user,
            loginDto.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { 
            username: user.username,
            email: user.email 
        };
        const access_token = await this.jwtService.signAsync(payload);

        return {
            access_token,
            user: {
                username: user.username,
                email: user.email,
            },
        };
    }
}