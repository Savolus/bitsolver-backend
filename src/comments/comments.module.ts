import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '../schemes/comment.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: Comment.name,
			schema: CommentSchema
		}])
	],
	providers: [ CommentsService ],
	controllers: [ CommentsController ],
	exports: [ CommentsService ]
})

export class CommentsModule {}
