import { InjectModel } from '@nestjs/mongoose'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'

import { CommentsService } from '../comments/comments.service'
import { LikeTypeEnum } from '../types/enums/like-type.enum'
import { Like, LikeDocument } from '../schemes/like.schema'
import { PostsService } from '../posts/posts.service'
import { Comment } from '../schemes/comment.schema'
import { Post } from '../schemes/post.schema'
import { User } from '../schemes/user.schema'

@Injectable()
export class LikesService {
    constructor(
        @InjectModel(Like.name)
        private readonly likesModel: Model<LikeDocument>,
        @Inject(forwardRef(() => PostsService))
        private readonly postsService: PostsService,
        @Inject(forwardRef(() => CommentsService))
        private readonly commentsService: CommentsService,
    ) {}

    async getUserRating(
        user: User
    ): Promise<number> {
        const posts = await this.postsService.findAllByUser(user)
        const comments = await this.commentsService.findAllByUser(user)

        const postsRating = await Promise.all(
            posts.map(
                post => this.getPostRating(post)
            )
        )

        const commentsRating = await Promise.all(
            comments.map(
                comment => this.getCommentRating(comment)
            )
        )

        const sumPostsRating = postsRating.reduce(
            (sum, rating) => sum += rating,
            0
        )

        const sumCommentsRating = commentsRating.reduce(
            (sum, rating) => sum += rating,
            0
        )

        return sumPostsRating + sumCommentsRating
    }

    async getPostRating(
        post: Post
    ): Promise<number> {
        const likes = await this.likesModel.find({ post }).exec()

        return likes.reduce((rating, like) => {
            return rating += like.type === LikeTypeEnum.LIKE ? 1 : -1
        }, 0)
    }

    async getCommentRating(
        comment: Comment
    ): Promise<number> {
        const likes = await this.likesModel.find({ comment }).exec()

        return likes.reduce((rating, like) => {
            return rating += like.type === LikeTypeEnum.LIKE ? 1 : -1
        }, 0)
    }

    findAllPostLikes(
        post: Post
    ): Promise<Like[]> {
        return this.likesModel.find({ post }).exec()
    }

    async createPostLike(
        user: User,
        post: Post,
        type: LikeTypeEnum
    ): Promise<Like> {
        const tempLike = await this.likesModel.findOne({
            user, post
        }).exec()

        if (tempLike) {
            if (tempLike.type === type) {
                return this.deletePostLike(user, post)
            }
            
            return this.updatePostLike(user, post, type)
        }

        const like = new this.likesModel({ user, post, type })

        await like.save()

        return this.likesModel.findById(like._id)
    }

    updatePostLike(
        user: User,
        post: Post,
        type: LikeTypeEnum
    ): Promise<Like> {
        return this.likesModel.findOneAndUpdate(
            {
                user,
                post
            },
            {
                type
            },
            {
                new: true
            }
        ).exec()
    }

    deletePostLike(
        user: User,
        post: Post
    ): Promise<Like> {
        return this.likesModel.findOneAndDelete({
            user,
            post
        }).exec()
    }

    findAllCommentLikes(
        comment: Comment
    ): Promise<Like[]> {
        return this.likesModel.find({ comment }).exec()
    }

    async createCommentLike(
        user: User,
        comment: Comment,
        type: LikeTypeEnum
    ): Promise<Like> {
        const tempLike = await this.likesModel.findOne({
            user, comment
        }).exec()

        if (tempLike) {
            if (tempLike.type === type) {
                return this.deleteCommentLike(user, comment)
            }
            
            return this.updateCommentLike(user, comment, type)
        }

        const like = new this.likesModel({ user, comment, type })

        await like.save()

        return this.likesModel.findById(like._id)
    }

    updateCommentLike(
        user: User,
        comment: Comment,
        type: LikeTypeEnum
    ): Promise<Like> {
        return this.likesModel.findOneAndUpdate(
            {
                user,
                comment
            },
            {
                type
            },
            {
                new: true
            }
        ).exec()
    }

    deleteCommentLike(
        user: User,
        comment: Comment
    ): Promise<Like> {
        return this.likesModel.findOneAndDelete({
            user,
            comment
        }).exec()
    }

    deleteOne(
        id: string
    ): Promise<Like> {
        return this.likesModel.findByIdAndDelete(id).exec()
    }
}
