import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { User, UserSchema } from '../schemes/user.schema'
import { UsersController } from './users.controller'
import { LikesModule } from '../likes/likes.module'
import { UsersService } from './users.service'

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: User.name,
			schema: UserSchema
		}]),
		forwardRef(() => LikesModule)
	],
	providers: [ UsersService ],
	controllers: [ UsersController ],
	exports: [ UsersService ]
})

export class UsersModule {}
