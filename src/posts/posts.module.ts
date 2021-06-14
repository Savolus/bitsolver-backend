import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CategoriesModule } from '../categories/categories.module'
import { CommentsModule } from '../comments/comments.module'
import { Post, PostSchema } from '../schemes/post.schema'
import { PostsController } from './posts.controller'
import { UsersModule } from '../users/users.module'
import { LikesModule } from '../likes/likes.module'
import { PostsService } from './posts.service'

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: Post.name,
			schema: PostSchema
		}]),
		forwardRef(() => CategoriesModule),
		forwardRef(() => CommentsModule),
		UsersModule,
		LikesModule
	],
	providers: [ PostsService ],
	controllers: [ PostsController ],
	exports: [ PostsService ]
})

export class PostsModule {}
