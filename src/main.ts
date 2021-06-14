import { ValidationError, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { ValidationExceptionClass } from './filters/validation.exception'
import { SERVER_PORT } from './config/configuration'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.enableCors({ origin: '*' })

	app.useGlobalPipes(
		new ValidationPipe({
			skipMissingProperties: true,
			exceptionFactory: (errors: ValidationError[]) => {
				return new ValidationExceptionClass(
					errors.map(error => {
						return {
							[error.property]: Object.values(error.constraints).reverse()
						}
					})
				)
			}
		})
	)

	await app.listen(SERVER_PORT)
}

bootstrap()
