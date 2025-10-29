export class RegisterDto {
    username: string;
    email: string;
    password: string;
}

export class LoginDto {
    email: string;
    password: string;
}

export class LoginResponseDto {
    access_token: string;
    user: {
        username: string;
        email: string;
    };
}

export class RegisterResponseDto {
    message: string;
    user: {
        username: string;
        email: string;
    };
}