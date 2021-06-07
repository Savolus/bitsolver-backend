import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestUserDto } from 'src/types/classes/users/request-user.dto';
import { User, UserDocument } from '../schemes/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly usersModel: Model<UserDocument>
    ) {}

    findAll(): Promise<User[]> {
        return this.usersModel.find().exec()
    }

    async findOne(
        id: string
    ): Promise<User> {
        const user = await this.usersModel.findById(id).exec()

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async createOne(
        userDto: RequestUserDto
    ): Promise<User> {
        return {} as User
    }
}
