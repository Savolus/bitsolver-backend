import { IsNotEmpty, MaxLength } from 'class-validator'

import { ValidationErrors } from '../../constants/validation-errors.constant'

export class CreateCommentDto {
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MaxLength(2047, { message: ValidationErrors.MAX_LENGTH })
    readonly content: string
}
