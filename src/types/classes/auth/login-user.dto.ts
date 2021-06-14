import {
    IsNotEmpty,
    IsAscii,
    MinLength,
    MaxLength
} from 'class-validator'

import { ValidationErrors } from '../../constants/validation-errors.constant'

export class LoginUserDto {
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsAscii({ message: ValidationErrors.IS_ASCII })
    @MinLength(4, { message: ValidationErrors.MIN_LENGTH })
    @MaxLength(16, { message: ValidationErrors.MAX_LENGTH })
    readonly login: string

    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MinLength(8, { message: ValidationErrors.MIN_LENGTH })
    @MaxLength(24, { message: ValidationErrors.MAX_LENGTH })
    readonly password: string
}
