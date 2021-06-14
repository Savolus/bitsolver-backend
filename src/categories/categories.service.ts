import {
    ConflictException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CreateCategoryDto } from '../types/classes/categories/create-category.dto'
import { UpdateCategoryDto } from '../types/classes/categories/update-category.dto'
import { PaginationQuery } from '../types/classes/pagination-query.dto'
import { Category, CategoryDocument } from '../schemes/category.schema'
import { PostsService } from '../posts/posts.service'
import { Post } from '../schemes/post.schema'

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name)
        private readonly categoriesModel: Model<CategoryDocument>,
        @Inject(forwardRef(() => PostsService))
        private readonly postsService: PostsService
    ) {}

    findAll(
        query: PaginationQuery
    ): Promise<Category[]> {
        if (query.page) {
            const toSkip = (query.page - 1) * +query.size

            return this.categoriesModel.find().skip(toSkip).limit(+query.size).exec()
        }

        return this.categoriesModel.find().exec()
    }

    async findById(
        id: string
    ): Promise<Category> {
        const category = await this.categoriesModel.findById(id).exec()

        if (!category) {
            throw new NotFoundException('Category not found')
        }

        return category
    }

    async findByIdPosts(
        id: string
    ): Promise<Post[]> {
        const category = await this.findById(id)

        return Promise.all(
            category.posts.map(
                (post: any) => this.postsService.findById(post._id)
            )
        )
    }

    async createOne(
        categoryDto: CreateCategoryDto
    ): Promise<Category> {
        const categoryTemp = await this.categoriesModel.findOne({
            title: categoryDto.title
        }).exec()

        if (categoryTemp) {
            throw new ConflictException('Category with this title already exists')
        }

        const categoty = new this.categoriesModel(categoryDto)

        return categoty.save()
    }

    async updateOne(
        id: string,
        categoryDto: UpdateCategoryDto
    ): Promise<Category> {
        if (categoryDto.title) {
            const tempPost = await this.categoriesModel.findOne({
                title: categoryDto.title
            }).exec()

            if (tempPost) {
                throw new ConflictException('Post with this title already exists')
            }
        }
        
        return this.categoriesModel.findByIdAndUpdate(
            id,
            categoryDto,
            {
                new: true
            }
        ).exec()
    }

    updatePostsAddOne(
        id: string,
        post: any
    ): Promise<Category> {
        return this.categoriesModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    posts: post._id
                }
            }
        ).exec()
    }

    updatePostsRemoveOne(
        id: string,
        post: any
    ): Promise<Category> {
        return this.categoriesModel.findByIdAndUpdate(
            id,
            {
                $pull: {
                    posts: post._id
                }
            }
        ).exec()
    }

    deleteOne(
        id: string
    ): Promise<Category> {
        return this.categoriesModel.findByIdAndDelete(id).exec()
    }
}
