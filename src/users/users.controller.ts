import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { ResponseUserDto } from '../types/classes/users/response-user.dto'
import { IJwtUser } from '../types/interfaces/users/jwt-user.interface'
import { PaginationQuery } from '../types/classes/pagination-query.dto'
import { CreateUserDto } from '../types/classes/users/create-user.dto'
import { UpdateUserDto } from '../types/classes/users/update-user.dto'
import { FindOneParams } from '../types/classes/find-one-param.dto'
import { AdminAccessGuard } from '../guards/admin-access.guard'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { UsersService } from './users.service'
import { User } from '../schemes/user.schema'
import { ResponseCountPagesDto } from 'src/types/classes/response-count-pages.dto'

@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get()
    findAll(
        @Query() query: PaginationQuery
    ): Promise<ResponseUserDto[]> {
        return this.usersService.findAll(query)
    }

    @Get('/pages')
    countPages(
        @Query() query: PaginationQuery
    ): Promise<ResponseCountPagesDto> {
        return this.usersService.countPages(query)
    }

    @Get(':id')
    findOne(
        @Param() params: FindOneParams
    ): Promise<ResponseUserDto> {
        return this.usersService.findOne(params.id)
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
