import { Body, Controller, Post } from '@nestjs/common'

import { RegisterUserDto } from '../types/classes/auth/register-user.dto'
import { AccessTokenDto } from '../types/classes/auth/access-token.dto'
import { LoginUserDto } from '../types/classes/auth/login-user.dto'
import { User } from '../schemes/user.schema'
import { AuthService } from './auth.service'

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
