import { Controller, Get, Post as PostMethod , Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Post } from 'src/schemes/post.schema';
import { FindOneParams } from 'src/types/classes/find-one-param.dto';
import { CreatePostDto } from 'src/types/classes/posts/create-post.dto';
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
        return this.postsService.findOne(params.id)
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
}
