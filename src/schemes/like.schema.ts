import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { LikeTypeEnum } from '../types/enums/like-type.enum'
import { Comment } from './comment.schema'
import { Post } from './post.schema'
import { User } from './user.schema'

@Schema()
export class Like {
	@Prop({
		type: 'string',
		enum: LikeTypeEnum,
		default: LikeTypeEnum.LIKE,
		required: true
	})
	type: LikeTypeEnum

    @Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	})
	user: User

	@Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    })
    post: Post

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    })
    comment: Comment
}

export type LikeDocument = Like & mongoose.Document
export const LikeSchema = SchemaFactory.createForClass(Like)
