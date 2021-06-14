import { Min, IsOptional } from 'class-validator'

import { ValidationErrors } from '../constants/validation-errors.constant'

export class PaginationQuery {
	@IsOptional()
	@Min(1, { message: ValidationErrors.MIN_VALUE })
	readonly page: number;
}
