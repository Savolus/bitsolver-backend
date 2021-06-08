import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';
import { Post, PostDocument } from '../schemes/post.schema';
import { CreatePostDto } from '../types/classes/posts/create-post.dto'

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private readonly postsModel: Model<PostDocument>,
        private readonly usersService: UsersService,
        private readonly categoriesService: CategoriesService,
    ) {}

    findAll(): Promise<Post[]> {
        return this.postsModel.find().exec()
    }

    async findOne(
        id: string
    ): Promise<Post> {
        const post = await this.postsModel.findById(id).exec()

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        return post
    }

    async createOne(
        userId: string,
        postDto: CreatePostDto
    ): Promise<Post> {
        const user = await this.usersService.findOneById(userId)

        const categories = await Promise.all(
            postDto.categories.map(
                category => this.categoriesService.findById(category)
            )
        )

        const post = new this.postsModel({
            ...postDto,
            user,
            categories
        })

        await post.save()

        await Promise.all(
            categories.map(
                (category: any) => this.categoriesService.updatePosts(
                    category._id,
                    post
                )
            )
        )

        return post
    }
}
