import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { LikesService } from 'src/likes/likes.service';
import { Category } from 'src/schemes/category.schema';
import { Like } from 'src/schemes/like.schema';
import { CreateLikeDto } from 'src/types/classes/likes/create-like.dto';
import { UsersService } from 'src/users/users.service';
import { Post, PostDocument } from '../schemes/post.schema';
import { CreatePostDto } from '../types/classes/posts/create-post.dto'
import { UpdatePostDto } from '../types/classes/posts/update-post.dto'

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private readonly postsModel: Model<PostDocument>,
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => CategoriesService))
        private readonly categoriesService: CategoriesService,
        private readonly likesService: LikesService,
    ) {}

    findAll(): Promise<Post[]> {
        return this.postsModel.find().exec()
    }

    async findById(
        id: string
    ): Promise<Post> {
        const post = await this.postsModel.findById(id).exec()

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        return post
    }

    async findByIdCategories(
        id: string
    ): Promise<Category[]> {
        const post = await this.findById(id)

        return Promise.all(
            post.categories.map(
                (category: any) => this.categoriesService.findById(category._id)
            )
        )
    }

    async findByIdLikes(
        id: string
    ): Promise<Like[]> {
        const post = await this.findById(id)

        return this.likesService.findAllPostLikes(post)
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

        return this.postsModel.findById(post._id)
    }

    async createOneLike(
        userId: string,
        postId: string,
        likeDto: CreateLikeDto
    ): Promise<Like> {
        const user = await this.usersService.findOneById(userId)
        const post = await this.findById(postId)

        return this.likesService.createPostLike(user, post, likeDto.type)
    }

    async updateOne(
        id: string,
        postDto: UpdatePostDto
    ): Promise<Post> {
        if (postDto.title) {
            const tempPost = await this.postsModel.findOne({
                title: postDto.title
            }).exec()

            if (tempPost) {
                throw new ConflictException('Post with this title already exists')
            }
        }
        if (postDto.categories) {
            postDto.categories = await Promise.all(
                postDto.categories.map(
                    category => this.categoriesService.findById(category)
                )
            )
        }

        return this.postsModel.findByIdAndUpdate(
            id,
            postDto as any,
            {
                new: true
            }
        ).exec()
    }

    deleteOne(
        id: string
    ): Promise<Post> {
        return this.postsModel.findByIdAndDelete(id).exec()
    }
}
