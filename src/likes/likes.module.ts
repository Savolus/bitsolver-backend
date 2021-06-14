import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'

import { Like, LikeSchema } from '../schemes/like.schema'
import { LikesService } from './likes.service'

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: Like.name,
			schema: LikeSchema
		}])
	],
	providers: [ LikesService ],
	exports: [ LikesService ]
})

export class LikesModule {}
