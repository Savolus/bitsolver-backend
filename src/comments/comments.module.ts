import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Comment, CommentSchema } from '../schemes/comment.schema'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { PostsModule } from '../posts/posts.module'
import { UsersModule } from '../users/users.module'
import { LikesModule } from '../likes/likes.module'


@Module({
	imports: [
		MongooseModule.forFeature([{
			name: Comment.name,
			schema: CommentSchema
		}]),
		forwardRef(() => PostsModule),
		forwardRef(() => LikesModule),
		forwardRef(() => UsersModule)
	],
	providers: [ CommentsService ],
	controllers: [ CommentsController ],
	exports: [ CommentsService ]
})

export class CommentsModule {}
