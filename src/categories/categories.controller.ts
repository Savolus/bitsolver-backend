import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminAccessGuard } from 'src/guards/admin-access.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Category } from 'src/schemes/category.schema';
import { CreateCategoryDto } from 'src/types/classes/categories/create-category.dto';
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

    @Post()
    @UseGuards(JwtAuthGuard, AdminAccessGuard)
    createOne(
        @Body() categoryDto: CreateCategoryDto
    ): Promise<Category> {
        return this.categoriesService.createOne(categoryDto)
    }
}
