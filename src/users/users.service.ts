import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt'
import { CreateUserDto } from '../types/classes/users/create-user.dto';
import { RegisterUserDto } from '../types/classes/auth/register-user.dto';
import { User, UserDocument } from '../schemes/user.schema';
import { UpdateUserDto } from '../types/classes/users/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly usersModel: Model<UserDocument>
    ) {}

    findAll(): Promise<User[]> {
        return this.usersModel.find().exec()
    }

    async findOneById(
        id: string
    ): Promise<User> {
        const user = await this.usersModel.findById(id).exec()

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async findOneByLogin(
        login: string
    ): Promise<User> {
        const user = await this.usersModel.findOne({ login }).exec()

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async createOne(
        userDto: RegisterUserDto|CreateUserDto
    ): Promise<User> {
        const tempUserLogin = await this.usersModel.findOne({ login: userDto.login }).exec()

        if (tempUserLogin) {
            throw new ConflictException('User with this login already exists')
        }

        const tempUserEmail = await this.usersModel.findOne({ email: userDto.email }).exec()

        if (tempUserEmail) {
            throw new ConflictException('User with this email already exists')
        }

        const user = new this.usersModel(userDto)

        user.password = await hash(user.password, 10)

        return user.save()
    }

    async updateOne(
        id: string,
        userDto: UpdateUserDto
    ): Promise<User> {
        if (userDto.password) {
            userDto.password = await hash(userDto.password, 10)
        }

        return this.usersModel.findByIdAndUpdate(
            id,
            userDto,
            {
                new: true
            }
        )
    }

    deleteOne(
        id: string
    ): Promise<User> {
        return this.usersModel.findByIdAndDelete(id).exec()
    }
}
