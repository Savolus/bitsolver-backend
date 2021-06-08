import {
    IsOptional,
    IsNotEmpty,
    MaxLength
} from 'class-validator'

import { ValidationErrors } from '../../constants/validation-errors-constants'

export class UpdateCategoryDto {
    @IsOptional()
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MaxLength(255, { message: ValidationErrors.MAX_LENGTH })
    readonly title?: string

    @IsOptional()
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MaxLength(1023, { message: ValidationErrors.MAX_LENGTH })
    readonly description?: string
}
