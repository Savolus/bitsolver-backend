import { forwardRef, Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../schemes/category.schema';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: Category.name,
			schema: CategorySchema
		}]),
		UsersModule,
	],
	providers: [
		CategoriesService
	],
	controllers: [ CategoriesController ],
	exports: [ CategoriesService ]
})

export class CategoriesModule {}
