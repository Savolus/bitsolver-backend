import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CommentsModule } from '../comments/comments.module'
import { Like, LikeSchema } from '../schemes/like.schema'
import { PostsModule } from '../posts/posts.module'
import { LikesService } from './likes.service'

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: Like.name,
			schema: LikeSchema
		}]),
		forwardRef(() => PostsModule),
		forwardRef(() => CommentsModule)
	],
	providers: [ LikesService ],
	exports: [ LikesService ]
})

export class LikesModule {}
