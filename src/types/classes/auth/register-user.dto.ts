import {
    IsNotEmpty,
    IsAscii,
    IsEmail,
    MinLength,
    MaxLength
} from 'class-validator'

import { ValidationErrors } from '../../constants/validation-errors-constants'

export class RegisterUserDto {
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsAscii({ message: ValidationErrors.IS_ASCII })
    @MinLength(4, { message: ValidationErrors.MIN_LENGTH })
    @MaxLength(16, { message: ValidationErrors.MAX_LENGTH })
    readonly login: string

    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsEmail({}, { message: ValidationErrors.IS_EMAIL })
    readonly email: string

    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MinLength(8, { message: ValidationErrors.MIN_LENGTH })
    @MaxLength(24, { message: ValidationErrors.MAX_LENGTH })
    readonly password: string

    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MinLength(3, { message: ValidationErrors.MIN_LENGTH })
    @MaxLength(32, { message: ValidationErrors.MAX_LENGTH })
    readonly full_name: string
}
