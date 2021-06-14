import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post as PostMethod,
    Query,
    UseGuards
} from '@nestjs/common'

import { CreateCategoryDto } from '../types/classes/categories/create-category.dto'
import { UpdateCategoryDto } from '../types/classes/categories/update-category.dto'
import { PaginationQuery } from '../types/classes/pagination-query.dto'
import { FindOneParams } from '../types/classes/find-one-param.dto'
import { AdminAccessGuard } from '../guards/admin-access.guard'
import { CategoriesService } from './categories.service'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { Category } from '../schemes/category.schema'
import { Post } from '../schemes/post.schema'


@Controller('api/categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService
    ) {}

    @Get()
    findAll(
        @Query() query: PaginationQuery
    ): Promise<Category[]> {
        return this.categoriesService.findAll(query)
    }

    @Get(':id')
    findOne(
        @Param() params: FindOneParams
    ): Promise<Category> {
        return this.categoriesService.findById(params.id)
    }

    @Get(':id/posts')
    findPosts(
        @Param() params: FindOneParams
    ): Promise<Post[]> {
        return this.categoriesService.findByIdPosts(params.id)
    }

    @PostMethod()
    @UseGuards(JwtAuthGuard, AdminAccessGuard)
    createOne(
        @Body() categoryDto: CreateCategoryDto
    ): Promise<Category> {
        return this.categoriesService.createOne(categoryDto)
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, AdminAccessGuard)
    updateOne(
        @Param() params: FindOneParams,
        @Body() categoryDto: UpdateCategoryDto
    ): Promise<Category> {
        return this.categoriesService.updateOne(params.id, categoryDto)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminAccessGuard)
    deleteOne(
        @Param() params: FindOneParams
    ): Promise<Category> {
        return this.categoriesService.deleteOne(params.id)
    }
}
