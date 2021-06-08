import { Body, Controller, Delete, Get, Param, Patch, Post as PostMethod, UseGuards } from '@nestjs/common';
import { AdminAccessGuard } from 'src/guards/admin-access.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Category } from 'src/schemes/category.schema';
import { Post } from 'src/schemes/post.schema';
import { CreateCategoryDto } from 'src/types/classes/categories/create-category.dto';
import { UpdateCategoryDto } from 'src/types/classes/categories/update-category.dto';
import { FindOneParams } from 'src/types/classes/find-one-param.dto';
import { CategoriesService } from './categories.service';

@Controller('api/categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService
    ) {}

    @Get()
    findAll(): Promise<Category[]> {
        return this.categoriesService.findAll()
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
