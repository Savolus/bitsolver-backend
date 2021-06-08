import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/schemes/user.schema';
import { RegisterUserDto } from '../types/classes/auth/register-user.dto';
import { LoginUserDto } from '../types/classes/auth/login-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AccessTokenDto } from '../types/classes/auth/access-token.dto';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    registerUser(
        @Body() userDto: RegisterUserDto
    ): Promise<User> {
        return this.authService.registerUser(userDto)
    }

    @Post('login')
    loginUser(
        @Body() userDto: LoginUserDto
    ): Promise<AccessTokenDto> {
        return this.authService.loginUser(userDto)
    }
}
