import {
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { ResponseCommentDto } from '../types/classes/comments/response-comment.dto'
import { CreateCommentDto } from '../types/classes/comments/create-comment.dto'
import { CreateLikeDto } from '../types/classes/likes/create-like.dto'
import { Comment, CommentDocument } from '../schemes/comment.schema'
import { LikesService } from '../likes/likes.service'
import { PostsService } from '../posts/posts.service'
import { UsersService } from '../users/users.service'
import { Like } from '../schemes/like.schema'
import { Post } from '../schemes/post.schema'
import { User } from '../schemes/user.schema'

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name)
        private readonly commentsModel: Model<CommentDocument>,
        @Inject(forwardRef(() => PostsService))
        private readonly postsService: PostsService,
        @Inject(forwardRef(() => LikesService))
        private readonly likesService: LikesService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) {}

    findAllByUser(
        user: User
    ): Promise<Comment[]> {
        return this.commentsModel.find({ user }).exec()
    }

    async findAllPostComments(
        post: Post
    ): Promise<ResponseCommentDto[]> {
        const comments = await this.commentsModel.find({ post }).exec()
        const commentsRating = await Promise.all(
            comments.map(comment => this.likesService.getCommentRating(comment))
        )

        return comments.map((comment: any, index) => {
            const commentDto = comment._doc

            delete commentDto.__v
            commentDto.rating = commentsRating[index]

            return commentDto
        })
    }

    async findOne(
        id: string
    ): Promise<ResponseCommentDto> {
        const comment: any = await this.commentsModel.findById(id).exec()

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        const commentDto = comment._doc

        delete commentDto.__v

        commentDto.rating = await this.likesService.getCommentRating(comment)

        return comment
    }

    async findById(
        id: string
    ): Promise<Comment> {
        const comment = await this.commentsModel.findById(id).exec()

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        return comment
    }

    async findByIdLikes(
        id: string
    ): Promise<Like[]> {
        const comment = await this.findById(id)

        return this.likesService.findAllCommentLikes(comment)
    }

    async findByIdLike(
        id: string,
        userId: string
    ): Promise<Like> {
        const comment = await this.findById(id)
        const user = await this.usersService.findById(userId)

        return this.likesService.findCommentLike(comment, user)
    }

    async createOne(
        userId: string,
        postId: string,
        commentDto: CreateCommentDto
    ): Promise<Comment> {
        const user = await this.usersService.findById(userId)
        const post = await this.postsService.findById(postId)

        const comment = new this.commentsModel({
            ...commentDto,
            user,
            post
        })

        await comment.save()

        return this.findById(comment._id)
    }

    async createOneLike(
        userId: string,
        commentId: string,
        likeDto: CreateLikeDto
    ): Promise<Like> {
        const user = await this.usersService.findById(userId)
        const comment = await this.findById(commentId)

        return this.likesService.createCommentLike(user, comment, likeDto.type)
    }

    updateOne(
        id: string,
        commentDto: CreateCommentDto
    ): Promise<Comment> {
        return this.commentsModel.findByIdAndUpdate(
            id,
            commentDto,
            {
                new: true
            }
        ).exec()
    }

    async deleteOne(
        id: string
    ): Promise<Comment> {
        const likes = await this.findByIdLikes(id)

        await Promise.all(
            likes.map(
                (like: any) => this.likesService.deleteOne(like._id)
            )
        )
        
        return this.commentsModel.findByIdAndDelete(id).exec()
    }
}
