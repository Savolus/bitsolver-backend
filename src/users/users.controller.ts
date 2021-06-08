import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AdminAccessGuard } from 'src/guards/admin-access.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FindOneParams } from 'src/types/classes/find-one-param.dto';
import { CreateUserDto } from 'src/types/classes/users/create-user.dto';
import { UpdateUserDto } from 'src/types/classes/users/update-user.dto';
import { IJwtUser } from 'src/types/interfaces/users/jwt-user.interface';

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
        @Param() params: FindOneParams
    ): Promise<User> {
        return this.usersService.findOneById(params.id)
    }

    @Post()
    @UseGuards(JwtAuthGuard, AdminAccessGuard)
    createOne(
        @Body() userDto: CreateUserDto
    ): Promise<User> {
        return this.usersService.createOne(userDto)
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    updateOne(
        @Request() req,
        @Body() userDto: UpdateUserDto
    ): Promise<User> {
        const user = req.user as IJwtUser

        return this.usersService.updateOne(user.sub, userDto)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminAccessGuard)
    deleteOne(
        @Param() params: FindOneParams
    ): Promise<User> {
        return this.usersService.deleteOne(params.id)
    }
}
