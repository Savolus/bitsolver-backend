import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CreateCommentDto } from '../types/classes/comments/create-comment.dto'
import { PaginationQuery } from '../types/classes/pagination-query.dto'
import { CreateLikeDto } from '../types/classes/likes/create-like.dto'
import { CreatePostDto } from '../types/classes/posts/create-post.dto'
import { UpdatePostDto } from '../types/classes/posts/update-post.dto'
import { CategoriesService } from '../categories/categories.service'
import { CommentsService } from '../comments/comments.service'
import { Post, PostDocument } from '../schemes/post.schema'
import { LikesService } from '../likes/likes.service'
import { UsersService } from '../users/users.service'
import { Category } from '../schemes/category.schema'
import { Comment } from '../schemes/comment.schema'
import { Like } from '../schemes/like.schema'

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private readonly postsModel: Model<PostDocument>,
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => CategoriesService))
        private readonly categoriesService: CategoriesService,
        @Inject(forwardRef(() => CommentsService))
        private readonly commentsService: CommentsService,
        private readonly likesService: LikesService,
    ) {}

    findAll(
        query: PaginationQuery
    ): Promise<Post[]> {
        if (query.page) {
            const toSkip = (query.page - 1) * +query.size

            return this.postsModel.find().skip(toSkip).limit(+query.size).exec()
        }

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

    async findByIdComments(
        id: string
    ): Promise<Comment[]> {
        const post = await this.findById(id)

        return this.commentsService.findAllPostComments(post)
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
        const user = await this.usersService.findById(userId)

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
                (category: any) => this.categoriesService.updatePostsAddOne(
                    category._id,
                    post
                )
            )
        )

        return this.postsModel.findById(post._id)
    }

    async createOneComment(
        userId: string,
        postId: string,
        commentDto: CreateCommentDto
    ): Promise<Comment> {
        return this.commentsService.createOne(userId, postId, commentDto)
    }

    async createOneLike(
        userId: string,
        postId: string,
        likeDto: CreateLikeDto
    ): Promise<Like> {
        const user = await this.usersService.findById(userId)
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

    async deleteOne(
        id: string
    ): Promise<Post> {
        const categories = await this.findByIdCategories(id)
        const comments = await this.findByIdComments(id)
        const likes = await this.findByIdLikes(id)
        const post = await this.findById(id)

        await Promise.all(
            categories.map(
                (category: any) => this.categoriesService.updatePostsRemoveOne(category._id, post)
            )
        )

        await Promise.all(
            comments.map(
                (comment: any) => this.commentsService.deleteOne(comment._id)
            )
        )

        await Promise.all(
            likes.map(
                (like: any) => this.likesService.deleteOne(like._id)
            )
        )

        return this.postsModel.findByIdAndDelete(id).exec()
    }
}
