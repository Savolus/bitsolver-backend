import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
        return this.usersService.findById(params.id)
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

    // sometimes
    @Patch('avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('avatar'))
    uploadAvatar(
        @UploadedFile() file: Express.Multer.File
    ) {
        console.log(file)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminAccessGuard)
    deleteOne(
        @Param() params: FindOneParams
    ): Promise<User> {
        return this.usersService.deleteOne(params.id)
    }
}
