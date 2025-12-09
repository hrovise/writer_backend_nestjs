import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';  
import { UnauthorizedException } from '@nestjs/common';
import { userRole } from 'src/shared/constExpressions/expressions';

@Injectable()
export class JwtAuthAdminGuard extends AuthGuard('jwt') {  

  handleRequest(err, user, info) {
   
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized');
    }

   
    if (user.role !== userRole.ADMIN) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    return user;  
  }
}