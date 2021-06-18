import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Request,
    UseGuards
} from '@nestjs/common'

import { ResponseCommentDto } from '../types/classes/comments/response-comment.dto'
import { CreateCommentDto } from '../types/classes/comments/create-comment.dto'
import { IJwtUser } from '../types/interfaces/users/jwt-user.interface'
import { CreateLikeDto } from '../types/classes/likes/create-like.dto'
import { FindOneParams } from '../types/classes/find-one-param.dto'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { CommentsService } from './comments.service'
import { Comment } from '../schemes/comment.schema'
import { Like } from '../schemes/like.schema'

@Controller('api/comments')
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService
    ) {}

    @Get(':id')
    findOne(
        @Param() params: FindOneParams
    ): Promise<ResponseCommentDto> {
        return this.commentsService.findOne(params.id)
    }

    @Get(':id/likes')
    findAllLikes(
        @Param() params: FindOneParams
    ): Promise<Like[]> {
        return this.commentsService.findByIdLikes(params.id)
    }

    @Get(':id/likes/:userId')
    findLike(
        @Param() params: FindOneParams
    ): Promise<Like> {
        return this.commentsService.findByIdLike(params.id, params.userId)
    }

    @Post(':id/likes')
    @UseGuards(JwtAuthGuard)
    createOneLike(
        @Request() req,
        @Param() params: FindOneParams,
        @Body() likeDto: CreateLikeDto
    ): Promise<Like> {
        const user = req.user as IJwtUser

        return this.commentsService.createOneLike(user.sub, params.id, likeDto)
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    updateOne(
        @Param() params: FindOneParams,
        @Body() commentDto: CreateCommentDto
    ): Promise<Comment> {
        return this.commentsService.updateOne(params.id, commentDto)
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    deleteOne(
        @Param() params: FindOneParams
    ): Promise<Comment> {
        return this.commentsService.deleteOne(params.id)
    }
}
