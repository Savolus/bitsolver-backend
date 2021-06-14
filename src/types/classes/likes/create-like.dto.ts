import { IsNotEmpty, IsEnum } from 'class-validator'

import { ValidationErrors } from '../../constants/validation-errors.constant'
import { LikeTypeEnum } from '../../enums/like-type.enum'

export class CreateLikeDto {
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsEnum(LikeTypeEnum, { message: ValidationErrors.IS_ENUM })
    readonly type: LikeTypeEnum
}
