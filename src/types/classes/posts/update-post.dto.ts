import {
    IsOptional,
    IsNotEmpty,
    IsArray,
    MaxLength
} from 'class-validator'
import { Category } from 'src/schemes/category.schema'

import { ValidationErrors } from '../../constants/validation-errors-constants'

export class UpdatePostDto {
    @IsOptional()
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MaxLength(255, { message: ValidationErrors.MAX_LENGTH })
    readonly title?: string

    @IsOptional()
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MaxLength(4095, { message: ValidationErrors.MAX_LENGTH })
    readonly content?: string

    @IsOptional()
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsArray({ message: ValidationErrors.IS_ARRAY })
    categories?: string[] | Category[]
}
