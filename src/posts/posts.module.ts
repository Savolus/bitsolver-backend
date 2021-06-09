import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schemes/post.schema';
import { UsersModule } from 'src/users/users.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { LikesModule } from 'src/likes/likes.module';
import { CommentsModule } from 'src/comments/comments.module';

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
