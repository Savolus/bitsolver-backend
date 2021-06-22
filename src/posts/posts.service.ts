import {
    ConflictException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { ResponseCategoryDto } from '../types/classes/categories/response-category.dto'
import { ResponseCommentDto } from '../types/classes/comments/response-comment.dto'
import { ResponseCountPagesDto } from '../types/classes/response-count-pages.dto'
import { CreateCommentDto } from '../types/classes/comments/create-comment.dto'
import { ResponsePostDto } from '../types/classes/posts/response-post.dto'
import { PaginationQuery } from '../types/classes/pagination-query.dto'
import { CreateLikeDto } from '../types/classes/likes/create-like.dto'
import { CreatePostDto } from '../types/classes/posts/create-post.dto'
import { UpdatePostDto } from '../types/classes/posts/update-post.dto'
import { CategoriesService } from '../categories/categories.service'
import { CommentsService } from '../comments/comments.service'
import { Post, PostDocument } from '../schemes/post.schema'
import { LikesService } from '../likes/likes.service'
import { UsersService } from '../users/users.service'
import { Comment } from '../schemes/comment.schema'
import { Like } from '../schemes/like.schema'
import { User } from '../schemes/user.schema'

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private readonly postsModel: Model<PostDocument>,
        @Inject(forwardRef(() => CategoriesService))
        private readonly categoriesService: CategoriesService,
        @Inject(forwardRef(() => CommentsService))
        private readonly commentsService: CommentsService,
        @Inject(forwardRef(() => LikesService))
        private readonly likesService: LikesService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
    ) {}

    async findAll(
        query: PaginationQuery
    ): Promise<ResponsePostDto[]> {
        const queryBuilder = this.postsModel.find().sort({ createdAt: -1 }) 

        if (+query.page) {
            const toSkip = (+query.page - 1) * +query.size

            queryBuilder.skip(toSkip).limit(+query.size)
        }

        const posts = await queryBuilder.exec()

        const postsRatings = await Promise.all(
            posts.map(post => this.likesService.getPostRating(post))
        )

        return posts.map((post: any, index) => {
            const postDto = post._doc

            delete postDto.__v
            postDto.rating = postsRatings[index]

            return postDto
        }, [])
    }

    async countPages(
        query: PaginationQuery
    ): Promise<ResponseCountPagesDto> {
        const count = await this.postsModel.countDocuments().exec()
        const pages = Math.ceil(count / +query.size)

        return { pages }
    }

    findAllByUser(
        user: User
    ): Promise<Post[]> {
        return this.postsModel.find({ user }).exec()
    }

    async findOne(
        id: string
    ): Promise<ResponsePostDto> {
        const post: any = await this.postsModel.findById(id).exec()

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const postDto = post._doc

        delete postDto.__v

        postDto.rating = await this.likesService.getPostRating(post)

        return postDto
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
    ): Promise<ResponseCategoryDto[]> {
        const post = await this.findById(id)

        return Promise.all(
            post.categories.map(
                (category: any) => this.categoriesService.findOne(category._id)
            )
        )
    }

    async findByIdComments(
        id: string
    ): Promise<ResponseCommentDto[]> {
        const post = await this.findById(id)

        return this.commentsService.findAllPostComments(post)
    }

    async findByIdLikes(
        id: string
    ): Promise<Like[]> {
        const post = await this.findById(id)

        return this.likesService.findAllPostLikes(post)
    }

    async findByIdLike(
        id: string,
        userId: string
    ): Promise<Like> {
        const post = await this.findById(id)
        const user = await this.usersService.findById(userId)

        return this.likesService.findPostLike(post, user)
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
        const post = await this.findById(id)

        if (postDto.categories) {
            const categories = await this.findByIdCategories(id)

            await Promise.all(
                categories.map(
                    (category: any) => this.categoriesService.updatePostsRemoveOne(category._id, post)
                )
            )

            await Promise.all(
                postDto.categories.map(
                    (categoryId: any) => this.categoriesService.updatePostsAddOne(categoryId, post)
                )
            )

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
