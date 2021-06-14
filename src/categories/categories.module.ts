import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Category, CategorySchema } from '../schemes/category.schema'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { UsersModule } from '../users/users.module'
import { PostsModule } from '../posts/posts.module'

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: Category.name,
			schema: CategorySchema
		}]),
		forwardRef(() => PostsModule),
		UsersModule
	],
	providers: [
		CategoriesService
	],
	controllers: [ CategoriesController ],
	exports: [ CategoriesService ]
})

export class CategoriesModule {}
