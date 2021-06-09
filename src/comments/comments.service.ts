import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikesService } from 'src/likes/likes.service';
import { PostsService } from 'src/posts/posts.service';
import { Comment, CommentDocument } from 'src/schemes/comment.schema';
import { Like } from 'src/schemes/like.schema';
import { Post } from 'src/schemes/post.schema';
import { CreateCommentDto } from 'src/types/classes/comments/create-comment.dto';
import { CreateLikeDto } from 'src/types/classes/likes/create-like.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name)
        private readonly commentsModel: Model<CommentDocument>,
        @Inject(forwardRef(() => PostsService))
        private readonly postsService: PostsService,
        private readonly usersService: UsersService,
        private readonly likesService: LikesService
    ) {}

    findAllPostComments(
        post: Post
    ): Promise<Comment[]> {
        return this.commentsModel.find({ post }).exec()
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
