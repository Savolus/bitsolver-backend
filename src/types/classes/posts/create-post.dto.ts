import {
    IsNotEmpty,
    IsArray,
    ArrayNotEmpty,
    ArrayContains,
    MaxLength
} from 'class-validator'

import { ValidationErrors } from '../../constants/validation-errors-constants'

export class CreatePostDto {
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MaxLength(255, { message: ValidationErrors.MAX_LENGTH })
    readonly title: string

    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MaxLength(4095, { message: ValidationErrors.MAX_LENGTH })
    readonly content: string

    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsArray({ message: ValidationErrors.IS_ARRAY })
    readonly categories: string[]
}
