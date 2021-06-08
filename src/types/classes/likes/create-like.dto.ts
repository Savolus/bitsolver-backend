import {
    IsNotEmpty,
    IsEnum,
    MaxLength
} from 'class-validator'
import { LikeTypeEnum } from 'src/types/enums/like-type.enum'

import { ValidationErrors } from '../../constants/validation-errors-constants'

export class CreateLikeDto {
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsEnum(LikeTypeEnum, { message: ValidationErrors.IS_ENUM })
    readonly type: LikeTypeEnum
}
