import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IJwtUser } from 'src/types/interfaces/users/jwt-user.interface';

import { UserRoleEnum } from '../types/enums/user-role.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminAccessGuard implements CanActivate {
    constructor(
        private usersService: UsersService
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const jwtUser = request.user as IJwtUser

        try {
            const user = await this.usersService.findOneById(jwtUser.sub)

            return user.role === UserRoleEnum.ADMIN
        } catch {
            return false
        }
    }
}
