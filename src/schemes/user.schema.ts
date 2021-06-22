import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { UserRoleEnum } from '../types/enums/user-role.enum'
import { AWS_BUCKET_URL } from '../config/configuration'

@Schema()
export class User {
	@Prop({
		unique: true,
		required: true
	})
	login: string

	@Prop({
		unique: true,
		required: true
	})
	email: string

	@Prop({
		required: true
	})
	password: string

	@Prop({
		required: true
	})
	full_name: string

	@Prop({
		default: `${AWS_BUCKET_URL}/default.png`
	})
	avatar: string

	@Prop({
		type: 'string',
		enum: UserRoleEnum,
		default: UserRoleEnum.USER
	})
	role: UserRoleEnum
}

export type UserDocument = User & mongoose.Document
export const UserSchema = SchemaFactory.createForClass(User)
