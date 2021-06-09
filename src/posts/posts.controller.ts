import { Controller, Get, Post as PostMethod , Param, Body, UseGuards, Request, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Category } from 'src/schemes/category.schema';
import { Comment } from 'src/schemes/comment.schema';
import { Like } from 'src/schemes/like.schema';
import { Post } from 'src/schemes/post.schema';
import { CreateCommentDto } from 'src/types/classes/comments/create-comment.dto';
import { FindOneParams } from 'src/types/classes/find-one-param.dto';
import { CreateLikeDto } from 'src/types/classes/likes/create-like.dto';
import { CreatePostDto } from 'src/types/classes/posts/create-post.dto';
import { UpdatePostDto } from 'src/types/classes/posts/update-post.dto';
import { IJwtUser } from 'src/types/interfaces/users/jwt-user.interface';
import { PostsService } from './posts.service';

@Controller('api/posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) {}

    @Get()
    findAll(): Promise<Post[]> {
        return this.postsService.findAll()
    }

    @Get(':id')
    findOne(
        @Param() params: FindOneParams
    ): Promise<Post> {
        return this.postsService.findById(params.id)
    }

    @Get(':id/categories')
    findAllCategories(
        @Param() params: FindOneParams
    ): Promise<Category[]> {
        return this.postsService.findByIdCategories(params.id)
    }

    @Get(':id/comments')
    findAllComments(
        @Param() params: FindOneParams
    ): Promise<Comment[]> {
        return this.postsService.findByIdComments(params.id)
    }

    @Get(':id/likes')
    findAllLikes(
        @Param() params: FindOneParams
    ): Promise<Like[]> {
        return this.postsService.findByIdLikes(params.id)
    }

    @PostMethod()
    @UseGuards(JwtAuthGuard)
    createOne(
        @Request() req,
        @Body() postDto: CreatePostDto
    ): Promise<Post> {
        const user = req.user as IJwtUser

        return this.postsService.createOne(user.sub, postDto)
    }

    @PostMethod(':id/comments')
    @UseGuards(JwtAuthGuard)
    createOneComment(
        @Request() req,
        @Param() params: FindOneParams,
        @Body() commentDto: CreateCommentDto
    ): Promise<Comment> {
        const user = req.user as IJwtUser

        return this.postsService.createOneComment(user.sub, params.id, commentDto)
    }

    @PostMethod(':id/likes')
    @UseGuards(JwtAuthGuard)
    createOneLike(
        @Request() req,
        @Param() params: FindOneParams,
        @Body() likeDto: CreateLikeDto
    ): Promise<Like> {
        const user = req.user as IJwtUser

        return this.postsService.createOneLike(user.sub, params.id, likeDto)
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    updateOne(
        @Param() params: FindOneParams,
        @Body() postDto: UpdatePostDto
    ): Promise<Post> {
        return this.postsService.updateOne(params.id, postDto)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    deleteOne(
        @Param() params: FindOneParams
    ): Promise<Post> {
        return this.postsService.deleteOne(params.id)
    }
}
