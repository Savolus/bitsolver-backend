import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt'

import { RegisterUserDto } from '../types/classes/auth/register-user.dto';
import { AccessTokenDto } from '../types/classes/auth/access-token.dto';
import { LoginUserDto } from '../types/classes/auth/login-user.dto';
import { UsersService } from '../users/users.service';
import { User } from '../schemes/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) {}

    registerUser(
        userDto: RegisterUserDto
    ): Promise<User> {
        return this.usersService.createOne(userDto)
    }

    async loginUser(
        userDto: LoginUserDto
    ): Promise<AccessTokenDto> {
        // type User
        const user: any = await this.usersService.findByLogin(userDto.login)
    
        if (!(await compare(userDto.password, user.password))) {
            throw new UnauthorizedException('Invalid password given')
        }

        const token = await this.jwtService.signAsync(
            {},
            {
                subject: user._id.toString(),
                expiresIn: '12h'
            }
        )

        return {
            access_token: token
        }
    }
}
