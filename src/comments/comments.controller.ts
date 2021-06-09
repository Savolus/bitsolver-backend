import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Comment } from 'src/schemes/comment.schema';
import { Like } from 'src/schemes/like.schema';
import { CreateCommentDto } from 'src/types/classes/comments/create-comment.dto';
import { FindOneParams } from 'src/types/classes/find-one-param.dto';
import { CreateLikeDto } from 'src/types/classes/likes/create-like.dto';
import { IJwtUser } from 'src/types/interfaces/users/jwt-user.interface';
import { CommentsService } from './comments.service';

@Controller('api/comments')
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService
    ) {}

    @Get(':id')
    findOne(
        @Param() params: FindOneParams
    ): Promise<Comment> {
        return this.commentsService.findById(params.id)
    }

    @Get(':id/likes')
    findAllLikes(
        @Param() params: FindOneParams
    ): Promise<Like[]> {
        return this.commentsService.findByIdLikes(params.id)
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
