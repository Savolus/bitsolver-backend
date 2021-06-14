import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable } from '@nestjs/common'

import { IJwtUser } from '../types/interfaces/users/jwt-user.interface'
import { JWT_SECRET } from '../config/configuration'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: JWT_SECRET,
		})
	}

	validate(jwtUser: IJwtUser): IJwtUser {
		return jwtUser
	}
}
