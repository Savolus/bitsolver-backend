import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'

import { AdminAccessGuard } from '../guards/admin-access.guard'
import { JwtStrategy } from '../strategies/jwt.strategy'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { JWT_SECRET } from '../config/configuration'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: JWT_SECRET
		}),
		UsersModule
	],
	providers: [
		AuthService,
		JwtStrategy,
		JwtAuthGuard,
		AdminAccessGuard
	],
	controllers: [ AuthController ],
	exports: [ AuthService, JwtModule ]
})

export class AuthModule {}
