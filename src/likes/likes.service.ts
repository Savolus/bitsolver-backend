import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from 'src/schemes/comment.schema';
import { Like, LikeDocument } from 'src/schemes/like.schema';
import { Post } from 'src/schemes/post.schema';
import { User } from 'src/schemes/user.schema';
import { LikeTypeEnum } from 'src/types/enums/like-type.enum';

@Injectable()
export class LikesService {
    constructor(
        @InjectModel(Like.name)
        private readonly likesModel: Model<LikeDocument>
    ) {}

    async getUserRating(
        posts: Post[],
        comments: Comment[]
    ): Promise<number> {
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

    async updatePostLike(
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

    async deletePostLike(
        user: User,
        post: Post
    ): Promise<Like> {
        return this.likesModel.findOneAndDelete({
            user,
            post
        }).exec()
    }
}
