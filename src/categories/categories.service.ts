import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsService } from 'src/posts/posts.service';
import { Category, CategoryDocument } from 'src/schemes/category.schema';
import { Post } from 'src/schemes/post.schema';
import { CreateCategoryDto } from 'src/types/classes/categories/create-category.dto';
import { UpdateCategoryDto } from 'src/types/classes/categories/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name)
        private readonly categoriesModel: Model<CategoryDocument>
    ) {}

    findAll(): Promise<Category[]> {
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

    async findByTitle(
        title: string
    ): Promise<Category> {
        const category = await this.categoriesModel.findOne({ title }).exec()

        if (!category) {
            throw new NotFoundException('Category not found')
        }

        return category
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

    updateOne(
        id: string,
        categoryDto: UpdateCategoryDto
    ): Promise<Category> {
        return this.categoriesModel.findByIdAndUpdate(
            id,
            categoryDto,
            {
                new: true
            }
        ).exec()
    }

    updatePosts(
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
}
