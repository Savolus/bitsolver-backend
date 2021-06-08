import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AdminAccessGuard } from '../guards/admin-access.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JWT_SECRET } from '../config/configuration';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: JWT_SECRET
		}),
		forwardRef(() => UsersModule)
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
