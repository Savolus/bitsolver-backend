import { Min, IsOptional } from 'class-validator'

import { ValidationErrors } from '../constants/validation-errors.constant'

export class PaginationQuery {
	readonly page?: number
	readonly size = 10
}
