import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { PostStatusEnum } from '../types/enums/post-status.enum'
import { Category } from './category.schema'
import { User } from './user.schema'

@Schema()
export class Post {
	@Prop({
		unique: true,
		required: true
	})
	title: string

	@Prop({
		length: 4095,
		required: true
	})
	content: string

	@Prop({
		type: 'string',
		enum: PostStatusEnum,
		default: PostStatusEnum.ACTIVE
	})
	status: PostStatusEnum

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	})
	user: User

	@Prop({
        type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category'
		}],
		required: true
    })
    categories: Category[]
}

export type PostDocument = Post & mongoose.Document
export const PostSchema = SchemaFactory.createForClass(Post)
