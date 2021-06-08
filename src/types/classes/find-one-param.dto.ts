import {
  Length
} from 'class-validator'

import { ValidationErrors } from '../constants/validation-errors-constants'

export class FindOneParams {
	@Length(24, 24, { message: ValidationErrors.LENGTH })
	readonly id: string;
}
