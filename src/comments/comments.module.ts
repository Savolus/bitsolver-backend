import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '../schemes/comment.schema';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';
import { LikesModule } from 'src/likes/likes.module';

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: Comment.name,
			schema: CommentSchema
		}]),
		forwardRef(() => PostsModule),
		UsersModule,
		LikesModule
	],
	providers: [ CommentsService ],
	controllers: [ CommentsController ],
	exports: [ CommentsService ]
})

export class CommentsModule {}
