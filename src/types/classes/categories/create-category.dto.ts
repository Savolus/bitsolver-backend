import { IsNotEmpty, MaxLength } from 'class-validator'

import { ValidationErrors } from '../../constants/validation-errors.constant'

export class CreateCategoryDto {
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MaxLength(255, { message: ValidationErrors.MAX_LENGTH })
    readonly title: string

    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MaxLength(1023, { message: ValidationErrors.MAX_LENGTH })
    readonly description: string
}
