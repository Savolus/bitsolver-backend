import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { Post } from './post.schema'

@Schema()
export class Category {
	@Prop({
		unique: true,
		required: true
	})
	title: string

	@Prop({
		length: 1023,
		required: true
	})
	description: string

	@Prop({
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }],
        default: []
    })
    posts: Post[]
}

export type CategoryDocument = Category & mongoose.Document
export const CategorySchema = SchemaFactory.createForClass(Category)
