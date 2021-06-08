import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_OPTIONS, MONGO_URI } from './config/configuration';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		MongooseModule.forRoot(MONGO_URI, MONGO_OPTIONS),
		UsersModule,
		PostsModule,
		CategoriesModule,
		CommentsModule,
		LikesModule,
		AuthModule
	],
	controllers: [ ],
	providers: [ ],
})

export class AppModule {}
