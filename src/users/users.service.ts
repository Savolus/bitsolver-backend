import {
    ConflictException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { hash } from 'bcrypt'

import { ResponseCountPagesDto } from '../types/classes/response-count-pages.dto'
import { ResponseUserDto } from '../types/classes/users/response-user.dto'
import { RegisterUserDto } from '../types/classes/auth/register-user.dto'
import { PaginationQuery } from '../types/classes/pagination-query.dto'
import { CreateUserDto } from '../types/classes/users/create-user.dto'
import { UpdateUserDto } from '../types/classes/users/update-user.dto'
import { CommentsService } from '../comments/comments.service'
import { User, UserDocument } from '../schemes/user.schema'
import { AWS_BUCKET, s3 } from '../config/configuration'
import { LikesService } from '../likes/likes.service'
import { PostsService } from '../posts/posts.service'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly usersModel: Model<UserDocument>,
        @Inject(forwardRef(() => PostsService))
        private readonly postsService: PostsService,
        @Inject(forwardRef(() => CommentsService))
        private readonly commentsService: CommentsService,
        @Inject(forwardRef(() => LikesService))
        private readonly likesService: LikesService
    ) {}

    async findAll(
        query: PaginationQuery
    ): Promise<ResponseUserDto[]> {
        const queryBuilder = this.usersModel.find({}, '_id login full_name email avatar').sort({ login: 1 })
        
        if (+query.page) {
            const toSkip = (+query.page - 1) * +query.size

            queryBuilder.skip(toSkip).limit(+query.size)
        }

        const users = await queryBuilder.exec()

        const usersRatings = await Promise.all(
            users.map(user => this.likesService.getUserRating(user))
        )

        return users.map((user: any, index) => {
            const userDto = user._doc

            userDto.rating = usersRatings[index]

            return userDto
        }, [])
    }

    async countPages(
        query: PaginationQuery
    ): Promise<ResponseCountPagesDto> {
        const count = await this.usersModel.countDocuments().exec()
        const pages = Math.ceil(count / +query.size)

        return { pages }
    }

    async findOne(
        id: string
    ): Promise<ResponseUserDto> {
        const user: any = await this.usersModel.findById(id, '_id login full_name email avatar').exec()

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const userDto = user._doc

        userDto.rating = await this.likesService.getUserRating(user)

        return userDto
    }

    async findById(
        id: string
    ): Promise<User> {
        const user = await this.usersModel.findById(id).exec()

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async findByLogin(
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
        const tempUserLogin = await this.usersModel.findOne({
            login: userDto.login
        }).exec()

        if (tempUserLogin) {
            throw new ConflictException('User with this login already exists')
        }

        const tempUserEmail = await this.usersModel.findOne({
            email: userDto.email
        }).exec()

        if (tempUserEmail) {
            throw new ConflictException('User with this email already exists')
        }

        const user = new this.usersModel(userDto)

        user.password = await hash(user.password, 10)

        return user.save()
    }

    async uploadAvatar(
        id: string,
        file: Express.Multer.File
    ) {
        const fileUploading = new Promise<string>((resolve, reject) => {
            s3.upload({
                Bucket: AWS_BUCKET,
                Key: `${id}.png`,
                Body: file.buffer,
                ACL: 'public-read'
            }, (err, data) => {
                err && reject(err)

                resolve(data.Location)
            })
        })

        const avatar = await fileUploading

        await this.usersModel.findByIdAndUpdate(id, { avatar }, { new: true })

        return {
            avatar
        }
    }

    async updateOne(
        id: string,
        userDto: UpdateUserDto
    ): Promise<User> {
        if (userDto.login) {
            const tempUser = await this.usersModel.findOne({
                login: userDto.login
            }).exec()
    
            if (tempUser) {
                throw new ConflictException('User with this login already exists')
            }
        }
        if (userDto.email) {
            const tempUserEmail = await this.usersModel.findOne({
                email: userDto.email
            }).exec()
    
            if (tempUserEmail) {
                throw new ConflictException('User with this email already exists')
            }
        }
        if (userDto.password) {
            userDto.password = await hash(userDto.password, 10)
        }

        return this.usersModel.findByIdAndUpdate(
            id,
            userDto,
            {
                new: true
            }
        ).exec()
    }

    async deleteOne(
        id: string
    ): Promise<User> {
        const user = await this.findById(id)
        const posts = await this.postsService.findAllByUser(user)
        const comments = await this.commentsService.findAllByUser(user)

        await Promise.all(
            comments.map(
                (comment: any) => this.commentsService.deleteOne(comment._id)
            )
        )

        await Promise.all(
            posts.map(
                (post: any) => this.postsService.deleteOne(post._id)
            )
        )

        return this.usersModel.findByIdAndDelete(id).exec()
    }
}
