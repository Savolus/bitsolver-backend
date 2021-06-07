import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schemes/post.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: Post.name,
			schema: PostSchema
		}])
	],
	providers: [ PostsService ],
	controllers: [ PostsController ],
	exports: [ PostsService ]
})

export class PostsModule {}
