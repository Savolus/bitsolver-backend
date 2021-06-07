import { BadRequestException, Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { RequestUserDto } from 'src/types/classes/users/request-user.dto';
import { idRegExp } from 'src/types/constants/id-regexp';

import { User } from '../schemes/user.schema';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll()
    }

    @Get(':id')
    findOne(
        @Param('id') id: string
    ): Promise<User> {
        if (!idRegExp.test(id)) {
            throw new BadRequestException('Invalid user id')
        }

        return this.usersService.findOne(id)
    }

    @Post()
    createOne(
        @Body() userDto: RequestUserDto
    ): Promise<User> {
        return this.usersService.createOne(userDto)
    }
}
