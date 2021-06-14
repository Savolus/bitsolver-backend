import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'

import { User, UserSchema } from '../schemes/user.schema'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: User.name,
			schema: UserSchema
		}])
	],
	providers: [ UsersService ],
	controllers: [ UsersController ],
	exports: [ UsersService ]
})

export class UsersModule {}
