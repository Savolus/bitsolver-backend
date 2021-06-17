import {
    ConflictException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { ResponseCategoryDto } from '../types/classes/categories/response-category.dto'
import { CreateCategoryDto } from '../types/classes/categories/create-category.dto'
import { UpdateCategoryDto } from '../types/classes/categories/update-category.dto'
import { PaginationQuery } from '../types/classes/pagination-query.dto'
import { Category, CategoryDocument } from '../schemes/category.schema'
import { PostsService } from '../posts/posts.service'
import { Post } from '../schemes/post.schema'
import { ResponsePostDto } from 'src/types/classes/posts/response-post.dto'
import { ResponseCountPagesDto } from 'src/types/classes/response-count-pages.dto'

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name)
        private readonly categoriesModel: Model<CategoryDocument>,
        @Inject(forwardRef(() => PostsService))
        private readonly postsService: PostsService
    ) {}

    async findAll(
        query: PaginationQuery
    ): Promise<ResponseCategoryDto[]> {
        let categories: Category[] = []

        if (+query.page) {
            const toSkip = (+query.page - 1) * +query.size

            categories = await this.categoriesModel.find().skip(toSkip).limit(+query.size).exec()
        } else {
            categories = await this.categoriesModel.find().exec()
        }

        return categories.map((category: any) => {
            const categoryDto = category._doc

            delete categoryDto.__v

            return categoryDto
        })
    }

    async countPages(
        query: PaginationQuery
    ): Promise<ResponseCountPagesDto> {
        const count = await this.categoriesModel.countDocuments().exec()
        const pages = Math.ceil(count / +query.size)

        return { pages }
    }

    async countPostPages(
        id: string,
        query: PaginationQuery
    ): Promise<ResponseCountPagesDto> {
        const category = await this.findById(id)
        const pages = Math.ceil(category.posts.length / +query.size)

        return { pages }
    }

    async findOne(
        id: string
    ): Promise<ResponseCategoryDto> {
        const category:any = await this.categoriesModel.findById(id).exec()

        if (!category) {
            throw new NotFoundException('Category not found')
        }

        const categoryDto = category._doc

        delete categoryDto.__v

        return categoryDto
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
        id: string,
        query: PaginationQuery
    ): Promise<ResponsePostDto[]> {
        const category = await this.findById(id)

        let posts = await Promise.all(
            category.posts.map(
                (post: any) => this.postsService.findOne(post._id)
            )
        )

        if (+query.page) {
            const toSkip = (+query.page - 1) * +query.size

            posts = posts.slice(toSkip)
            posts.length = +query.size
            posts = posts.filter(post => post && post)
        }

        return posts
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
