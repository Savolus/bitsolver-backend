import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { Post } from './post.schema'
import { User } from './user.schema'

@Schema({ timestamps: true })
export class Comment {
	@Prop({
		length: 2047,
		required: true
	})
	content: string

    @Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	})
	user: User

	@Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
		required: true
    })
    post: Post
}

export type CommentDocument = Comment & mongoose.Document
export const CommentSchema = SchemaFactory.createForClass(Comment)
