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

import { ResponseCategoryDto } from '../types/classes/categories/response-category.dto'
import { CreateCategoryDto } from '../types/classes/categories/create-category.dto'
import { UpdateCategoryDto } from '../types/classes/categories/update-category.dto'
import { ResponseCountPagesDto } from '../types/classes/response-count-pages.dto'
import { ResponsePostDto } from '../types/classes/posts/response-post.dto'
import { PaginationQuery } from '../types/classes/pagination-query.dto'
import { FindOneParams } from '../types/classes/find-one-param.dto'
import { AdminAccessGuard } from '../guards/admin-access.guard'
import { CategoriesService } from './categories.service'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { Category } from '../schemes/category.schema'

@Controller('api/categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService
    ) {}

    @Get()
    findAll(
        @Query() query: PaginationQuery
    ): Promise<ResponseCategoryDto[]> {
        return this.categoriesService.findAll(query)
    }

    @Get('/pages')
    countPages(
        @Query() query: PaginationQuery
    ): Promise<ResponseCountPagesDto> {
        return this.categoriesService.countPages(query)
    }

    @Get(':id')
    findOne(
        @Param() params: FindOneParams
    ): Promise<ResponseCategoryDto> {
        return this.categoriesService.findOne(params.id)
    }

    @Get(':id/posts')
    findPosts(
        @Query() query: PaginationQuery,
        @Param() params: FindOneParams
    ): Promise<ResponsePostDto[]> {
        return this.categoriesService.findByIdPosts(params.id, query)
    }

    @Get(':id/posts/pages')
    countPostPages(
        @Query() query: PaginationQuery,
        @Param() params: FindOneParams
    ): Promise<ResponseCountPagesDto> {
        return this.categoriesService.countPostPages(params.id, query)
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
